// Setup and variables for the Ace Editor

//ace.config.set('themePath', '/ace');
let editor = ace.edit("editor", {
    fontSize: 16,
    fontFamily: "Space Mono",
    theme: "ace/theme/willie_custom"
});

// Sometimes we want to programmatically set the editor and handle things differently
// This variable helps us keep track of when it is us or the user behind changes
let fromSetValueCall = false;

const STARTING_CODE = `(pose) => [

];`

/*if (typeof(Storage) !== "undefined" && localStorage.getItem('userDeclarations')) {
    startingCode = localStorage.getItem('userDeclarations');
}*/

let declarations = new ace.EditSession(STARTING_CODE);
declarations.setUndoManager(new ace.UndoManager());
declarations.setUseWorker(false);

declarations.setMode("ace/mode/javascript");
editor.setSession(declarations);
