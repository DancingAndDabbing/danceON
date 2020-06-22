// JSON
function preloadJSON(options) {
    let preprocessedPoses = {};
    if (!options.webcam) {
        preprocessedPoses = loadJSON(options.videoPoses);
    }

    return preprocessedPoses;
}

// Video
function startVideo(options) {
    let video;

    if (options.webcam) video = createCapture(VIDEO, () => webcamLoaded(options, video));
    else video = createVideo(options.videoLocation, () => videoLoaded(options, video));

    video.hide();

    return video;
    //if (options.webcam) return [video, startPoseNet(options, video)];
    //else return [video, undefined];
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
    poseNet = ml5.poseNet(video, { // settings value speed over accuracy
        imageScaleFactor: 0.2,
        inputResolution: 257,
        quantBytes: 2,
        multiplier: 0.50
    }, () => modelLoaded(options),);
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
function videoLoaded(options, video) {
    setVideoScale(options, video);

    let audioContext = new AudioContext();
    let dest = audioContext.createMediaStreamDestination();
    options.audioStream = dest.stream;
    let sourceNode = audioContext.createMediaElementSource(video.elt);
    sourceNode.connect(dest)

    console.log('Video Loaded!');
}

function webcamLoaded(options, video) {
    setVideoScale(options, video);
    console.log('Webcam Loaded!');
}

function modelLoaded(options) {
    options.posenetLoaded = true;
    console.log('PoseNet Loaded!');
}
