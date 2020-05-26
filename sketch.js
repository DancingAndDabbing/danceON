// P5 Pose Starter
// STEM FROM DANCE | NYU - 2020

// The most important thing to know is that you can use the pose variable
// and you have the option of switching between the webcam and any other videos
// you've made

// ----- Global Options - Change Me! -----
let options = {
    webcam: false, // true or false
    poseNet: false, // true or false
    record: false, // true or false

    videoLocation: 'assets/Balance001.mp4',
    videoPoses: 'assets/Balance001.json',
    videoFramerate: 30,

    posesFunction: gotPoses // see below
}


// ----- Global Pose Variables - Don't change (without reason)! -----
let pose; // Will contain the most recent pose detected or in the video
let video; // Video source - either preloaded or webcam

// Depending on poseNet option we will use either of these
let poseNet; // Machine Learning Algorithm for detecting poses
let preprocessedPoses; // Array of poses captured in advance by frame
// -----                                       -----


// Add other global variables here!
// ...


// ----- Main P5 Functions - Called in order -----
function preload() {
    preprocessedPoses = preloadJSON(options);
}

function setup() {
    [video, poseNet] = startVideo(options);

    // Set other variables here!

    createCanvas(400, 400);
}

function draw() {
    if (!options.webcam) gotPoses(preprocessedPoses[getFrame(options, video)]);

    background(220);
    image(video, 0, 0); // Deal with resize

    // Draw on top of the image
}

// ----- Other Custom Functions -----

// Update the pose variable
function gotPoses(poses) {
    if (poses.length > 0) pose = poses[0].pose;
}
