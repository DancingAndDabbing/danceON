// The D section of content
let DTITLES = ['pose', 'poseHistory', 'all keypoints'];

let d1a = `(pose) => [
    {
        what: 'circle',
        where: {
            x: pose.nose.x,
            y: pose.nose.y
        }
    },
];`;

let d1b = `(pose) => [
    {
        what: 'circle',
        where: {
            x: pose.leftWrist.x,
            y: pose.rightWrist.y
        },
        how: {
            d: abs(pose.leftAnkle.y - pose.rightAnkle.y)
        },
    },
];`;

let d2 = `(pose, poseHistory) => [
    {
        what: 'circle',
        where: {
            // get the pose from 30 frames or 1 second ago
            x: pastPose(poseHistory, 30).nose.x,
            y: pastPose(poseHistory, 30).nose.y,
        },
    },
    {
        what: 'circle',
        where: {
            // look to the last 30 frames
            x: pastParts(poseHistory, 'leftWrist', 'x', 0, 30, 1),
            y: pastParts(poseHistory, 'leftWrist', 'y', 0, 30, 1)
        },
    },
];`;

let d3 = `pose.nose
pose.leftEye
pose.rightEye
pose.leftEar
pose.rightEar
pose.leftShoulder
pose.rightShoulder
pose.leftElbow
pose.rightElbow
pose.leftWrist
pose.rightWrist
pose.leftHip
pose.rightHip
pose.leftKnee
pose.rightKnee
pose.leftAnkle
pose.rightAnkle`;

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let DCODE = [
    [{code:d1a, description: 'bind joints to any object property.'}, {code:d1b, description: 'experiment with unusual bindings!'}],
    [{code:d2, description: 'use the history of movement e.g. for calculations or path tracing.'}],
    [{code:d3, description: 'all of the joints - each contains an x and y coordinate.'}],
];
