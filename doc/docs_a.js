// Ensure that there is the correct number of tabs and content
// in index.html

// The A section of content
let ATITLES = ['basic', 'all args', 'minimal', 'functions+variables'];

let a1 = `(pose) => [

];`

let a2 = `(pose, poseHistory, tm) => [

];`

let a3 = `() => [];`;

let a4 = `(pose, poseHistory, tm) => {

    // define variables and functions
    let myVariable = 100;

    // return objects
return [
    {
        what: 'circle',
        where: {
            x: myVariable,
            y: myVariable,
        },
        how: {
            d: myVariable,
        }
    }
];}`

// Must be a list of lists of code examples
// Probably in the future this could include text and examples
let ACODE = [
    [{code:a1, description: 'basic starter with pose object input.'}],
    [{code:a2, description: 'starter with pose, poseHistory, and tm (teachable machine) inputs.'}],
    [{code:a3, description: 'the bare minimum to work.'}],
    [{code:a4, description: 'demonstration for how to declare functions and variables.'}],
];
