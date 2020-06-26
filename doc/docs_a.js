// Ensure that there is the correct number of tabs and content
// in index.html

// The A section of content
let ATITLES = ['circle', 'ellipse', 'point', 'line', 'square'];

let a1a = `{ what: 'circle' },`

let a1b =
`{
        what: 'circle',
        when: true,
        where: {
            x: 30,
            y: 30
        },
        how: {
            d: 30,
            fill: 'rgba(255, 255, 255, 1)',
            stroke: 0
        }
    },
`


let a2 = '// not implemented';
let a3 = '// not implemented';
let a4 = '// not implemented';
let a5 = '// not implemented';

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let ACODE = [[a1a, a1b], [a2], [a3], [a4], [a5]];
