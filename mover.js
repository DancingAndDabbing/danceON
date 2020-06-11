class Mover {
    constructor(args) {

        this.framesAlive = 0;
        this.maxFrames = args.frames || 10000;
        this.draw = args.draw;

        this.points = args.start; // syntax???

        this.velocityX = args.bind.velocityX || 0;
        this.velocityY = args.bind.velocityY || 0;

        this.accelerationX = args.bind.accelerationX || 0;
        this.accelerationY = args.bind.accelerationY || 0;        

        //delete args.type;
        //delete args.condition;
        //delete args.draw;
        //delete args.start;
        delete args.bind.velocityX;
        delete args.bind.velocityY;
        delete args.bind.accelerationX;
        delete args.bind.accelerationY;

        this.bind = args.bind;
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
    show() {
        let currentBind = {};
        Object.assign(currentBind, this.bind);

        for (const prop in this.points) {
            currentBind[prop] = this.points[prop];
        }
        return {'bind': currentBind, 'draw': this.draw};
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
