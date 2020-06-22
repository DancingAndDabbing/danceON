// P5 Pose Editor
// STEM FROM DANCE | NYU - 2020

// BUG - Webcam turns off, but I can't deactivate the light
// https://stackoverflow.com/questions/11642926/stop-close-webcam-which-is-opened-by-navigator-getusermedia

// ----- Global Options -----
let options = {
    // Assume that if the user is using the webcam, we will run Posenet
    // Otherwise, we will wait for an uploaded JSON file
    webcam: false, // true or false
    posenetLoaded: false,
    finishedAnalyzing: false,

    // video options
    videoLoaded: false,
    videoToggle: 'videoToggle',
    webcamToggle: 'webcamToggle',
    videoLocation: 'assets/Balance001.mp4',
    videoPoses: 'assets/Balance001.json',
    videoFramerate: 30, // For Yoav - always 30?
    videoWidth: 640,
    videoHeight: 480,
    videoScale: undefined,
    videoVerticalShift: 0,
    videoHorizontalShift: 0,
    playing: false, // TODO - use this
    recording: false, // true or false
    audioStream: undefined,
    // frameNum?

    playbarHeight: 40,

    modelURL: 'https://teachablemachine.withgoogle.com/models/VYlFXZf_k/',

    // posenet options
    posesFunction: gotPoses, // see below

    // UI Overlay toggles
    toggles: ['mousePosition', 'skeleton', 'ml'],
    mousePosition: false,
    skeleton: false,
    ml: false
}


// ----- Global Pose Variables -----
let canvas;

let pose; // Current pose
let poseHistory = [];
let classification;
let video; // Video source - either preloaded or webcam

let playBar;

// Depending on poseNet option we will use either of these
let poseNet; // Machine Learning Algorithm for detecting poses
let preprocessedPoses; // Array of poses captured in advance by frame

let poser; // Code API - This will all parsing/running of user code

let recorder; // For storing recording after button pressed

let tmClassifier;
// -----                                       -----

// ----- Main P5 Functions -----
function preload() {
    //preprocessedPoses = preloadJSON(options);
    tmClassifier = new TMClassifier(options);
    //tmClassifier.loadJSON(options);
    tmClassifier.loadModel(() => playPauseVideo(true));

}

function setup() {
    // Video and pose setup - calls functions in setup_script.js
    poser = new Poser(myData);
    video = startVideo(options);
    video.onended((elt) => stopRecording(elt, options));
    console.log(video);

    //preprocessedPoses = preprocessedPoses.data; // Use default JSON

    // Toggle between Webcam and Video
    select(`#${options.videoToggle}`).mouseClicked(() => {
        if (!options.webcam) return;
        options.webcam = false;
        poseHistory = [];
        poser.clearMovers();

        //poseNet = stopPoseNet(poseNet);

        // Attempts at disabling webcam light
        video.pause();
        video.src = "";
        video.srcObject = null;

        navigator.getUserMedia({audio: true, video: true},
            (stream => stream.getTracks().forEach( (track) => track.stop())),
            (error => console.log('getUserMedia() error', error))
        );

        // Start video this time with video
        video = startVideo(options);
        video.onended((elt) => stopRecording(elt, options));
    });

    select(`#${options.webcamToggle}`).mouseClicked(() => {
        if (options.webcam) return;
        options.webcam = true;
        options.playing = false;

        poseHistory = [];
        poser.clearMovers();

        video.clearCues(); // currently no cues
        video._onended = undefined;

        // Start video - this time with webcam
        video = startVideo(options);
        //poseNet = startPoseNet(options, poseNet, video);
    });

    // Editor/Poser API
    poser.update(declarations.getValue());
    declarations.on('change', function(e) {
        poser.update(declarations.getValue());
    });

    // p5 Canvas Setup
    noCursor();
    canvas = createCanvas(options.videoWidth,
        options.videoHeight + options.playbarHeight);
    canvas.parent('p5Canvas');

    playBar = new PlayBar(options);

    // Mouse Click Events on Canvas - Disable if recording
    canvas.mouseClicked(() => {
        // animate the cursor
        if ((!options.webcam) && playBar.overPlayButton()) playPauseVideo();
        else if ((!options.webcam) && playBar.overBar()) changeFrame(playBar.getFrame());
        else if ((!options.webcam) && playBar.overRecordButton()) startRecording(options, video); // ?? Canvas
        else {console.log(tmClassifier)}
        // other ideas include getting the coordinates
        // and getting the skeleton part
        return false; // prevent default
    });

    // Connect toggles in GUI to options
    options.toggles.forEach(t => {
        select(`#${t}`).changed(() => {
            options[t] = select(`#${t}`).checked();
        })
    });
}

