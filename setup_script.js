// Video
function startVideo(options, callback) {
    let video;

    if (options.webcam) video = createCapture(VIDEO, () => webcamLoaded(options, video, callback));
    else {
        video = createVideo(options.videoLocation, () => videoLoaded(options, video, callback))};

    return video;
}

// This should get called at the beginning and if a new video has been uploaded
// Currently only sets the scale by height - this assumes that it is wider
// than tall - we will need to check both cases and recenter
function setVideoScale(options, video) {
    if (video.width > video.height) {
        options.videoHeight = 360;
        options.videoWidth = 640;
        options.videoScale = options.videoHeight / (video.height);
        resizeCanvas(options.videoWidth, options.videoHeight + options.playbarHeight);
    }
    else {
        options.videoWidth = 300;
        options.videoHeight = 533;
        options.videoScale = options.videoWidth / (video.width);
        resizeCanvas(options.videoWidth, options.videoHeight + options.playbarHeight);
    }

}

// On Load Events
function videoLoaded(options, video, callback) {
    setVideoScale(options, video);
    video.elt.muted = true;
    video.elt.playsInline = true;
    video.hide();

    options.videoLoaded = true;

    // fix the size of the editor in case the video size changes
    // this prevents a bug in which we lose the horizontal scrollbar
    options.editor.resize(true);

    if (callback != undefined) callback();

    console.log('Video Loaded!');
}

function webcamLoaded(options, video, callback) {
    setVideoScale(options, video);
    video.hide();

    options.editor.resize(true);
    if (callback != undefined) callback();

    console.log('Webcam Loaded!');
}
