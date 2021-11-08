// Handler Class for updating code based on day of the week
class DayChanger {
    constructor(editor, fromSetValueCall) {
        this.editor = editor;
        this.fromSetValueCall = fromSetValueCall;

        this.defaultInterval = 1000*60*5; // Update every 5 min
        this.intervalFunc;
    }

    setCode(newCode) {
        this.fromSetValueCall = true;
        this.editor.setValue(newCode);
    }

    // Check day of the week and fill the editor with corresponding code
    setCodeOnDay() {
        const day = new Date().getDay();
        this.setCode(codeSamples[day]);
    }

    // From user button input, fill the editor with corresponding code
    setCodeOnUserInput(inputNum) {
        this.setCode(codeSamples[ min( 6, max(inputNum, 0) ) ]);
        this.startInterval(); // reset interval
    }

    // At a set interval, check the day and fill the code
    // If called repeatedly, interval will reset
    startInterval() {
        let self = this;

        if (self.intervalFunc) clearInterval(self.intervalFunc);
        self.intervalFunc = setInterval(() => self.setCodeOnDay(), self.defaultInterval);
    }

}

// Code excerpts written in danceON and copy/pasted here
// Days of the week list included on the bottom
const dumbLine = `(pose) => [
    {
        what: 'line',
        where: {
            x1: pose.leftWrist.x,
            y1: pose.leftWrist.y,
            x2: pose.rightWrist.x,
            y2: pose.rightWrist.y
        },
    }
];`;


const fire = `(pose) => [
    {
        what: 'rect',
        where: {
            x: width/2,
            y: 0
            },
        how: {
            h: height,
            w: width/2,
            fill: color(174, 205, 255, 99)
            },
    },
    {
        what: 'rect',
        where: {
            x: 0,
            y: 0
            },
        how: {
            h: height,
            w: width/2,
            fill: color(255, 145, 100, 99)
            },
    },
    {
        what: 'triangle',
        when: pose.rightWrist.x > width/2,
        where: {
            start: {
                x1: pose.rightWrist.x + random(-20,20),
                y1: pose.rightWrist.y + random(-20,20),
                x2: pose.rightWrist.x + random(-20,20),
                y2: pose.rightWrist.y + random(-20,20),
                x3: pose.rightWrist.x + random(-20,20),
                y3: pose.rightWrist.y + random(-20,20),
                velocityX: 0,
                velocityY: 0
            },
            accelerationX: 0,
            accelerationY: random(-0.04, -0.08)
        },
        how: {
            fill: [{frame: 0, value: color(223, 105, 42, 0)},
                   {frame: 30, value: color(241, 214, 59, 255)},
                   {frame: 45, value: color(241, 214, 59, 60)}],
        }
    },
    {
        what: 'triangle',
        when: pose.rightWrist.x <= width/2,
        where: {
            start: {
                x1: pose.rightWrist.x + random(-20,20),
                y1: pose.rightWrist.y + random(-20,20),
                x2: pose.rightWrist.x + random(-20,20),
                y2: pose.rightWrist.y + random(-20,20),
                x3: pose.rightWrist.x + random(-20,20),
                y3: pose.rightWrist.y + random(-20,20),
                velocityX: 0,
                velocityY: 0
            },
            accelerationX: 0,
            accelerationY: random(-0.04, -0.08)
        },
        how: {
            fill: [{frame: 0, value: color(42, 105, 242, 0)},
                   {frame: 30, value: color(41, 214, 209, 255)},
                   {frame: 45, value: color(41, 214, 209, 60)}],
        }
    }, // flames right wrist
    {
        what: 'triangle',
        when: pose.leftWrist.x > width/2,
        where: {
            start: {
                x1: pose.leftWrist.x + random(-20,20),
                y1: pose.leftWrist.y + random(-20,20),
                x2: pose.leftWrist.x + random(-20,20),
                y2: pose.leftWrist.y + random(-20,20),
                x3: pose.leftWrist.x + random(-20,20),
                y3: pose.leftWrist.y + random(-20,20),
                velocityX: 0,
                velocityY: 0
            },
            accelerationX: 0,
            accelerationY: random(-0.04, -0.08)
        },
        how: {
            fill: [{frame: 0, value: color(223, 105, 42, 0)},
                   {frame: 30, value: color(241, 214, 59, 255)},
                   {frame: 45, value: color(241, 214, 59, 60)}],
        }
    },
    {
        what: 'triangle',
        when: pose.leftWrist.x <= width/2,
        where: {
            start: {
                x1: pose.leftWrist.x + random(-20,20),
                y1: pose.leftWrist.y + random(-20,20),
                x2: pose.leftWrist.x + random(-20,20),
                y2: pose.leftWrist.y + random(-20,20),
                x3: pose.leftWrist.x + random(-20,20),
                y3: pose.leftWrist.y + random(-20,20),
                velocityX: 0,
                velocityY: 0
            },
            accelerationX: 0,
            accelerationY: random(-0.04, -0.08)
        },
        how: {
            fill: [{frame: 0, value: color(42, 105, 242, 0)},
                   {frame: 30, value: color(41, 214, 209, 255)},
                   {frame: 45, value: color(41, 214, 209, 60)}],
        }
    }, // flames left wrist
      {
        what: 'triangle',
        when: pose.leftAnkle.y < pose.rightKnee.y ||
              pose.rightAnkle.y < pose.leftKnee.y,
        where: {
            start: {
                x1: (pose.leftAnkle.x + pose.rightAnkle.x)/2 + random(-50,50),
                y1: (pose.leftAnkle.y + pose.rightAnkle.y)/2 + random(-50,50),
                x2: (pose.leftAnkle.x + pose.rightAnkle.x)/2 + random(-50,50),
                y2: (pose.leftAnkle.y + pose.rightAnkle.y)/2 + random(-50,50),
                x3: (pose.leftAnkle.x + pose.rightAnkle.x)/2 + random(-50,50),
                y3: (pose.leftAnkle.y + pose.rightAnkle.y)/2 + random(-50,50),
                velocityX: 0,
                velocityY: 0
            },
            accelerationX: 0,
            accelerationY: random(-0.04, -0.08)
        },
        how: {
            fill: [{frame: 0, value: color(30, 105, 42, 0)},
                   {frame: 30, value: color(30, 214, 59, 100)},
                   {frame: 45, value: color(30, 214, 90, 60)}],
        }
    }, // flames of ankle
];`;

