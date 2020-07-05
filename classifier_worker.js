// This code was an attempt at using web workers but I ran into problems
// accessing the video, tmPose object and classifier object

// Basically I need help figuring out the best way to 

importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js', 'helpers.js');

onmessage = async function(e) {
    //let modelURL = e.data.modelURL + 'model.json';
    //let metadataURL = e.data.modelURL + 'metadata.json';

    //let model = await tmPose.load(modelURL, metadataURL);
    let model = await modelLoader(e.data.modelURL);

    let { pose, posenetOutput } = await model.estimatePose(e.data.image);
    let prediction = await model.predict(posenetOutput);
    postMessage({pose: pose, prediction: prediction});
    // e.model.estimatePose(e.video.elt);
    //.then(v => self.model.predict(v.posenetOutput))
    //.then(p => self.predictions[frame] = p);
}
