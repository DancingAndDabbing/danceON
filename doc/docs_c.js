// The C section of content
let CTITLES = ['text', 'tracking'];

let c1a = `{ what: 'text' },`;
let c1b =
`{
        what: 'text',
        when: true,
        where: {
            x: 30,
            y: 30
        },
        how: {
            str: 'Hello world!', // str means string - a term for text

            textSize: 24,

            // [(LEFT | CENTER | RIGHT), (TOP | BOTTOM | CENTER | BASELINE)]
            textAlign: [CENTER, BOTTOM],
            textFont: 'Georgia', // e.g. 'Georgia' or 'Helvetica',
            textStyle: NORMAL,  // NORMAL | ITALIC | BOLD or BOLDITALIC

            fill: color(0, 0, 0, 255),
            stroke: 0,
            strokeWeight: 1,
        }
    },`;

let c2 = `{
        what: 'text',
        how: { str: pose.leftWrist.x },
    },`;

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let CCODE = [
    [{code:c1a, description: 'minimal'}, {code: c1b, description:'expanded'}],
    [{code:c2, description: 'using text is a great way to track specific coordinates'}],
];
