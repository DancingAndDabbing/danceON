// Setup and variables for the Ace Editor

let editor = ace.edit("editor", {
    fontSize: 16,
    fontFamily: "Space Mono",
    theme: "ace/theme/willie_custom",
    enableLiveAutocompletion: true
});

// store pose parts for autocompletion
let poseParts = [{caption: 'nose', value: 'nose'},
    {caption: 'leftEye', value: 'leftEye'},
    {caption: 'rightEye', value: 'rightEye'},
    {caption: 'leftEar', value: 'leftEar'},
    {caption: 'rightEar', value: 'rightEar'},
    {caption: 'leftShoulder', value: 'leftShoulder'},
    {caption: 'rightShoulder', value: 'rightShoulder'},
    {caption: 'leftElbow', value: 'leftElbow'},
    {caption: 'rightElbow', value: 'leftElbow'},
    {caption: 'leftWrist', value: 'leftWrist'},
    {caption: 'rightWrist', value: 'rightWrist'},
    {caption: 'leftHip', value: 'leftHip'},
    {caption: 'rightHip', value: 'rightHip'},
    {caption: 'leftKnee', value: 'leftKnee'},
    {caption: 'rightKnee', value: 'rightKnee'},
    {caption: 'leftAnkle', value: 'leftAnkle'},
    {caption: 'rightAnkle', value: 'rightAnkle'}];
let posePartPositions = [{caption: 'x', value: 'x'}, {caption: 'y', value: 'y'}];
let whatToDrawWords = [
    {caption: 'circle', value: " 'circle',"},
    {caption: 'line', value: " 'line',"},
    {caption: 'point', value: " 'point',"},
    {caption: 'ellipse', value: " 'ellipse',"},
    {caption: 'square', value: " 'square',"},
    {caption: 'rect', value: " 'rect',"},
    {caption: 'arc', value: " 'arc',"},
    {caption: 'circle', value: " 'circle',"},
    {caption: 'quad', value: " 'quad',"},
    {caption: 'triangle', value: " 'triangle',"},
    {caption: 'text', value: " 'text',"},
]

let wordList = [
    {caption:'pose', value:'pose'},
    {caption:'fill', value:'fill: color(255, 255, 255, 255),'},
    {caption:'stroke', value:'stroke: color(255, 255, 255, 255),'},
    {caption:'strokeWeight', value:'strokeWeight: 1,'},
    {caption: 'what', value: 'what'},
    {caption: 'where', value: 'where: {},'},
    {caption: 'when', value: 'when: true,'},
    {caption: 'how', value: 'how: {},'},
    {caption: 'start', value: 'start: {},'},
];

let poseAutoComplete = false;
let posePositionAutoComplete = false;
let whatAutoComplete = false;

let poseCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        let wordsToShow = wordList;
        if (poseAutoComplete) wordsToShow = poseParts;
        if (posePositionAutoComplete) wordsToShow = posePartPositions;
        if (whatAutoComplete) wordsToShow = whatToDrawWords;
        let comp = wordsToShow.map(function(word) {
            return {
                caption: word.caption,
                value: word.value,
                score: 100
            };
        });
        poseAutoComplete = false;
        posePositionAutoComplete = false;
        whatAutoComplete = false;

        callback(null, comp);
    }
};
editor.completers = [poseCompleter];

editor.commands.addCommand({
    name: "poseAutoCompleter",
    bindKey: { win: ".", mac: "." },
    exec: function () {
        let lastToken = getlastToken();
        if (!lastToken) return;

        editor.insert(".");
        if (lastToken === "pose") {
            poseAutoComplete = true;
            editor.completer.showPopup(editor);
        }
        else if (poseParts.map(p => 'pose.' + p.caption).includes(lastToken)) {
            posePositionAutoComplete = true;
            editor.completer.showPopup(editor);
        };
    }
});

editor.commands.addCommand({
    name: "whatAutoCompleter",
    bindKey: { win: ":", mac: ":" },
    exec: function () {
        let lastToken = getlastToken();
        if (!lastToken) return;

        editor.insert(":");
        if (lastToken === "what") {
            whatAutoComplete = true;
            editor.completer.showPopup(editor);
        }
    }
});

// Sometimes we want to programmatically set the editor and handle things differently
// This variable helps us keep track of when it is us or the user behind changes
let fromSetValueCall = false;

const STARTING_CODE = `(pose) => [

];`

let declarations = new ace.EditSession(STARTING_CODE);
declarations.setUndoManager(new ace.UndoManager());
declarations.setUseWorker(false);

declarations.setMode("ace/mode/javascript");
editor.setSession(declarations);

// interaction functions
function getlastToken() {
    let pos = editor.selection.getCursor();
    let session = editor.session;

    let curLine = (session.getDocument().getLine(pos.row)).trim();
    let curTokens = curLine.slice(0, pos.column).split(/\s+/);
    let curCmd = curTokens[0];
    if (!curCmd) return false;
    let lastToken = curTokens[curTokens.length - 1];

    return lastToken;
}

// change editor functions
function changeEditorFontSize(size) {
    document.getElementById('editor').style.fontSize=`${size}px`;
}
