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
    finishedSetup: false,

    // video options
    videoLoaded: false,
    videoToggle: 'videoToggle',
    webcamToggle: 'webcamToggle',
    videoUpload: 'videoUpload',
    poseUpload: 'poseUpload',
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

    // UI Overlay toggles
    toggles: ['mousePosition', 'skeleton', 'ml'],
    mousePosition: false,
    skeleton: false,
    ml: false
}


// ----- Global Pose Variables -----
let canvas;

let pose; // Current pose
let poseHistory = []; // Recent history of poses

let tmClassifier; // Teachable Machine classifier
let prediction; // Current prediction

let video; // Video source - either preloaded or webcam
let recorder; // For storing recording after button pressed
let playBar; // Controls shown during video mode

let poser; // Code API - This will all parsing/running of user code

// -----                                       -----

// ----- Main P5 Functions -----
function preload() {
    //preprocessedPoses = preloadJSON(options);
    tmClassifier = new TMClassifier();
    tmClassifier.loadJSON(options);
    tmClassifier.loadModel(options, () => playPauseVideo(true));
}

function setup() {
    // p5 Canvas Setup
    canvas = createCanvas(options.videoWidth,
        options.videoHeight + options.playbarHeight);
    canvas.parent('p5Canvas');
    noCursor();

    playBar = new PlayBar(options);

    // Video and pose setup - calls functions in setup_script.js
    poser = new Poser(myData);
    video = startVideo(options);
    video.onended((elt) => stopRecording(elt, options));
    tmClassifier.onComplete(() => toggleAnalyzingNotifier(false)); // Callback

    // Toggle between Webcam and Video
    // Refactor: These should really be their own functions
    select(`#${options.videoToggle}`).mouseClicked(() => {
        if (!options.webcam) return;
        options.webcam = false;
        handleVideoToggle(() => {
            if (!tmClassifier.gotAllFrames) {
                toggleAnalyzingNotifier(true);
            }
        });
    });

    select(`#${options.webcamToggle}`).mouseClicked(() => {
        if (options.webcam) return;
        options.webcam = true;
        handleWebCamToggle();
    });

    // This will upload the file, attempt to switch to the video source, and
    // clear out the old classifier if successful
    document.getElementById(options.videoUpload).addEventListener('change', (ev) => {
        // In case there are problems, we'll revert back
        //if (!finishedSetup) return;
        if (!(ev.target.files && ev.target.files[0]))  {
            alert("No video file found. We'll keep using the old one.");
            return;
        }

        options.videoLoaded = false;
        let oldVideoLocation = options.videoLocation;
        options.videoLocation = URL.createObjectURL(ev.target.files[0]);
        let newFileURL = ev.target.value;

        activateVideoButton();
        options.webcam = false;
        playPauseVideo(false);

        try {
            handleVideoToggle(() => {
                toggleAnalyzingNotifier(true);
                tmClassifier.resetForNewVideo();
                options.videoLoaded = true;
                updateVideoFileText(newFileURL);
                updatePoseFileText("", false);
                playPauseVideo(true);
            });

        } catch (err) {
            console.log(err);
            options.videoLocation = oldVideoLocation;
            handleVideoToggle(() => {
                if (!tmClassifier.gotAllFrames) {
                    toggleAnalyzingNotifier(true);
                    playPauseVideo(true);
                }
                options.videoLoaded = true;
            });
            alert("Something wrong with that video file. We'll keep using the old one.")
        }
    });

    document.getElementById(options.poseUpload).addEventListener('change', (ev) => {
        if (ev.target.value == '') return;
        if (!(ev.target.files && ev.target.files[0]))  {
            alert("No pose file found. We'll keep using the old one.");
            return;
        }

        let newFileURL = ev.target.value;
        let oldPoseLocation = options.videoPoses;
        options.videoPoses = URL.createObjectURL(ev.target.files[0]);

        tmClassifier.loadJSON(options,
            (() => updatePoseFileText(newFileURL)), // Success handler
            (() => options.videoPoses = oldPoseLocation) // Fail handler
        );
    });

    // Editor/Poser API
    poser.update(declarations.getValue());
    declarations.on('change', function(e) {
        poser.update(declarations.getValue());
    });

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

    // Things still loading - don't try to draw or calculate anything
    if (!tmClassifier.loaded) { return false; }
    if (!options.webcam && !options.videoLoaded) { return false; }

    // Detection and prediction for Video Mode (nonblocking)
    if (!options.webcam) {
        let frameNum = getFrame(options, video);
        let totalFrames = getTotalFrames(options, video);
        let pp = tmClassifier.predictForVideo(options, video, frameNum);

        // One or both of these may return undefined if it has not been
        // calculated yet
        pose = pp.pose;
        prediction = pp.prediction;

        playBar.update({playing: options.playing, frameNum: frameNum, totalFrames: totalFrames});
        playBar.draw();
    }

    // Detection and prediction for Webcam (blocking)
    else {
        let pp = tmClassifier.predictForWebcam(video, frameNum);
        pose = pp.pose;
        prediction = pp.prediction;

        // Draw something equivalent to the playbar at the bottom
    }

    // Draw the current frame of the video at the proper size
    image(video, 0, 0, ...resizeVideo(options, video));

    // Draw on top of the image using pose and prediction
    if (pose) {
        let scaledPose = scalePoseToWindow(options, pose);

        // Only add to history if the video is not paused, or we are
        // using the webcam
        if (options.playing || options.webcam) {
            poseHistory.unshift(scaledPose);
            if (poseHistory.length >= 1000) poseHistory.pop();
        }

        if (options.skeleton && !options.recording) skeleton(scaledPose);

        try {
            poser.execute(scaledPose, poseHistory); // check if any issues occur on return
        } catch (e) {
            push();
            background('rgba(30, 30, 30, 0.9)');
            textAlign(CENTER);
            fill(255);
            text('Hmmm...', width/2, height/2);
            text(e, width/2, height/2 + 20);
            pop();
            //
        }
    }

    // Draw movers here - they should keep going even if the current frame
    // does not have a pose

    // Display cursor, but not during record to prevent it from appearing
    if (!options.recording) {
        cursorIcon();
        if (options.mousePosition) cursorPosition();
    }
}


// ----- Other Functions -----

function handleVideoToggle(callback=undefined) {
    poseHistory = [];
    poser.clearMovers();

    // Attempts at disabling webcam light
    video.pause();
    video.src = "";
    video.srcObject = null;

    navigator.getUserMedia({audio: true, video: true},
        (stream => stream.getTracks().forEach( (track) => track.stop())),
        (error => console.log('getUserMedia() error', error))
    );

    // Start video this time with video source
    video = startVideo(options, callback);
    video.onended((elt) => stopRecording(elt, options));
}

function handleWebCamToggle() {
    options.playing = false;

    poseHistory = [];
    poser.clearMovers();

    video._onended = undefined;

    // Start video - this time with webcam
    video = startVideo(options, () => toggleAnalyzingNotifier(false));
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
