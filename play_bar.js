// Does not support drag yet

class PlayBar {
    constructor(options) {
        this.height = options.playbarHeight;

        this.x = 0;
        this.y = options.videoHeight;

        this.buttonWidth = 40;
        this.barWidth = 0;
        this.maxBarWidth = options.videoWidth - this.buttonWidth;

        this.playing = false;
        this.hover = false;
        this.hoverFrame = 0;

    }

    update(args) {
        this.playing = args.playing;

        this.barWidth = map(args.frameNum, 0, args.totalFrames, 0, this.maxBarWidth);
        this.hoverFrame = floor(map(mouseX, this.buttonWidth, width,
                                    0, args.totalFrames, true));
    }

    // Shapes to draw
    draw() {
        this.drawPlayButton();
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
        //rect(this.x, this.y, this.buttonWidth, this.height);
        // if this.playing draw pause with two rectangles
        // else
        pop();
        return;
    }

    drawBar() {
        push();

        // settings
        noStroke();
        fill(245);
        rect(this.buttonWidth, this.y, this.barWidth, this.height,
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

    overBar() {
        if ((mouseX > this.buttonWidth && mouseX < width) &&
            (mouseY > this.y && mouseY < height)) return true;
    }

    getFrame() {
        return this.hoverFrame;
    }
}