function draw() {
    background(220);

    // Things loading
    if (!tmClassifier.loaded) { return false; }
    if (!options.webcam && !options.videoLoaded) { return false; }

    // Video Mode
    if (!options.webcam) {
        let frameNum = getFrame(options, video);
        let pc = tmClassifier.predictForVideo(video, frameNum);
        pose = pc.pose;
        classification = pc.pose;

        console.log('pose', pc, frameNum);

        playBar.update({playing: options.playing, frameNum: frameNum,
                totalFrames: floor(video.duration() * options.videoFramerate)}); // write total frames function please...
        playBar.draw();
    }

    image(video, 0, 0, ...resizeVideo(options, video));

    // Draw on top of the image using pose
    if (pose) {
        let scaledPose = scalePoseToWindow(options, pose);

        if (options.playing) {
            poseHistory.unshift(scaledPose);
            if (poseHistory.length >= 1000) poseHistory.pop();
        }

        if (options.skeleton && !options.recording) skeleton(scaledPose);

        try {
            poser.execute(scaledPose, poseHistory); // check if any issues occur on return

        } catch (e) {
            // missing key (e.g)
            push();
            background('rgba(30, 30, 30, 0.9)');
            textAlign(CENTER);
            fill(255);
            text('ERROR', width/2, height/2);
            text(e, width/2, height/2 + 20);
            pop();
            //
        }
    }

    // Display cursor, but not during record to prevent it from appearing
    if (!options.recording) {
        cursorIcon();
        if (options.mousePosition) cursorPosition();
    }
}


// ----- Other Functions -----

// Update the pose variable
function gotPoses(poses) {
    if (poses.length > 0) pose = poses[0].pose;
}

// Play or Pause the video - if a value is passed, do that
// If a value is not passed it will check the state of the media object
function playPauseVideo(optionalValue, disableLoop) {
    if (optionalValue == undefined) {
        if (video.elt.paused || video.elt.ended) options.playing = true;
        else options.playing = false;
    }
    else options.playing = !!optionalValue;

    if (options.playing && disableLoop) {
        video.elt.loop = false;
        video.play();
    }
    else if (options.playing) video.loop();
    else video.pause();
}

function startRecording(options, video) {
    if (options.webcam) return; // don't support webcam recording
    poser.clearMovers(); // clear movers
    poseHistory = []; // clear poseHistory

    // Resize the canvas so that the play bar disappears
    // (This would otherwise show up in the video!)
    resizeCanvas(options.videoWidth, options.videoHeight);
    toggleRecordingNotifier(true); // Recording indicator

    // Start the video from the beginning and ensure that it does not loop
    // (Recording stops when the video ends - looping would prevent callback)
    video.stop();
    playPauseVideo(true, true);

    // Start recording the canvas
    recorder = record(options, recorder, canvas);

    // When recording is true, all the overlays and the cursor will disappear
    // Click events on canvas are also disabled
    options.recording = true;
}

function stopRecording(elt, options) {
    if (!options.recording) return;

    if (recorder) recorder.stop();
    options.recording = false;
    playPauseVideo(false);

    // Remove the notification and display the playbar again
    toggleRecordingNotifier(false);
    resizeCanvas(options.videoWidth, options.videoHeight + options.playbarHeight);
}

// Scrubbing function - doesn't seem to work in local host - will set to 0
function changeFrame(frameNum) {
    video.time(getTimeFromFrame(frameNum, options.videoFramerate));
}

// Overlays to draw
// Refactor - move to different file

// May become a class
function cursorIcon() {
    push();

    stroke(255);
    fill('rgba(30, 30, 30, 0.5)');
    circle(constrain(mouseX, 0, width), constrain(mouseY, 0, height), 6);

    pop();
}

function cursorPosition() {
    push();

    noStroke();
    fill('rgba(30,30,30, 0.5)');
    rect(
        constrain(mouseX-4, 4, options.videoWidth-44),
        constrain(mouseY-34, 2, options.videoHeight-34),
        40, 30, 4);

    fill(255);
    text(
        `x: ${floor(constrain(mouseX, 0, options.videoWidth))}`,
        constrain(mouseX, 8, options.videoWidth-40),
        constrain(mouseY-22, 14, options.videoHeight-22)
    );
    text(
        `y: ${floor(constrain(mouseY, 0, options.videoHeight))}`,
        constrain(mouseX, 8, options.videoWidth-40),
        constrain(mouseY-10, 26, options.videoHeight-10),
    );

    pop();
}

function skeleton(pose) {
    push();
    textAlign('center');
    noStroke();

    // draw skeleton - update the JSON file
    // issue - text doesn't display properly if points too close
    pose.keypoints.forEach((p, i) => {
        let sx = p.position.x;
        let sy = p.position.y;

        fill('rgba(255, 255, 255, 0.9)');
        circle(sx, sy, 8);
        if (!options.playing && dist(mouseX, mouseY, sx, sy) < 8) {
                fill('rgba(30,30,30, 0.5)');
                rect(sx-37, sy+8, 74, 16, 4); // improvement - respond to text

                fill(255);
                text(p.part, sx, sy+20);
            }
    });
    pop();
}
