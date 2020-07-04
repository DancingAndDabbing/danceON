// Converter
// Converts from a Open Pose JSON file to a PoseNet JSON File
// Caveat - assumes single pose estimation
//  (abeit - wouldn't be too tough to support multi-pose)

// Input - Existing file name
// Output - New JSON file in PoseNet style

const fs = require('fs');

// mapping from posenet to open pose
//  mappings[i] = PoseNet keypoint index
//  mappings[i][0] = PoseNet part name
//  mappings[i][1] = Corresponding OpenPose Body Part Number
const mappings = [
    ['nose', '0'],
    ['leftEye', '16'], ['rightEye', '15'],
    ['leftEar', '18'], ['rightEar', '17'],
    ['leftShoulder', '5'], ['rightShoulder', '2'],
    ['leftElbow', '6'], ['rightElbow', '3'],
    ['leftWrist', '7'], ['rightWrist', '4'],
    ['leftHip', '12'], ['rightHip', '9'],
    ['leftKnee', '13'], ['rightKnee', '10'],
    ['leftAnkle', '14'], ['rightAnkle', '11']
];

let openPoseVersionName = process.argv[2]; // command line arg
if (!openPoseVersionName) return false;

let openPoseVersion = JSON.parse(fs.readFileSync(openPoseVersionName));

let poseNetVersionName = `${openPoseVersionName.split(".")[0]}_converted.json`;
let poseNetVersion = [];

openPoseVersion.forEach((frame, i) => {
    let newPoseFrame = [{'pose': {'keypoints': []}}];

    mappings.forEach((m, j) => {
        let part = m[0];

        // Only works for single person estimation
        let x = frame['part_candidates'][0][m[1]][0];
        let y = frame['part_candidates'][0][m[1]][1];
        let score = frame['part_candidates'][0][m[1]][2];

        if (frame['part_candidates'][0][m[1]].length > 3) {
          if (frame['part_candidates'][0][m[1]][5] > score) {
            x = frame['part_candidates'][0][m[1]][3];
            y = frame['part_candidates'][0][m[1]][4];
          }
        }

        let keypointStruct = {
            position: {x: x, y: y},
            score: score, part: part
        }
        // It really is 'confidence' not 'score' here like above...
        let namedStruct = {
            x: x, y: y,
            confidence: score
        }

        // ml5 PoseNet seems to store this data in two forms
        // https://ml5js.org/reference/api-PoseNet/
        newPoseFrame[0]['pose']['keypoints'].push(keypointStruct);
        newPoseFrame[0]['pose'][part] = namedStruct;
    });

    poseNetVersion.push(newPoseFrame);
});

// The output needs to be an object, not a list for our javascript
// code to be able to properly access it.
// This is why it gets outputted with the 'data' key
fs.writeFileSync(
    poseNetVersionName,
    JSON.stringify({'data': poseNetVersion})
);
