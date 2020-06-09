function getFrame(options, video) {
    if (!video) return 0;
    return getFrameFromTime(video.time(), options.videoFramerate);
}

function getFrameFromTime(time, vidFramerate) {
    return floor(time * vidFramerate);
}

function getTimeFromFrame(frame, vidFramerate) {
    return frame/vidFramerate; // may need to check against duration
}

function resizeVideo(options, video) {
    if (!options.webcam) return [
        video.width * options.videoWidthScale,
        video.height * options.videoHeightScale
    ]
    else return [video.width, video.height]
}

function scaleXAndYToVideo(options, xVal, yVal) {
    if (!options.webcam) return [
        xVal * options.videoWidthScale,
        yVal * options.videoHeightScale
    ]
    else return [xVal, yVal]
}
