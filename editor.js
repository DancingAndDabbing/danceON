// Setup and variables for the Ace Editor

let editor = ace.edit("editor", {
    fontSize: 16,
    fontFamily: "Space Mono",
    theme: "ace/theme/willie_custom",
    enableLiveAutocompletion: true
});

// store pose parts for autocompletion
let poseParts = [
    {caption: 'nose', value: 'nose', meta: 'property'},
    {caption: 'leftEye', value: 'leftEye', meta: 'property'},
    {caption: 'rightEye', value: 'rightEye', meta: 'property'},
    {caption: 'leftEar', value: 'leftEar', meta: 'property'},
    {caption: 'rightEar', value: 'rightEar', meta: 'property'},
    {caption: 'leftShoulder', value: 'leftShoulder', meta: 'property'},
    {caption: 'rightShoulder', value: 'rightShoulder', meta: 'property'},
    {caption: 'leftElbow', value: 'leftElbow', meta: 'property'},
    {caption: 'rightElbow', value: 'leftElbow', meta: 'property'},
    {caption: 'leftWrist', value: 'leftWrist', meta: 'property'},
    {caption: 'rightWrist', value: 'rightWrist', meta: 'property'},
    {caption: 'leftHip', value: 'leftHip', meta: 'property'},
    {caption: 'rightHip', value: 'rightHip', meta: 'property'},
    {caption: 'leftKnee', value: 'leftKnee', meta: 'property'},
    {caption: 'rightKnee', value: 'rightKnee', meta: 'property'},
    {caption: 'leftAnkle', value: 'leftAnkle', meta: 'property'},
    {caption: 'rightAnkle', value: 'rightAnkle', meta: 'property'}
];

let posePartPositions = [
    {caption: 'x', value: 'x', meta: 'property'},
    {caption: 'y', value: 'y', meta: 'property'}
];

let whatToDrawWords = [
    {caption: 'circle', value: " 'circle',", meta: 'string'},
    {caption: 'line', value: " 'line',", meta: 'string'},
    {caption: 'point', value: " 'point',", meta: 'string'},
    {caption: 'ellipse', value: " 'ellipse',", meta: 'string'},
    {caption: 'square', value: " 'square',", meta: 'string'},
    {caption: 'rect', value: " 'rect',", meta: 'string'},
    {caption: 'arc', value: " 'arc',", meta: 'string'},
    {caption: 'circle', value: " 'circle',", meta: 'string'},
    {caption: 'quad', value: " 'quad',", meta: 'string'},
    {caption: 'triangle', value: " 'triangle',", meta: 'string'},
    {caption: 'text', value: " 'text',", meta: 'string'},
    {caption: 'shape', value: " 'shape',", meta: 'string'},
    {caption: 'curve', value: " 'curve',", meta: 'string'},
    {caption: 'heart', value: " 'heart',", meta: 'string'},
];

let wordList = [
    {caption:'pose', value:'pose', meta: 'object'},
    {caption:'fill', value:'fill: color(255, 255, 255, 255),', meta: 'property'},
    {caption:'stroke', value:'stroke: color(255, 255, 255, 255),', meta: 'property'},
    {caption:'strokeWeight', value:'strokeWeight: 1,', meta: 'property'},
    {caption: 'what', value: 'what', meta: 'property'},
    {caption: 'where', value: 'where: {},', meta: 'property'},
    {caption: 'when', value: 'when: true,', meta: 'property'},
    {caption: 'how', value: 'how: {},', meta: 'property'},
    {caption: 'start', value: 'start: {},', meta: 'property'},
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
                meta: word.meta
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
    multiSelectAction: "forEach",
    exec: function () {
        let lastToken = getlastToken();
        editor.insert(".");
        if (editor.inMultiSelectMode) return;

        if (!lastToken) return;

        if (lastToken === "pose") {
            poseAutoComplete = true;
            editor.completer.showPopup(editor);
        }
        else if (poseParts.map(p => 'pose' + p.caption).includes(lastToken)) {
            posePositionAutoComplete = true;
            editor.completer.showPopup(editor);
        };
    }
});

editor.commands.addCommand({
    name: "whatAutoCompleter",
    bindKey: { win: ":", mac: ":" },
    multiSelectAction: "forEach",
    exec: function () {
        let lastToken = getlastToken();
        editor.insert(":");

        if (editor.inMultiSelectMode == true) return;
        if (!lastToken) return;

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
declarations.setUseWorker(false); // default jshint not great

declarations.setMode("ace/mode/javascript");
editor.setSession(declarations);

function parseAndShowErrors(currentCode) {
    // If we can't use webworkers - then we'll have to do the parsing
    let errAnnotations = [];
    try {
        let tree = esprima.parseScript(currentCode, { tolerant: true });
        tree.errors.forEach(err => errAnnotations.push(createErrorAnnotation(err)));
    } catch (e) {
        errAnnotations.push(createErrorAnnotation(e));
    } finally { declarations.setAnnotations(errAnnotations); }
}

function createErrorAnnotation(errMess) {
    return {
        row: errMess.lineNumber - 1,
        column: errMess.column,
        text: errMess.description,
        type: "error"
    }
}

function getlastToken() {
    let pos = editor.selection.getCursor();
    let session = editor.session;

    let curLine = (session.getDocument().getLine(pos.row)).trim();
    let noPuctuation = curLine.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    let noExtraSpaces = noPuctuation.replace(/\s{2,}/g," ");

    let curTokens = noExtraSpaces.slice(0, pos.column).split(/\s+/);
    //console.log(curTokens);
    let curCmd = curTokens[0];
    if (!curCmd) return false;
    let lastToken = curTokens[curTokens.length - 1];

    return lastToken;
}

// editor settings functions
function changeEditorFontSize(size) {
    document.getElementById('editor').style.fontSize=`${size}px`;
}

// Upload/Download
function uploadDeclarations(newFile) {
    newFile.text().then(t => {
        fromSetValueCall = true;
        declarations.setValue(t);
    }).catch(e => {
        console.log(e);
        alert('Hmmmm. something wrong with the code you uploaded...');
    });
}

function downloadDeclarations() {
    try {
        let currentDec = declarations.getValue();
        let codeBlob = new Blob([currentDec], {type : 'text/js'});

        let url = window.URL.createObjectURL(codeBlob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = 'my_danceON_code.js';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (e) {
        console.log(e);
        alert('Hmmm. Something wrong downloading your code!')
    }

}
