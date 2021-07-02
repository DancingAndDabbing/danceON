// Blaze Detector class
// https://blog.tensorflow.org/2021/05/high-fidelity-pose-tracking-with-mediapipe-blazepose-and-tfjs.html

class BlazeDetector {
    constructor() {
        this.model = undefined;
        this.detector = undefined;

        // Set Detector Config up here
        // swap between 'mediapipe' and 'tfjs'
        // Make sure the loaded files in index.html match
        this.runtimeSource = 'tfjs';
        this.detectorConfig = {
            'tfjs': {
                runtime: 'tfjs',
                enableSmoothing: true,
                modelType: 'full'
            },
            'mediapipe': {
                runtime: 'mediapipe',
                solutionPath: 'base/node_modules/@mediapipe/pose',
                enableSmoothing: true,
                modelType: 'full'
            }
        }[this.runtimeSource];

        // Using objects instead of lists given the asyncronous nature
        // of running the classifier
        this.framePredictionStates = {};
        this.poses = {};
        this.predictions = {}; // currently filler since teachable machine is broke

        this.modelURL = undefined;

        this.loaded = false;
        this.maxPredictions = 0;

        this.gotAllFrames = false;
        this.gotAllFramesCallBack = undefined;
    }

    // Successful load of JSON should overwrite anything currently in poses
    // This uses the old structure we created from OpenPose
    loadJSON(options, onSuccess, onError) {
        let self = this;

        // loadJSON is a p5 function
        loadJSON(options.videoPoses, (loaded) => {
            try {
                let poseList = loaded.data;
                let newPoses = {};
                poseList.forEach( (p, i) => newPoses[i] = p[0].pose );

                // If we've made it this far, we can update self
                self.resetForNewJSON();
                self.poses = newPoses;

                if (onSuccess != undefined) onSuccess();
            } catch(err) {
                console.log(err);
                if (onError != undefined) onError();
                alert("Something wrong with the file. We'll still use the previous one.");
            }
        });
    }

    loadBlazeJSON(options, onSuccess, onError) {
        let self = this;
        loadJSON(options.videoPoses, (loaded) => {
            try {
                let poseList = loaded.data;
                let newPoses = {};
                poseList.forEach( (p, i) => newPoses[i] = p );

                // If we've made it this far, we can update self
                self.resetForNewJSON();
                self.poses = newPoses;

                if (onSuccess != undefined) onSuccess();
            } catch(err) {
                console.log(err);
                if (onError != undefined) onError();
                alert("Something wrong with the file. We'll still use the previous one.");
            }
        });
    }

    // May or may not be useful
    downloadJSON() {
        let exportObj = {"data":[]};
        for (let k in this.poses) {
            exportObj.data.push(this.poses[k]);
        }
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "poseData" + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Still causes one "video element has not loaded" data yet error
    async loadModel(options, onSuccess, onError) {
        this.loaded = false;
        this.model = poseDetection.SupportedModels.BlazePose;

        this.detector = await poseDetection.createDetector(
            this.model, this.detectorConfig);
        this.loaded = true;
    }

    predictForVideo(options, canvas, video, frame, callback) {
        let self = this; // necessary for .then callbacks I think
        self.checkIfComplete(getTotalFrames(options, video));

        // return undefined object if nothing is loaded yet
        if (!(options.videoLoaded && self.loaded)) {
            callback({pose:undefined, prediction:undefined});
            return;
        }

        // If we already have a pose part in storage - use that
        if (self.poses[frame]) {
            callback({pose: self.poses[frame], prediction: self.predictions[frame]});
            return;
         }

        // If we don't have a pose part, run the detector
        self.detector.estimatePoses(video.elt) // estimationConfig?
        .then(v => {
            let newPose = convertToML5Structure(v[0], keyPointsToUse); // copy and rearrange
            self.poses[frame] = newPose;
            self.predictions[frame] = {className:'Nope', probability:0}; // fake
            callback({pose: self.poses[frame], prediction: self.predictions[frame]})
        })
    }

    // The main difference with the webcam mode is that we do not store any
    // pose data for future loop since there is not a looping video
    predictForWebCam(options, video, callback) {
        if (!(options.videoLoaded && this.loaded)) {
            callback({pose:undefined, prediction:undefined});
            return;
        }

        this.detector.estimatePoses(video.elt)
        .then(v => {
            let newPose = convertToML5Structure(v[0], keyPointsToUse); // similar code called in scalePoseToWindow
            callback({pose: newPose, prediction: {className:'Nope', probability:0}})
        })
    }

    // Reset functions that clear existing pose data when
    // a new video is uploaded.
    resetForNewJSON() {
        this.gotAllFrames = false;
        this.poses = {};
    }

    resetForNewVideo() {
        this.gotAllFrames = false;

        this.poses = {};
        this.predictions = {};
        this.framePredictionStates = {};
    }

    resetForNewClassifier() {
        this.loaded = false;
        this.gotAllFrames = false;

        this.predictions = {};
        this.framePredictionStates = {};
    }

    // Callback Function Handling for Completing Classification
    // Ignores predictions for now
    checkIfComplete(totalFrames) {
        if (this.gotAllFrames || (this.gotAllFramesCallBack == undefined)) return;
        let poLength = Object.keys(this.poses).length;
        //console.log(poLength, preLength, totalFrames);

        // Sometimes these lengths can vary by a little due to rendering weirdness
        if (inRange(poLength - totalFrames, -2, 2)) {
            this.gotAllFrames = true;
            this.gotAllFramesCallBack();
        }
    }

    onComplete(callbackFunction) {
        this.gotAllFramesCallBack = callbackFunction;
    }
}

// Make a copy of the pose and add in keypoints as their own objects
// Uses the old PoseNet structure with all its weirdness.
// Also changes to camel case and filters out points we aren't using
function convertToML5Structure(pose, keypointFilter) {
    if (!pose) return;
    let newPose = {keypoints: [], score: pose.score};

    pose.keypoints
    .filter((kp) => keypointFilter.includes(kp.name))
    .forEach((kp, i) => {
        newPose.keypoints.push({
            part: underscore_to_camelCase(kp.name), // function from helpers
            score: kp.score, // posenet used confidence rather than score...
            position: {
                x: kp.x,
                y: kp.y,
                //z: kp.z
            }
        });
        newPose[underscore_to_camelCase(kp.name)] = {
            x: kp.x,
            y: kp.y,
            //z: kp.z,
            confidence: kp.score,
        };
    });
    return newPose;
}