let editor = ace.edit("editor", {
    fontSize: 16
});

/*
let startingCode = `(pose, poseHistory) => [
    {'circle':{
        'x': pose.rightWrist.x,
        'y': pose.rightWrist.y,
        'd': 10
        }
    }
];`
*/
let startingCode = `(pose, poseHistory) => [
    {
        draw: 'circle',
        condition: true,
        bind: {
            x:pose.leftWrist.x,
            y:pose.leftWrist.y,
            d:10
        },
        fill: 'rgba(0,255,0, 0.25)',
        stroke: 50
    }
];`

/*if (typeof(Storage) !== "undefined" && localStorage.getItem('userDeclarations')) {
    startingCode = localStorage.getItem('userDeclarations');
}*/

let declarations = new ace.EditSession(startingCode);

declarations.setMode("ace/mode/javascript");
editor.setSession(declarations);
