// The E section of content
let ETITLES = ['conditionals', 'teachable machine'];

let e1 = `(pose) => [
    {
        what: 'text',
        when: 10 > 9,
        how: {
            str: '10 > 9 = Always true',
            textSize: 16,
            textAlign: [LEFT, TOP]
        },
        where: {
            x: 10,
            y: 15
        }
    },
    {
        what: 'text',
        when: 1 > 2, // We should not see this text!
        how: {
            str: '1 > 2 = Never true',
            textSize: 16,
            textAlign: [LEFT, TOP]
        },
        where: {
            x: 10,
            y: 30
        }
    },
    {
        what: 'text',
        when: pose.leftWrist.y < pose.nose.y,
        how: {
            str: 'left wrist is above head.',
            textSize: 16,
            textAlign: [LEFT, TOP]
        },
        where: {
            x: 10,
            y: 50
        }
    },
];`;

let e2 = `(pose, poseHistory, tm) => [
    {
        what: 'text',
        when: tm[0].probability > 0.9,
        how: { str: tm[0].className }
    },
];`;

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let ECODE = [
    [{code:e1, description: 'pass in any statement that evaluates to true or false.'}],
    [{code:e2, description: 'use the model you trained on teachable machine by checking when the probability passes a certain threshold (once the classifier has finished).'}],
];
