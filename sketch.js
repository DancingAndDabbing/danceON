// P5 Pose Starter
// STEM FROM DANCE | NYU - 2020

// The most important thing to know is that you can use the pose variable
// and you have the option of switching between the webcam and any other videos
// you've made.

// https://docs.google.com/spreadsheets/d/1vYps_m7VXY-EtISOMcOuVPCls3WrKoBZEqiOAQdI6bw/edit?usp=sharing

// ----- Global Options - Change Me! -----
let options = {
    webcam: false, // true or false
    poseNet: false, // true or false
    record: false, // true or false

    // change to use your own video
    videoLocation: 'assets/Balance001.mp4',
    videoPoses: 'assets/Balance001.json',
    videoFramerate: 30, // For Yoav - always 30?
    videoWidthScale: 0.5,
    videoHeightScale: 0.5,

    posesFunction: gotPoses, // see below

    mousePosition: false,
    skeleton: false,
}


// ----- Global Pose Variables - Don't change (without reason)! -----
let pose; // Current pose
let poseHistory = [];
let video; // Video source - either preloaded or webcam

// Depending on poseNet option we will use either of these
let poseNet; // Machine Learning Algorithm for detecting poses
let preprocessedPoses; // Array of poses captured in advance by frame
// -----                                       -----

let poser;

// Add other global variables here!
// ...


// ----- Main P5 Functions - Called in order -----
function preload() {
    preprocessedPoses = preloadJSON(options); // may not need to do
}

function setup() {
    poser = new Poser(myData);
    [video, poseNet] = startVideo(options);
    preprocessedPoses = preprocessedPoses.data;

    // Get the content in editor
    /*select('#runCode').mousePressed(function() {
        poser.update(declarations.getValue());
    });*/

    poser.update(declarations.getValue());
    declarations.on('change', function(e) {
        //console.log(declarations.getValue());
        poser.update(declarations.getValue());
    });

    noCursor();

    let canvas = createCanvas(640, 480);
    canvas.parent('p5Canvas');

    canvas.mouseClicked(playPauseVideo);

    // Refactor (list of checkbox strings)
    select('#mousePosition').changed(function() {
        options.mousePosition = select('#mousePosition').checked();
    });
    select('#skeleton').changed(function() {
        options.skeleton = select('#skeleton').checked();
    });
}

function draw() {
    if (!options.webcam) {
        let frameNum = min(
            getFrame(options, video), preprocessedPoses.length - 1);
        gotPoses(preprocessedPoses[frameNum]);
    }

    background(220);
    image(video, 0, 0, ...resizeVideo(options, video)); // Deal with resize

    // Draw on top of the image using pose


    if (pose) {
        /*let [scaledX, scaledY] = scaleXAndYToVideo(
            options, pose.nose.x, pose.nose.y);
        ellipse(scaledX, scaledY, 10);*/
        if (!(video.elt.paused || video.elt.ended)) {
            poseHistory.unshift(pose);
            if (poseHistory.length >= 1000) poseHistory.pop();
        }

        if (options.skeleton) skeleton(pose);

        try {
            poser.execute(pose, poseHistory); // check if any issues occur on return

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
    if (video.elt.paused || video.elt.ended) video.loop();
    else video.pause();
}

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
        constrain(mouseX-4, 4, width-44),
        constrain(mouseY-34, 2, height-34),
        40, 30, 4);

    fill(255);
    text(
        `x: ${floor(constrain(mouseX, 0, width))}`,
        constrain(mouseX, 8, width-40),
        constrain(mouseY-22, 14, height-22)
    );
    text(
        `y: ${floor(constrain(mouseY, 0, height))}`,
        constrain(mouseX, 8, width-40),
        constrain(mouseY-10, 26, height-10),
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
        let [sx, sy] = scaleXAndYToVideo(options, p.position.x, p.position.y);
        fill('rgba(255, 255, 255, 0.9)');
        circle(sx, sy, 8);
        if ((video.elt.paused || video.elt.ended) &&
            dist(mouseX, mouseY, sx, sy) < 8) {
                fill('rgba(30,30,30, 0.5)');
                rect(sx-37, sy+8, 74, 16, 4); // improvement - respond to text

                fill(255);
                text(p.part, sx, sy+20);
            }
    });
    pop();
}
