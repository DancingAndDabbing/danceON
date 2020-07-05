// Ensure that there is the correct number of tabs and content
// in index.html

// The B section of content
let BTITLES = ['circle', 'ellipse', 'point', 'line', 'square', 'rect', 'quad', 'triangle', 'arc'];

let b1a = `{ what: 'circle' },`;
let b1b =
`{
        what: 'circle',
        when: true,
        where: {
            x: 30,
            y: 30
        },
        how: {
            d: 30,
            fill: color(0, 0, 255, 255),
            stroke: 0,
            strokeWeight: 1,
        }
    },`;

let b2a = `{ what: 'ellipse' },`;
let b2b =
`{
        what: 'ellipse',
        when: true,
        where: {
            x: 30,
            y: 30
        },
        how: {
            w: 30,
            h: 60,
            fill: color(255, 0, 0, 255),
            stroke: 0,
            strokeWeight: 1,
        }
    },`;

let b3a = `{ what: 'point' },`;
let b3b =
`{
        what: 'point',
        when: true,
        where: {
            x: 30,
            y: 30
        },
        how: {
            stroke: 0,
            strokeWeight: 10,
        }
    },`;

let b4a = `{ what: 'line' },`;
let b4b =
`{
        what: 'line',
        when: true,
        where: {
            x1: 30,
            y1: 30,
            x2: 60,
            y2: 80,
        },
        how: {
            stroke: 0,
            strokeWeight: 10,
        }
    },`;

let b5a = `{ what: 'square' },`;
let b5b =
`{
        what: 'square',
        when: true,
        where: {
            x: 30,
            y: 30
        },
        how: {
            s: 30,

            tl: 4, // corner rounding (top left)
            tr: 4,
            bl: 0,
            br: 0,

            fill: color(0, 255, 0, 255),
            stroke: 0,
            strokeWeight: 1
        }
    },`;

let b6a = `{ what: 'rect' },`;
let b6b =
`{
        what: 'rect',
        when: true,
        where: {
            x: 30,
            y: 30
        },
        how: {
            h: 30,
            w: 60,

            tl: 4, // corner rounding (top left)
            tr: 4,
            bl: 0,
            br: 0,

            fill: color(255, 0, 255, 255),
            stroke: 0,
            strokeWeight: 1
        }
    },`;

let b7a = `{ what: 'quad' },`;
let b7b =
`{
        what: 'quad',
        when: true,
        where: {
            x1: 30,
            y1: 30,
            x2: 45,
            y2: 55,
            x3: 90,
            y3: 80,
            x4: 75,
            y4: 0
        },
        how: {
            fill: color(255, 255, 255, 255),
            stroke: 0,
            strokeWeight: 1
        }
    },`;

let b8a = `{ what: 'triangle' },`;
let b8b =
`{
        what: 'triangle',
        when: true,
        where: {
            x1: 30,
            y1: 30,
            x2: 60,
            y2: 60,
            x3: 100,
            y3: 10
        },
        how: {
            fill: color(255, 255, 0, 255),
            stroke: 0,
            strokeWeight: 1
        }
    },`;

let b9a = `{ what: 'arc' },`;
let b9b =
`{
        what: 'arc',
        when: true,
        where: {
            x: 30,
            y: 30,
        },
        how: {
            w: 60,
            h: 60,

            start: 0, // between 0 and TWO_PI
            stop: HALF_PI, // between 0 and TWO_PI
            mode: OPEN, // OPEN | CHORD | PI

            fill: color(255, 255, 0, 255),
            stroke: 0,
            strokeWeight: 1
        }
    },`;

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let BCODE = [
    [{code:b1a, description: 'minimal'}, {code: b1b, description:'expanded'}],
    [{code:b2a, description: 'minimal'}, {code: b2b, description:'expanded'}],
    [{code:b3a, description: 'minimal'}, {code: b3b, description:'expanded'}],
    [{code:b4a, description: 'minimal'}, {code: b4b, description:'expanded'}],
    [{code:b5a, description: 'minimal'}, {code: b5b, description:'expanded'}],
    [{code:b6a, description: 'minimal'}, {code: b6b, description:'expanded'}],
    [{code:b7a, description: 'minimal'}, {code: b7b, description:'expanded'}],
    [{code:b8a, description: 'minimal'}, {code: b8b, description:'expanded'}],
    [{code:b9a, description: 'minimal'}, {code: b9b, description:'expanded'}]
];
