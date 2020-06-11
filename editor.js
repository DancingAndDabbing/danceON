let editor = ace.edit("editor", {
    fontSize: 16
});

let startingCode = `(pose, poseHistory) => [
    {
        draw: 'circle',
        type: 'static',
        condition: true,
        bind: {
            x: pose.leftWrist.x,
            y: pose.leftWrist.y,
            d: 30,
            fill: 'rgba(0,255,0, 0.25)',
            stroke: 50
        }
    },
    {
        draw: 'circle',
        type: 'dynamic',
        condition: true,
        start: {
            x: pose.rightWrist.x,
            y: pose.rightWrist.y,
        },
        bind: {
            velocityX: -10,
            velocityY: 0,
            accelerationX: 0,
            accelerationY: 0,
            d: 30,
            fill: 'rgba(0,255,0, 0.25)',
            stroke: 50
        }
    }
];`

/*if (typeof(Storage) !== "undefined" && localStorage.getItem('userDeclarations')) {
    startingCode = localStorage.getItem('userDeclarations');
}*/

let declarations = new ace.EditSession(startingCode);

declarations.setMode("ace/mode/javascript");
editor.setSession(declarations);
