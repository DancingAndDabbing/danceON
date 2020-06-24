// Functions for recording the p5 canvas
// Maintains source audio as well
// Partially adapted from this Stack Overflow example:
// https://stackoverflow.com/questions/39302814/mediastream-capture-canvas-and-audio-simultaneously
// TODO: Refactoring - This should really be a class

let chunks = [];

function record(options, recorder, canvas) {
    // Set up media contexts - necessary for recording
    let audioContext = new AudioContext();
    let dest = audioContext.createMediaStreamDestination();
    options.audioStream = dest.stream;
    let sourceNode = audioContext.createMediaElementSource(video.elt);
    sourceNode.connect(dest);

    let canvasStream = canvas.elt.captureStream(options.videoFramerate);
    canvasStream.addTrack(options.audioStream.getAudioTracks()[0]);

    recorder = new MediaRecorder(canvasStream);

    recorder.start();
    recorder.ondataavailable = saveChunks;
    recorder.onstop = exportRecording;

    return recorder;
}

// Currently it will automatically download
// Do browsers block downloading or video capture
//  (img.crossOrigin = 'anonymous';)
function exportRecording(e) {
    if (chunks.length) {
        let blob = new Blob(chunks);
        let vidURL = URL.createObjectURL(blob, {type: 'video/webm'});

        let a = document.createElement("a",);
        a.href = vidURL;
        a.download = "MyVideo.webm";
        a.click();
        window.URL.revokeObjectURL(vidURL);

        alert('Downloading your recording');
    }

    chunks = [];
    return;
}

function saveChunks(e) {
    e.data.size && chunks.push(e.data);
}
