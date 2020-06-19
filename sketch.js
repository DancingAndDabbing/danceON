// P5 Pose Editor
// STEM FROM DANCE | NYU - 2020

// ----- Global Options -----
let options = {
    webcam: false, // true or false
    poseNet: false, // true or false
    record: false, // true or false

    // video options
    videoLocation: 'assets/Balance001.mp4',
    videoPoses: 'assets/Balance001.json',
    videoFramerate: 30, // For Yoav - always 30?
    videoWidth: 640,
    videoHeight: 480,
    videoScale: undefined,
    videoVerticalShift: 0,
    videoHorizontalShift: 0,
    playing: false, // TODO - use this
    // frameNum?

    playbarHeight: 40,

    // posenet options
    posesFunction: gotPoses, // see below

    // UI toggles
    toggles: ['mousePosition', 'skeleton'],
    mousePosition: false,
    skeleton: false,
}


// ----- Global Pose Variables -----
let pose; // Current pose
let poseHistory = [];
let video; // Video source - either preloaded or webcam

let playBar;

// Depending on poseNet option we will use either of these
let poseNet; // Machine Learning Algorithm for detecting poses
let preprocessedPoses; // Array of poses captured in advance by frame
// -----                                       -----

let poser;


// ----- Main P5 Functions -----
function preload() {
    preprocessedPoses = preloadJSON(options); // may not need to do
}

function setup() {
    // Video and pose setup - calls functions in setup_script.js
    poser = new Poser(myData);
    [video, poseNet] = startVideo(options);
    preprocessedPoses = preprocessedPoses.data;

    poser.update(declarations.getValue());
    declarations.on('change', function(e) {
        poser.update(declarations.getValue());
    });

    // p5 canvas setup
    noCursor();
    let canvas = createCanvas(options.videoWidth,
        options.videoHeight + options.playbarHeight);
    canvas.parent('p5Canvas');

    playBar = new PlayBar(options);

    // Mouse Click Events
    canvas.mouseClicked(() => {
        // animate the cursor
        if (playBar.overPlayButton()) playPauseVideo();
        else if (playBar.overBar()) changeFrame(playBar.getFrame());

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
    if (!options.webcam) {
        let frameNum = min(
            getFrame(options, video), preprocessedPoses.length - 1);
        gotPoses(preprocessedPoses[frameNum]);

        playBar.update({playing: options.playing, frameNum: frameNum,
                        totalFrames: preprocessedPoses.length - 1});
        playBar.draw();
    }

    image(video, 0, 0, ...resizeVideo(options, video)); // Deal with resize

    // Draw on top of the image using pose
    if (pose) {
        let scaledPose = scalePoseToWindow(options, pose);

        if (options.playing) {
            poseHistory.unshift(scaledPose);
            if (poseHistory.length >= 1000) poseHistory.pop();
        }

        if (options.skeleton) skeleton(scaledPose);

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

    cursorIcon();
    if (options.mousePosition) cursorPosition(); // disable during record

}


// ----- Other Functions -----

// Update the pose variable
function gotPoses(poses) {
    if (poses.length > 0) pose = poses[0].pose;
}

function playPauseVideo() {
    if (video.elt.paused || video.elt.ended) {
        options.playing = true;
        video.loop();
    }
    else {
        options.playing = false;
        video.pause();
    }
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
