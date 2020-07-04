// Playbar not support drag yet
// TODO - Add Record Button

class PlayBar {
    constructor(options) {
        this.options = options; // pointer to options
        this.height = options.playbarHeight;

        this.x = 0;
        this.options.videoHeight = this.options.videoHeight;

        this.buttonWidth = 40;
        this.barWidth = 0;

        this.playing = false;
        this.recording = false;
        this.hover = false;
        this.hoverFrame = 0;

        this.playPressed = false;

    }

    update(args) {
        this.playing = this.options.playing;
        if (this.playing) this.playPressed = true;

        this.barWidth = map(args.frameNum, 0, args.totalFrames, 0, this.maxBarWidth());
        this.hoverFrame = floor(map(mouseX, this.buttonWidth*2, width,
                                    0, args.totalFrames, true));
    }

    // Shapes to draw
    draw(args) {
        this.drawBackdrop();
        if (this.options.webcam) return;

        this.drawPlayButton();
        this.drawMuteButton();
        this.drawRecordButton();

        this.drawDivider(this.buttonWidth);
        this.drawDivider(this.buttonWidth*2);
        this.drawDivider(this.buttonWidth*3);

        this.drawBar();

        if (!this.playPressed) this.userPrompt();
        if (this.overBar()) this.drawHoverText();
    }

    drawBackdrop() {
        push();
        noStroke();

        fill(255);
        rect(0, this.options.videoHeight, width, this.height);

        fill(220);
        rect(0, this.options.videoHeight, width, this.height, 0, 0, 10, 10);

        pop();
    }

    drawPlayButton() {
        push();
        noStroke();
        if (this.overPlayButton()) fill('rgba(30,30,30, 0.8)');
        else fill('rgba(30,30,30, 0.5)');

        // Draw pause icon
        if (this.playing) {
            rect(this.x + 12, this.options.videoHeight + 8, 4, this.height - 16, 2);
            rect(this.buttonWidth - 18, this.options.videoHeight + 8, 4, this.height - 16, 2);
        }

        // Draw play icon
        else {
            triangle(this.x+12, this.options.videoHeight + 8,
                     this.x+12, this.options.videoHeight + 32,
                     this.buttonWidth -6, this.options.videoHeight + (this.height/2),)
        }
        pop();
        return;
    }

    drawDivider(xPos) {
        stroke('rgba(30,30,30, 0.5)');
        line(xPos, this.options.videoHeight+5, xPos, this.options.videoHeight+this.height-5);

        return;
    }

    drawMuteButton() {
        let cVal;
        push();
        noStroke();

        if (this.overMuteButton()) cVal = 'rgba(30,30,30, 0.8)';
        else cVal = 'rgba(30,30,30, 0.5)';
        fill(cVal);

        beginShape();
        vertex(this.buttonWidth + 6, this.options.videoHeight+14);
        vertex(this.buttonWidth + 16, this.options.videoHeight+14);

        vertex(this.buttonWidth + 22, this.options.videoHeight+8);
        vertex(this.buttonWidth + 22, height-8);

        vertex(this.buttonWidth + 16, height-14);
        vertex(this.buttonWidth + 6, height-14);
        endShape(CLOSE);

        noFill();
        stroke(cVal);
        strokeWeight(2);

        // draw an 'x' if muted
        if (this.options.muted) {
            line(this.buttonWidth + 26, this.options.videoHeight+16, this.buttonWidth + 34, height-16);
            line(this.buttonWidth + 26, height-16, this.buttonWidth + 34, this.options.videoHeight+16);
        }

        // draw a 'waveform' if not
        else {
            arc(this.buttonWidth+6, height - 20, 40, 40, -QUARTER_PI/2, QUARTER_PI/2);
            arc(this.buttonWidth+10, height - 20, 40, 40, -QUARTER_PI/1.5, QUARTER_PI/1.5);
            arc(this.buttonWidth+14, height - 20, 40, 40, -QUARTER_PI/1.2, QUARTER_PI/1.2);
        }

        pop();
    }

    drawRecordButton() {
        push();
        noStroke();
        if (this.overRecordButton()) fill('rgba(200,30,30, 0.8)');
        else fill('rgba(30,30,30, 0.5)');

        circle(this.buttonWidth*2 + this.buttonWidth/2, this.options.videoHeight + this.height/2,
               this.height/3);

        pop();
        return;
    }

    drawBar() {
        push();

        // settings
        noStroke();
        fill(245);
        rect(this.buttonWidth*3, this.options.videoHeight, this.barWidth, this.height,
            0, 0, 10, 0);

        pop();
    }

    drawHoverText() {
        push();
        noStroke();
        fill('rgba(30,30,30, 0.5)');
        rect(mouseX - 4,
            this.options.videoHeight, 8, this.height);

        fill(30);
        textSize(16);
        textAlign(LEFT, CENTER);
        text(`frame: ${this.hoverFrame}`,
            min(width-100, mouseX + 6),
            this.options.videoHeight + this.height/2);

        pop();
    }

    userPrompt() {
        push();
        textSize(16);
        fill(255);
        stroke(30);
        textFont('Helvetica');
        textAlign(LEFT, BOTTOM);
        text('Press Play to get started!',
            this.buttonWidth / 2,
            this.options.videoHeight - 4
        );

        pop();
    }

    // Mouse Interaction Checks
    overPlayButton() {
        if ((mouseX > this.x && mouseX < this.buttonWidth) &&
            (mouseY > this.options.videoHeight && mouseY < height)) return true;
    }

    overMuteButton() {
        if ((mouseX > this.buttonWidth && mouseX < this.buttonWidth*2) &&
            (mouseY > this.options.videoHeight && mouseY < height)) return true;
    }

    overRecordButton() {
        if ((mouseX > this.buttonWidth*2 && mouseX < this.buttonWidth*3) &&
            (mouseY > this.options.videoHeight && mouseY < height)) return true;
    }

    overBar() {
        if ((mouseX > this.buttonWidth*3 && mouseX < width) &&
            (mouseY > this.options.videoHeight && mouseY < height)) return true;
    }

    // Dynamic getters
    getFrame() { return this.hoverFrame; }

    maxBarWidth() {
        return this.options.videoWidth - (this.buttonWidth * 3);
    }
}
