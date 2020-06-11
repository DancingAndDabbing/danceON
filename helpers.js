// Useful Functions for developers and users

// External Helper Functions

// pose history subset

// Internal Helper Functions
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
    else return [video.width, video.height];
}

// Need also to support up/down shifting
function scalePositionToVideo(options, position) {
    return {
        x: position.x * options.videoWidthScale,
        y: position.y * options.videoHeightScale
    }
}

// This should not get called if we are in webcam mode
function scalePoseToWindow(options, pose) {
    let scaledPose = {keypoints:[]};

    pose.keypoints.forEach(k => {
        let sp = scalePositionToVideo(options, k.position);
        scaledPose.keypoints.push({
            position: {x: sp.x, y: sp.y},
            score: k.score,
            part: k.part
        });
        scaledPose[k.part] = {
            x: sp.x,
            y: sp.y,
            confidence: k.score
        }
    });

    return scaledPose;
}
