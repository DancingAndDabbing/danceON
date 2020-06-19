// Append.js
// Input - List of individual json files in a folder numbered by frame
// Output - Single JSON file combining all of them

const fs = require('fs');
const path = require('path');

let output_name = process.argv[2];
let file_dir;
let frames;

if (output_name) {
    file_dir = `./${output_name}/`;
    frames = [];

    let files = fs.readdirSync(file_dir);

    files.forEach(function (file, index) {
        if (path.extname(file) == ".json") {
            let frame = JSON.parse(fs.readFileSync(file_dir+file));
            frames.push(frame);
        }
    });
    fs.writeFileSync((output_name + ".json"), JSON.stringify(frames));
}
