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
    else video = createVideo(options.videoLocation, () => videoLoaded(options, video));

    video.hide();

    if (options.poseNet) return [video, startPoseNet(options, video)];
    else return [video, undefined];
}

// This should get called at the beginning and if a new video has been uploaded
function setVideoScale(options, video) {
    options.videoScale = options.videoHeight / (video.height);
    console.log(options.videoScale);
}

function startPoseNet(options, video) {
    // problematic since options.video may differ
    let poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', options.posesFunction);

    return poseNet;
}

function videoLoaded(options, video) {
    setVideoScale(options, video);
    console.log('Video Loaded!');

}
function modelLoaded() { console.log('ML5 Model Loaded!'); }
