class TMClassifier {
    constructor(options) {
        this.model = undefined;

        this.framePredictionStates = {};
        this.poses = {};
        this.predictions = {};

        this.poseHistory = [];
        this.maxHistory = 1000;

        this.modelURL = options.modelURL;

        this.loaded = false;
        this.maxPredictions = 0;

    }

    // Successful load of JSON should overwrite anything currently in poses
    loadJSON(options) {
        let self = this;
        loadJSON(options.videoPoses, (loaded) => {
            let poseList = loaded.data;
            this.poses = {};
            poseList.forEach( (p, i) => this.poses[i] = p[0].pose );
        });
    }

    async loadModel(callbackFunction=undefined) {
        let modelURL = this.modelURL + 'model.json';
        let metadataURL = this.modelURL + 'metadata.json';

        this.model = await tmPose.load(modelURL, metadataURL);
        this.maxPredictions = this.model.getTotalClasses();
        this.loaded = true;
        console.log(`classifier loaded: ${this.maxPredictions} classes`);
        if (callbackFunction) callbackFunction(this);
    }

    predictForVideo(video, frame) {
        // We already have both the pose and the classification! Simply return
        if (this.poses[frame] && this.predictions[frame]) {
            return {pose:this.poses[frame], prediction:this.predictions[frame]};
        }

        // We have the frame (e.g. it was loaded as a JSON file)
        // but we haven't classified it yet
        if (this.poses[frame]) {
            let self = this;
            if (!self.framePredictionStates[frame]) {
                self.framePredictionStates[frame] = 'triggered';
                self.model.estimatePose(video.elt)
                .then(v => self.model.predict(v.posenetOutput))
                .then(p => self.predictions[frame] = p);
            }
            return {pose:this.poses[frame], prediction: undefined};
        }

        // We don't yet have anything - let's try not blocking
        else {
            let self = this;
            if (!self.framePredictionStates[frame]) {
                self.framePredictionStates[frame] = 'triggered';
                self.model.estimatePose(video.elt)
                .then(v => {
                    convertToML5Structure(v.pose);
                    self.poses[frame] = v.pose;
                    return self.model.predict(v.posenetOutput)
                })
                .then(p => self.predictions[frame] = p);
            }
            return {pose:undefined, prediction: undefined};
            /*
            self.framePredictionStates[frame] = 'triggered';
            let {pose, prediction} = await predictForWebcam(options, video);
            return {pose: pose, prediction: prediction};*/

        }
    }

    async predictForWebcam(video) { // this must be async?

        // this needs to be blocking -
        let { pose, posenetOutput } = await this.model.estimatePose(video.elt);
        let prediction = await this.model.predict(posenetOutput);

        convertToML5Structure(pose);

        //this.poseHistory.unshift(pose);
        //if (this.poseHistory.length > this.maxHistory) this.poseHistory.pop();

        //if (frame) video.loop();
        return {pose:pose, prediction:prediction};
    }

    clear() {
        this.frameStates = {};
        this.poses = {};
        this.predictions = {};
        this.poseHistory = [];
    }

    checkIfComplete(totalFrames) {
        console.log(`Total: ${totalFrames}, Frames predicted: ${Object.keys(this.poses).length}`);
        return (Object.keys(this.predictions).length == totalFrames);
    }
}

function convertToML5Structure(pose) {
    pose.keypoints.forEach((kp, i) => {
        pose[kp.part] = {
            confidence: kp.score,
            x: kp.position.x,
            y: kp.position.y
        }
    });
}
