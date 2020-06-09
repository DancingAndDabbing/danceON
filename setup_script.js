function preloadJSON(options) {
    let preprocessedPoses = {};
    if (!options.webcam) {
        preprocessedPoses = loadJSON(options.videoPoses);
    }

    return preprocessedPoses;
}

function startVideo(options) {
    let video;

    if (options.webcam) video = createCapture(VIDEO);
    else video = createVideo(options.videoLocation, videoLoaded);

    video.hide();

    if (options.poseNet) return [video, startPoseNet(options, video)];
    else return [video, undefined];
}

function startPoseNet(options, video) {
    // problematic since options.video may differ
    let poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', options.posesFunction);

    return poseNet;
}

function videoLoaded() { console.log('ML5 Model Loaded!'); }
function modelLoaded() { console.log('Video Loaded!'); }
