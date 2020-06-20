// Playbar not support drag yet
// TODO - Add Record Button

class PlayBar {
    constructor(options) {
        this.height = options.playbarHeight;

        this.x = 0;
        this.y = options.videoHeight;

        this.buttonWidth = 40;
        this.barWidth = 0;
        this.maxBarWidth = options.videoWidth - (this.buttonWidth * 2);

        this.playing = false;
        this.recording = false;
        this.hover = false;
        this.hoverFrame = 0;

    }

    update(args) {
        this.playing = args.playing;

        this.barWidth = map(args.frameNum, 0, args.totalFrames, 0, this.maxBarWidth);
        this.hoverFrame = floor(map(mouseX, this.buttonWidth*2, width,
                                    0, args.totalFrames, true));
    }

    // Shapes to draw
    draw() {
        this.drawPlayButton();
        this.drawRecordButton();
        this.drawDivider(this.buttonWidth);
        this.drawDivider(this.buttonWidth*2);
        this.drawBar();
        if (this.overBar()) this.drawHoverText();
    }

    drawPlayButton() {
        push();
        noStroke();
        if (this.overPlayButton()) fill('rgba(30,30,30, 0.8)');
        else fill('rgba(30,30,30, 0.5)');

        // Draw pause icon
        if (this.playing) {
            rect(this.x + 12, this.y + 8, 4, this.height - 16, 2);
            rect(this.buttonWidth - 18, this.y + 8, 4, this.height - 16, 2);
        }

        // Draw play icon
        else {
            triangle(this.x+12, this.y + 8,
                     this.x+12, this.y + 32,
                     this.buttonWidth -6, this.y + (this.height/2),)
        }
        pop();
        return;
    }

    drawDivider(xPos) {
        stroke('rgba(30,30,30, 0.5)');
        line(xPos, this.y+5, xPos, this.y+this.height-5);

        return;
    }

    drawRecordButton() {
        push();
        noStroke();
        if (this.overRecordButton()) fill('rgba(200,30,30, 0.8)');
        else fill('rgba(30,30,30, 0.5)');

        circle(this.buttonWidth + this.buttonWidth/2, this.y + this.height/2,
               this.height/3);

        pop();
        return;
    }

    drawBar() {
        push();

        // settings
        noStroke();
        fill(245);
        rect(this.buttonWidth*2, this.y, this.barWidth, this.height,
            0, 10, 10, 0);

        pop();
    }

    drawHoverText() {
        push();
        noStroke();
        fill('rgba(30,30,30, 0.5)');
        rect(mouseX - 4,
            this.y, 8, this.height);

        fill(30);
        textSize(16);
        textAlign(LEFT, CENTER);
        text(`frame: ${this.hoverFrame}`,
            min(width-100, mouseX + 6),
            this.y + this.height/2);

        pop();
    }

    // Mouse Interaction Checks
    overPlayButton() {
        if ((mouseX > this.x && mouseX < this.buttonWidth) &&
            (mouseY > this.y && mouseY < height)) return true;
    }

    overRecordButton() {
        if ((mouseX > this.buttonWidth && mouseX < this.buttonWidth*2) &&
            (mouseY > this.y && mouseY < height)) return true;
    }

    overBar() {
        if ((mouseX > this.buttonWidth*2 && mouseX < width) &&
            (mouseY > this.y && mouseY < height)) return true;
    }

    getFrame() { return this.hoverFrame; }
}
