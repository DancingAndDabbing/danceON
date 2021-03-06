// Teachable Machine classifier class - handles pose detection and prediction

// Potential Bugs
// If the user uploads a new JSON file before video, we won't know whether they
// match - perhaps we should prompt them

// Old PoseNet Settings for faster analysis if we can figure out how to
// change the teachable machine settings
// imageScaleFactor: 0.2,
// inputResolution: 257,
// quantBytes: 2,
// multiplier: 0.50

class TMClassifier {
    constructor() {
        this.model = undefined;

        // Using objects instead of lists given the asyncronous nature
        // of running the classifier
        this.framePredictionStates = {};
        this.poses = {};
        this.predictions = {};

        this.modelURL = undefined;

        this.loaded = false;
        this.maxPredictions = 0;

        this.gotAllFrames = false;
        this.gotAllFramesCallBack = undefined;
    }

    // Successful load of JSON should overwrite anything currently in poses
    loadJSON(options, onSuccess, onError) {
        let self = this;
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

    // Still causes one "video element has not loaded" data yet error
    async loadModel(options, onSuccess, onError) {
        this.loaded = false;
        let modelURL = options.modelURL + 'model.json';
        let metadataURL = options.modelURL + 'metadata.json';

        try {
            // It could break here, so don't update the class properties yet
            let model = await tmPose.load(modelURL, metadataURL);
            let maxPredictions = model.getTotalClasses();
            this.resetForNewClassifier();

            this.model = model;
            this.maxPredictions = maxPredictions;
            this.loaded = true;

            console.log(`classifier loaded: ${this.maxPredictions} classes`);
            if (onSuccess != undefined) onSuccess();
        } catch(err) {
            console.log(err);
            if (this.model) this.loaded = true;
            if (onError != undefined) onError();
            alert("Something wrong with the link. We'll try to use the previous one.");
        }
    }

    // Bug! This still jumps around and skips frames
    predictForVideo(options, canvas, video, frame) {
        if (!(options.videoLoaded && this.loaded)) return {pose:undefined, prediction:undefined};
        this.checkIfComplete(getTotalFrames(options, video));


        // We already have both the pose and the classification!
        // Or we have disabled teachable machine in which case we will also return here
        // Simply return
        if ((this.poses[frame] && this.predictions[frame]) || !options.teachableMachineOn) {
            return {pose:this.poses[frame], prediction:this.predictions[frame]};
        }
        else {
            let self = this;
            if (!self.framePredictionStates[frame]) {
                self.framePredictionStates[frame] = 'triggered';
                //let img = new Image();
                //img.src = canvas.elt.toDataURL('image/png', 1);
                //img.width = options.videoWidth;
                //img.height = options.videoHeight;
                //self.model.estimatePose(img)
                self.model.estimatePose(video.elt)
                .then(v => {
                    convertToML5Structure(v.pose);
                    if (!self.poses[frame]) self.poses[frame] = v.pose;
                    return self.model.predict(v.posenetOutput)
                }).then(p => self.predictions[frame] = p);
            }
            if (self.poses[frame]) return {pose:this.poses[frame], prediction:undefined};
            else return {pose:undefined, prediction:undefined};
        }
    }

    // Blocking - this function will not return until the pose and prediction
    // have run. In other words we will not continue through the draw loop
    // until we have all the data we need.
    async predictForWebCam(options, video, callback) {
        if (!(options.videoLoaded && this.loaded)) return;
        let { pose, posenetOutput } = await this.model.estimatePose(video.elt);
        if (!(options.videoLoaded && this.loaded)) return;
        let prediction = await this.model.predict(posenetOutput);
        if (!(options.videoLoaded && this.loaded)) return;

        convertToML5Structure(pose);
        callback({pose: pose, prediction: prediction});
    }

    // How to alter state when the user uploads a new video, classifier
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
    checkIfComplete(totalFrames) {
        if (this.gotAllFrames || (this.gotAllFramesCallBack == undefined)) return;
        let poLength = Object.keys(this.poses).length;
        let preLength = Object.keys(this.predictions).length;
        //console.log(poLength, preLength, totalFrames);

        // Sometimes these lengths can vary by a little due to rendering weirdness
        if (inRange(poLength - preLength, -2, 2) &&
            inRange(poLength - totalFrames, -2, 2) &&
            inRange(preLength - totalFrames, -2, 2)) {

            this.gotAllFrames = true;
            this.gotAllFramesCallBack();
        }
    }

    onComplete(callbackFunction) {
        this.gotAllFramesCallBack = callbackFunction;
    }
}

function convertToML5Structure(pose) {
    if (!pose) return;
    pose.keypoints.forEach((kp, i) => {
        pose[kp.part] = {
            confidence: kp.score,
            x: kp.position.x,
            y: kp.position.y
        }
    });
}
