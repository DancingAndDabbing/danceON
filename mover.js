class Mover {
    constructor(args) {

        this.framesAlive = 0;
        this.maxFrames = fallbackToDefault(args.frames, 10000);
        this.draw = args.draw;
        this.bind = fallbackToDefault(args.bind, {});

        this.points = fallbackToDefault(args.start, {});; // syntax??? Error catching???

        this.velocityX = fallbackToDefault(this.bind.velocityX, random(-2, 2));
        this.velocityY = fallbackToDefault(this.bind.velocityY, -10);

        this.accelerationX = fallbackToDefault(this.bind.accelerationX, 0);
        this.accelerationY = fallbackToDefault(this.bind.accelerationY, 0.5);

        // These don't belong in "bind" going forward
        delete this.bind.velocityX;
        delete this.bind.velocityY;
        delete this.bind.accelerationX;
        delete this.bind.accelerationY;
    }

    update() {
        for (const prop in this.points) {
            if (prop[0] == 'x') this.points[prop] += this.velocityX;
            if (prop[0] == 'y') this.points[prop] += this.velocityY;
        }

        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;

        this.framesAlive += 1;
    }

    // function for dealing with key frames
    // This returns an object that should be identical to its static counterpart
    show() {
        let currentBind = {};
        Object.assign(currentBind, this.bind);
        for (const prop in currentBind) {
            if (Array.isArray(currentBind[prop])) {
                currentBind[prop] = this.interpolate(currentBind[prop]);
            }
        }

        for (const prop in this.points) {
            currentBind[prop] = this.points[prop];
        }
        return {'bind': currentBind, 'draw': this.draw};
    }

    // currently only supports numbers - not strings or colors
    // linear interpolation using map
    /*
    sample = [
        {frame: 0, value: 0},
        {frame: 100, value: 30},
        {frame: 200, value: 0},
    ]
    */
    interpolate(fr) {
        let ordered = fr.sort((a, b) => a.frame - b.frame);
        let frames = ordered.map(f => f.frame);
        let values = ordered.map(f => f.value);

        let ib = frames.findIndex(i => i > this.framesAlive);

        if (ib == 0) return values[0];
        else if (ib == -1) return values[values.length - 1];
        else return map(this.framesAlive,
            frames[ib-1], frames[ib],
            values[ib-1], values[ib]);
    }
}

class Movers {
    constructor() {
        this.movers = [];
        this.maxNum = 100;
    }

    add(args) {
        let mover = new Mover(args);
        this.movers.unshift(mover);
    }

    update() {
        this.movers = this.movers.slice(0, this.maxNum).filter(m => m.framesAlive < m.maxFrames);
        // also maybe filter out objects that are too far out of view
        this.movers.forEach(m => m.update());
    }

    show() {
        let thingsToDraw = this.movers.map(m => m.show()).reverse();
        // reverse
        return thingsToDraw;
    }
}
