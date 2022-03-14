// The E section of content
let FTITLES = ['movers', 'animations'];

let f1 = `{
        what: 'circle',
        where: {
            start: {
                x: pose.nose.x,
                y: pose.nose.y,
                velocityX: random(-2, 2),
                velocityY: -10
            },
            accelerationX: 0,
            accelerationY: 0.5
        }
    },`;

let f2 = `{
        what: 'circle',
        where: {
            start: {
                x: pose.nose.x,
                y: pose.nose.y,
                velocityX: random(-2, 2),
                velocityY: random(-2, 2)
            },
            accelerationX: 0,
            accelerationY: 0
        },
        how: {
            fill: [{frame: 0, value: color(255, 255, 255, 0)},
                   {frame: 65, value: color(255, 255, 255, 255)}],
            d: [{frame: 0, value: 0}, {frame: 50, value: 30},
                {frame: 60, value: 30}, {frame: 65, value: 0}]
        }
    },`;

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let FCODE = [
    [{code:f1, description: 'pass in a \'start\' object into \'where\' and an object will move around. You can set a starting position and velocity, and provide acceleration values to determine how it moves around.'}],
    [{code:f2, description: 'create interesting animations by specifing how numbers, arrays, and colors change over time in properties of \'how\'.'}],
];
