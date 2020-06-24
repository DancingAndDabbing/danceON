// Video
function startVideo(options, callback) {
    let video;

    if (options.webcam) video = createCapture(VIDEO, () => webcamLoaded(options, video, callback));
    else video = createVideo(options.videoLocation, () => videoLoaded(options, video, callback));

    video.hide();

    return video;
}

// This should get called at the beginning and if a new video has been uploaded
// Currently only sets the scale by height - this assumes that it is wider
// than tall - we will need to check both cases and recenter
function setVideoScale(options, video) {
    options.videoScale = options.videoHeight / (video.height);
}

// PoseNet
function startPoseNet(options, poseNet, video) {
    // I always seem to need to declare a new poseNet object
    // I can't seem to simply change the video source of an
    // existing one

    poseNet.on('pose', options.posesFunction);

    return poseNet;
}

// Clears the events and video connection of posenet
// Not sure if there is a better way of handling it
function stopPoseNet(poseNet) {
    if(!poseNet) return;
    poseNet._events = {};
    poseNet.video = undefined;
    //poseNet = undefined;

    return poseNet;
}

// On Load Events
function videoLoaded(options, video, callback) {
    setVideoScale(options, video);

    options.videoLoaded = true;
    if (callback != undefined) callback();

    console.log('Video Loaded!');
}

function webcamLoaded(options, video, callback) {
    setVideoScale(options, video);

    if (callback != undefined) callback();

    console.log('Webcam Loaded!');
}
