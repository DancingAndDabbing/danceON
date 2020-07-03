class Mover {
    constructor(args) {

        this.framesAlive = 0;

        this.what = args.what;
        this.where = fallbackToDefault(args.where, {}); // this.points???

        this.how = fallbackToDefault(args.how, {});
        this.maxFrames = fallbackToDefault(this.how.frames, 10000);

        // We shouldn't get here without a start...
        this.points = fallbackToDefault(this.where.start, {
            x: random(width), y: random(height),
            x1: random(width), y1: random(height),
            x2: random(width), y2: random(height),
            x3: random(width), y3: random(height),
            x4: random(width), y4: random(height),

        });

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

    // There is a bug if the user provides neither an x or a y value
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

    // currently only supports numbers, arrays, and colors
    // linear interpolation using lerp() function
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
        else {
            let startFrame = frames[ib-1];
            let endFrame = frames[ib];

            let startValue = values[ib-1];
            let endValue = values[ib]; // check if types match??

            let interpProgress = (this.framesAlive - startFrame) / (endFrame - startFrame);

            // Number case -> return a simple interpolation
            if (typeof(startValue) == typeof(endValue) && typeof(endValue) == 'number') {
                return lerp(startValue, endValue, interpProgress);
            }

            // Array case -> interpolate every value
            if (Array.isArray(startValue) && Array.isArray(endValue)) {
                return startValue.map((sv, i) => lerp(sv, endValue[i], interpProgress));
            }

            // Color case -> Use lerpColor function
            if ((typeof(startValue) == typeof(endValue) && typeof(endValue)  == 'object') &&
                    (startValue.mode && endValue.mode)) { // p5.Colors object have mode param
                return lerpColor(startValue, endValue, interpProgress);
            }

            // if we can't interpolate (e.g. string, obj) just return the
            // starting value - the object will still change, just not smoothly
            return startValue;
        }
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

    show() { return this.movers.map(m => m.show()).reverse(); }

    clear() { this.movers = []; }
}
