// TODO - Update animation system to support strings and lists

class Mover {
    constructor(args) {

        this.framesAlive = 0;
        this.maxFrames = fallbackToDefault(args.how.frames, 10000);

        this.what = args.what;
        this.where = fallbackToDefault(args.where, {}); // this.points???
        this.how = fallbackToDefault(args.how, {});

        this.points = fallbackToDefault(this.where.start, {}); // syntax??? Error catching???

        this.velocityX = fallbackToDefault(this.points.velocityX, random(-2, 2));
        this.velocityY = fallbackToDefault(this.points.velocityY, -10);

        this.accelerationX = fallbackToDefault(this.where.accelerationX, 0);
        this.accelerationY = fallbackToDefault(this.where.accelerationY, 0.5);

        // These don't belong in the args going forward as they are not
        // present in the static counterparts
        // * maybe reconsider - could be useful for animations...
        delete this.points.velocityX;
        delete this.points.velocityY;
        delete this.where.accelerationX;
        delete this.where.accelerationY;
    }

    update() {
        for (const prop in this.points) {
            if (prop[0] == 'x') this.points[prop] += this.velocityX;
            if (prop[0] == 'y') this.points[prop] += this.velocityY;
        }

        // I could interpolate here if acceleration is passed an object arg

        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;

        this.framesAlive += 1;
    }

    // function for dealing with key frames
    // This returns an object that should be identical to its static counterpart
    show() {
        let currentHow = {};
        let currentWhere = {};
        Object.assign(currentHow, this.how);

        for (const prop in currentHow) {
            if (Array.isArray(currentHow[prop])) {
                currentHow[prop] = this.interpolate(currentHow[prop]);
            }
        }

        for (const prop in this.points) {
            currentWhere[prop] = this.points[prop];
        }
        return {'what': this.what, 'where': currentWhere, 'how': currentHow};
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
