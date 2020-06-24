// Useful Functions for developers and users

// External Helper Functions
function fallbackToDefault(val, def) {
    if (val === undefined) return def;
    else return val;
}

// pose history subset
function historySubset(pHistory, limb, param, start=0, end=1, interval=1) {
    return pHistory.slice(start, end)
                   .filter((p, i) => i % interval === 0)
                   .map(p => p[limb][param])
}

function inRange(x, min, max) { return ((x-min)*(x-max) <= 0); }

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

function getTotalFrames(options, video) {
    if (!video) return 0;
    return floor(video.duration() * options.videoFramerate);
}

function resizeVideo(options, video) {
    if (!options.webcam) return [
        video.width * options.videoScale,
        video.height * options.videoScale
    ]
    else return [video.width, video.height];
}

// Need also to support up/down shifting
function scalePositionToVideo(options, position) {
    return {
        x: position.x * options.videoScale,
        y: position.y * options.videoScale
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
