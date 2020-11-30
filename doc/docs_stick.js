// Ensure that there is the correct number of tabs and content
// in index.html

// The A section of content
let ST_TITLES = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];

let st1 = `(pose) => [
    {
        what: 'circle',
    }
];`

let st2 = `(pose) => [
    {
        what: 'circle',
        where: {
            x: 200,
            y: 200
        },
    }
];`

let st3 = `(pose) => [
    {
        what: 'circle',
        where: {
            x: 200,
            y: 200
        },
        how: {
            d: 40,
            fill: "purple",
            stroke: "white",
            strokeWeight: 4,
        },
    }
];`

let st4 = `(pose) => [
    {
        what: 'circle',
        where: {
            x: pose.nose.x,
            y: pose.nose.y
        },
        how: {
            d: 40,
            fill: "purple",
            stroke: "white",
            strokeWeight: 4,
        },
    }
];`;

let st5 = `(pose) => [
    {
        what: 'square',
        where: { x: 0, y: 0 },
        how: { fill: "black", s: 1000 },
    },
    {
        what: 'circle',
        where: {
            x:pose.nose.x,
            y: pose.nose.y
        },
        how: {
            d: 40,
            fill: "black",
            stroke: "white",
            strokeWeight: 4,

        },
    },
    {
        what: 'line',
        where: {
            x1: pose.nose.x,
            x2: (pose.leftHip.x + pose.rightHip.x) / 2,
            y1: pose.nose.y + 20,
            y2: (pose.leftHip.y + pose.rightHip.y) / 2,
        },
        how: {
            strokeWeight: 4,
        },
    },
    {
        what: 'line',
        where: {
            x1: [
                    pose.nose.x, pose.nose.x,
                    pose.rightShoulder.x, pose.leftShoulder.x
                ],
            y1: [
                    pose.nose.y + 20, pose.nose.y + 20,
                    pose.rightShoulder.y, pose.leftShoulder.y
                ],
            x2: [
                    pose.rightShoulder.x, pose.leftShoulder.x,
                    pose.rightWrist.x, pose.leftWrist.x
                ],
            y2: [
                    pose.rightShoulder.y, pose.leftShoulder.y,
                    pose.rightWrist.y, pose.leftWrist.y
                ],
        },
        how: {
            strokeWeight: 4,
            stroke: "white",
        },
    },
    {
        what: 'line',
        where: {
            x1: [
                    (pose.leftHip.x + pose.rightHip.x) / 2, (pose.leftHip.x + pose.rightHip.x) / 2,
                    pose.rightKnee.x, pose.leftKnee.x
                ],
            y1: [
                    (pose.leftHip.y + pose.rightHip.y) / 2, (pose.leftHip.y + pose.rightHip.y) / 2,
                    pose.rightKnee.y, pose.leftKnee.y
                ],
            x2: [
                    pose.rightKnee.x, pose.leftKnee.x,
                    pose.rightAnkle.x, pose.leftAnkle.x
                ],
            y2: [
                    pose.rightKnee.y, pose.leftKnee.y,
                    pose.rightAnkle.y, pose.leftAnkle.y
                ],
        },
        how: {
            strokeWeight: 4,
            stroke: "white",
        },
    },
];`

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let ST_CODE = [
    [{code:st1, description: 'just a circle. who knows where it goes?'}],
    [{code:st2, description: 'circle, but less crazy.'}],
    [{code:st3, description: 'humble circle. not much more, but it knows what it is and where it wants to be.'}],
    [{code:st4, description: 'circle that moves as we do!'}],
    [{code:st5, description: 'whole stick figure.'}],
];
