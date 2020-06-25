let editor = ace.edit("editor", {
    fontSize: 16
});


var exampleFile = new File(["example"], 'examples/example4.js');
var reader = new FileReader();

let exampleCode = reader.readAsText(exampleFile);
// let exampleCode = reader.readAsArrayBuffer(exampleFile);

// let startingCode = eval("`"+exampleCode+"`");
// let startingCode = exampleCode;

let startingCode = `(pose) => [];`


/*if (typeof(Storage) !== "undefined" && localStorage.getItem('userDeclarations')) {
    startingCode = localStorage.getItem('userDeclarations');
}*/

let declarations = new ace.EditSession(startingCode);

declarations.setMode("ace/mode/javascript");
editor.setSession(declarations);
