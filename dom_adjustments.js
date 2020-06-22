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
