// Useful Functions for developers and users

// External Helper Functions
function fallbackToDefault(val, def) {
    if (val === undefined) return def;
    else return val;
}

// pose history subset
function pastParts(pHistory, limb, param, start=0, end=1, interval=1) {
    if (pHistory.length == 0) return pose[limb][param];
    return pHistory.slice(start, end)
                   .filter((p, i) => i % interval === 0)
                   .map(p => p[limb][param])
}

function pastPose(pHistory, frames=0) {
    // bad practice!! But prevents a debugging error at the beginning
    if (pHistory.length == 0) return pose;

    else return pHistory[Math.min(pHistory.length - 1, frames)];
}

function inRange(x, min, max) { return ((x-min)*(x-max) <= 0); }

// Array Generators
function repeatOne(howMany=1) {
    return Array.from(new Array(howMany)).map((v, i) => 1);
}

function countTo(howMany=1) {
    return Array.from(new Array(howMany)).map((v, i) => i);
}

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

function goForwardOrBackward(options, video, howFar=1) {
    let currentTime = video.time();
    let newTime = max(0, min(currentTime+howFar/options.videoFramerate, video.duration()));
    video.time(newTime);
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
        // does z need to get scaled
    }
}

// This should not get called if we are in webcam mode
function scalePoseToWindow(options, pose) {
    if (options.webcam) return pose;
    let scaledPose = {keypoints:[], score: pose.score};

    // Very similar code from convertToML5Structure in blazeDetector
    // Should be refactored?
    pose.keypoints.forEach((kp, i) => {
        let sp = scalePositionToVideo(options, kp.position);
        scaledPose.keypoints.push({
            part: kp.part, // function from helpers
            score: kp.score, // posenet used confidence rather than score...
            position: {
                x: sp.x,
                y: sp.y,
                z: kp.z  // does z need to get scaled??
            }
        });
        scaledPose[kp.part] = {
            x: sp.x,
            y: sp.y,
            z: kp.z,
            confidence: kp.score
        };
    });

    return scaledPose;
}

function muteVideo(options, video, optionalSet) {
    if (optionalSet != undefined) options.muted = optionalSet;
    else options.muted = !options.muted;

    if (options.muted) video.volume(0.0);
    else video.volume(1.0);

    return;
}

function underscore_to_camelCase(old_word) {
    let newWord = old_word.replace(/_([a-z])/g, (m, w) => w.toUpperCase());
    return newWord;
}

async function modelLoader(url) {
    let modelURL = url + 'model.json';
    let metadataURL = url + 'metadata.json';

    return tmPose.load(modelURL, metadataURL);
}

// Good example around frame 260
function fillInEmptyPoints(pose, poseHistory) {
    //return pose;
    if (poseHistory.length == 0) return pose;
    let filledInPose = {keypoints: []};
    pose.keypoints.forEach((p) => {
        filledInPose[p.part] = {
            x: sanitize(p.position.x, poseHistory[0][p.part].x),
            y: sanitize(p.position.y, poseHistory[0][p.part].y),
            confidence: p.score
        }
        filledInPose.keypoints.push({
            position: {
                x: filledInPose[p.part].x,
                y: filledInPose[p.part].y,
            },
            part: p.part,
            score: p.score
        });
    });
    return filledInPose;
}

function sanitize(val, def) {
    if (isNaN(val) || val == 0) return def;
    else return val;
}
