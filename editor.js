// Setup and variables for the Ace Editor

let editor = ace.edit("editor", {
    fontSize: 14
});

// Sometimes we want to programmatically set the editor and handle things differently
// This variable helps us keep track
let fromSetValueCall = false;

const STARTING_CODE = `(pose) => [

];`

/*if (typeof(Storage) !== "undefined" && localStorage.getItem('userDeclarations')) {
    startingCode = localStorage.getItem('userDeclarations');
}*/

let declarations = new ace.EditSession(STARTING_CODE);
declarations.setUndoManager(new ace.UndoManager());

declarations.setMode("ace/mode/javascript");
editor.setSession(declarations);
