class TMClassifier {
    constructor(options) {
        this.model = undefined;
        this.history = {};

        this.modelURL = options.modelURL;
        this.loaded = false;
        this.maxPredictions = 0;

    }

    async loadModel() {
        let modelURL = this.ModelURL + 'model.json';
        let metadataURL = this.ModelURL + 'metadata.json';

        this.model = await tmPose.load(modelURL, metadataURL);
        this.loaded = true;
    }

    async predict(pose, frame=undefined) { // this must be async?
        if (frame != undefined) {
            if (this.history[frame]) return this.history[frame];
            else {
                let prediction = await this.model.predict(pose);
                this.history[frame] = prediction;
                return prediction;
            }
        }
        else {
            let prediction = await view.mlModel.predict(pose);
            return prediction;
        }

    }

    // Initialize history? (maxFrames)

    clearHistory() { this.history = {}; }
}

// the predict function does not simply take in a pose, but a Float32Array
// containing it. We need to do a special conversion here
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose
concatenatePoseNet() {

}