const delays = `(pose, poseHistory) => [
    {   what: 'triangle',
        where: {
            x1: [11, 629],
            y1: [11, 11],
            x2: [181, 459],
            y2: [11, 11],
            x3: [11, 629],
            y3: [66, 66]
        },
        how: {
            h: 360,
            w: 640,
            fill: color(0, 130, 127, 125)
        }
    }, //blue triangles
    {   what: 'triangle',
        where: {
            x1: [11, 629],
            y1: [77, 77],
            x2: [211, 429],
            y2: [11, 11],
            x3: [11, 629],
            y3: [166, 166]
        },
        how: {
            h: 360,
            w: 640,
            fill: color(232, 178, 163, 125)
        }
    }, //salmon triangles
    {   what: 'triangle',
        where: {
            x1: [231, 409],
            y1: [11, 11],
            x2: [11, 629],
            y2: [183, 183],
            x3: [11, 629],
            y3: [305, 305]
        },
        how: {
            h: 360,
            w: 640,
            fill: color(250, 218, 94, 125)
        }
    }, //yellow triangles
    {
        what: 'line',
        where: {
            x1: [pose.leftElbow.x, pastPose(poseHistory, 95).leftElbow.x, pose.leftKnee.x, pastPose(poseHistory, 95).leftKnee.x ],
            y1: [pose.leftElbow.y, pastPose(poseHistory, 95).leftElbow.y, pose.leftKnee.y, pastPose(poseHistory, 95).leftKnee.y],
            x2: [pose.leftWrist.x, pastPose(poseHistory, 95).leftWrist.x, pose.leftAnkle.x, pastPose(poseHistory, 95).leftAnkle.x],
            y2: [pose.leftWrist.y, pastPose(poseHistory, 95).leftWrist.y, pose.leftAnkle.y, pastPose(poseHistory, 95).leftAnkle.y]
        },
        how: {
            stroke: ['deeppink', 'hotpink', 'deeppink', 'hotpink'],
            strokeWeight: 4,
        },
    }, // left arm + echo
    {
        what: 'line',
        where: {
            x1: [pose.rightElbow.x, pastPose(poseHistory, 95).rightElbow.x, pose.rightKnee.x, pastPose(poseHistory, 95).rightKnee.x],
            y1: [pose.rightElbow.y, pastPose(poseHistory, 95).rightElbow.y, pose.rightKnee.y, pastPose(poseHistory, 95).rightKnee.y],
            x2: [pose.rightWrist.x, pastPose(poseHistory, 95).rightWrist.x,  pose.rightAnkle.x, pastPose(poseHistory, 95).rightAnkle.x],
            y2: [pose.rightWrist.y, pastPose(poseHistory, 95).rightWrist.y,  pose.rightAnkle.y, pastPose(poseHistory, 95).rightAnkle.y]
        },
        how: {
            stroke: ['deeppink', 'hotpink', 'deeppink', 'hotpink'],
            strokeWeight: 4,
        },
    }, // right arm + echo
    {
        what: 'line',
        where: {
            x1: [pose.leftShoulder.x, pastPose(poseHistory, 95).leftShoulder.x, pose.leftShoulder.x, pastPose(poseHistory, 95).leftShoulder.x, pose.rightShoulder.x, pastPose(poseHistory, 95).rightShoulder.x, pose.leftHip.x, pastPose(poseHistory, 95).leftHip.x],
            y1: [pose.leftShoulder.y, pastPose(poseHistory, 95).leftShoulder.y, pose.leftShoulder.y, pastPose(poseHistory, 95).leftShoulder.y, pose.rightShoulder.y, pastPose(poseHistory, 95).rightShoulder.y, pose.leftHip.y, pastPose(poseHistory, 95).leftHip.y],
            x2: [pose.leftHip.x, pastPose(poseHistory, 95).leftHip.x, pose.rightShoulder.x, pastPose(poseHistory, 95).rightShoulder.x, pose.rightHip.x, pastPose(poseHistory, 95).rightHip.x, pose.rightHip.x, pastPose(poseHistory, 95).rightHip.x],
            y2: [pose.leftHip.y, pastPose(poseHistory, 95).leftHip.y, pose.rightShoulder.y, pastPose(poseHistory, 95).rightShoulder.y, pose.rightHip.y, pastPose(poseHistory, 95).rightHip.y, pose.rightHip.y, pastPose(poseHistory, 95).rightHip.y]
        },
        how: {
            stroke: ['deeppink', 'hotpink', 'deeppink', 'hotpink', 'deeppink', 'hotpink', 'deeppink', 'hotpink'],
            strokeWeight: 4,
        },
    }, // body + echo
];`;

const codeSamples = [
    dumbLine, // Sunday
    dumbLine, // Monday
    fire, // Tuesday
    fire, // Wednesday
    delays, // Thursday
    delays, // Friday
    delays // Saturday
];
