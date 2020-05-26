function getFrame(video, options) {
    return 0;
}

function getFrameFromTime(time, vidFramerate) {
    return min(floor(time * vidFramerate), preprocessedPoses.length - 1); // not defined here
}

function getTimeFromFrame(frame, vidFramerate) {
    return frame/vidFramerate; // may need to check against duration
}
