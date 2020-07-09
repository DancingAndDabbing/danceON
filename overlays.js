// May become a class
function cursorIcon() {
    push();

    stroke(255);
    strokeWeight(1);
    fill('rgba(30, 30, 30, 0.5)');
    circle(constrain(mouseX, 0, width), constrain(mouseY, 0, height), 6);

    pop();
}

function cursorPosition(options) {
    push();

    noStroke();
    fill('rgba(30,30,30, 0.5)');
    rect(
        constrain(mouseX-4, 4, options.videoWidth-44),
        constrain(mouseY-34, 2, options.videoHeight-34),
        40, 30, 4);

    fill(255);
    text(
        `x: ${floor(constrain(mouseX, 0, options.videoWidth))}`,
        constrain(mouseX, 8, options.videoWidth-40),
        constrain(mouseY-22, 14, options.videoHeight-22)
    );
    text(
        `y: ${floor(constrain(mouseY, 0, options.videoHeight))}`,
        constrain(mouseX, 8, options.videoWidth-40),
        constrain(mouseY-10, 26, options.videoHeight-10),
    );

    pop();
}

function loadingText(txt) {
    push();
    textSize(24);
    textAlign(CENTER);
    fill(20);
    text(`loading ${txt}...`, width/2, height/2);
    pop();
}

function errorText(e) {
    push();
    background('rgba(30, 30, 30, 0.9)');
    textAlign(CENTER);
    fill(255);
    stroke(255);
    strokeWeight(1);
    text('Hmmm...', width/2, height/2);
    text(e, 0, height/2 + 20, width);
    pop();
}

function warningText() {
    push();
    textAlign(CENTER);

    noStroke();
    fill('rgba(244, 85, 37, 0.9)')
    rect(0, 3*(height/4) - 30, width, 40);

    fill(255);
    textSize(24);
    text('Warning: Using Old Code...', width/2, 3*(height/4));
    pop();
}

function skeleton(options, pose) {
    push();
    textAlign(CENTER);
    noStroke();

    // draw skeleton - update the JSON file
    // issue - text doesn't display properly if points too close
    pose.keypoints.forEach((p, i) => {
        let sx = p.position.x;
        let sy = p.position.y;

        fill('rgba(255, 255, 255, 0.9)');
        circle(sx, sy, 8);
        if (!options.playing && dist(mouseX, mouseY, sx, sy) < 8) {
                fill('rgba(30,30,30, 0.5)');
                rect(sx-37, sy+8, 74, 16, 4); // improvement - respond to text

                fill(255);
                text(p.part, sx, sy+20);
            }
    });
    pop();
}

function mlText(options, prediction) {
    push();
    textSize(16);
    textAlign(RIGHT, TOP);
    textLeading(20);
    stroke(30);
    strokeWeight(1);
    fill(255);

    let txt = "";

    prediction.forEach((p, i) => {
        txt += `${p.className}: ${p.probability.toFixed(2)}\n`;
    });

    text(txt, width-16, 16);

    pop();
}
