// These functions are meant to update the visuals of the page on user input
// They are not meant to support any other functionality

// Settings
function openSettings() {
    document.getElementById("settings").classList.add("is-active");
}

function closeSettings() {
    document.getElementById("settings").classList.remove("is-active");
}

// Toggles
function enableMLToggle(val=false) {
    document.getElementById("ml").disabled = val;
}

function activateWebCamButton() {
    document.getElementById("webcamToggle").classList.add("is-selected");
    document.getElementById("webcamToggle").classList.add("is-link");
    document.getElementById("videoToggle").classList.remove("is-selected");
    document.getElementById("videoToggle").classList.remove("is-link");
}

function activateVideoButton() {
    document.getElementById("webcamToggle").classList.remove("is-selected");
    document.getElementById("webcamToggle").classList.remove("is-link");
    document.getElementById("videoToggle").classList.add("is-selected");
    document.getElementById("videoToggle").classList.add("is-link");
}

function toggleRecordingNotifier(visible=true) {
    if (visible) document.getElementById("recordingNotifier").classList.remove("is-hidden");
    else document.getElementById("recordingNotifier").classList.add("is-hidden");

}

function toggleAnalyzingNotifier(visible=true) {
    if (visible) document.getElementById("analyzingNotifier").classList.remove("is-hidden");
    else document.getElementById("analyzingNotifier").classList.add("is-hidden");

}

function updateVideoFileText(fullPath) {
    let fileName = fullPath.split(/(\\|\/)/g).pop();
    document.getElementById("videoUploadName").innerHTML = fileName;
}

function updatePoseFileText(fullPath, active=true) {
    let dv = document.getElementById("poseUploadDiv");
    let txt = document.getElementById("poseUploadName");

    if (active) txt.innerHTML = fullPath.split(/(\\|\/)/g).pop();
    else txt.innerHTML = "none";

    dv.classList.toggle("is-link", active);
    dv.classList.toggle("is-danger", !active);
}

function changeTMLinkInput(state) {
    let inp = document.getElementById("mlInput");
    let hlp = document.getElementById("mlHelp");

    inp.classList.toggle("is-warning", state=='loading');
    inp.classList.toggle("is-danger", state=='error');
    inp.classList.toggle("is-success", state=='success');

    //hlp.classList.toggle("is-warning", state=='loading');
    hlp.classList.toggle("is-danger", state=='error');
    hlp.classList.toggle("is-success", state=='success');

    switch (state) {
        case 'loading':
            hlp.innerHTML = "Loading the link you pasted..."
            break;
        case 'error':
            hlp.innerHTML = "Hmmm, that does not seem like a Teachable Machine url."
            break;
        case 'success':
            hlp.innerHTML = "Teachable Machine Model loaded!"
            break;
        default:
            hlp.innerHTML = "Paste in a link from Teachable Machine.";
    }
}
