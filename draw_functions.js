// Draw functions can take in any arguments and draw anything included in p5
// They must take in a single argument object.
// One API Requirement: values that are affected by velocity/acceleration
// need to begin with an 'x' or 'y'

class DrawFunctions {

    // TODO - update when the user writes a new function somehow
    update() {
        return false;
    }

    // -- 2D Primitive Shape Functions --
    arc(args) {
        // set variables/defaults
        let x = fallbackToDefault(args.x, width/2);
        let y = fallbackToDefault(args.y, height/2);
        let w = fallbackToDefault(args.w, 30);
        let h = fallbackToDefault(args.h, w);
        let start = fallbackToDefault(args.start, 0);
        let stop = fallbackToDefault(args.stop, HALF_PI);
        let mode = fallbackToDefault(args.mode, OPEN);

        // draw things
        arc(x, y, w, h, start, stop, mode);
    }

    ellipse(args) {
        let x = fallbackToDefault(args.x, width/2);
        let y = fallbackToDefault(args.y, height/2);
        let w = fallbackToDefault(args.w, 30);
        let h = fallbackToDefault(args.h, d);

        ellipse(x, y, w, h);

    }

    circle(args) {
        let x = fallbackToDefault(args.x, width/2);
        let y = fallbackToDefault(args.y, height/2);
        let d = fallbackToDefault(args.d, 30);

        circle(x, y, d);
    }

    // Does not support z-coordinates
    line(args) {
        let x1 = fallbackToDefault(args.x1, width/2);
        let y1 = fallbackToDefault(args.y1, height/2);
        let x2 = fallbackToDefault(args.x2, x1+30);
        let y2 = fallbackToDefault(args.y2, y1+30);

        line(x1, y1, x2, y2);
    }

    point(args) {
        let x = fallbackToDefault(args.x, width/2);
        let y = fallbackToDefault(args.y, height/2);
        let coordinate_vector = fallbackToDefault(args.coordinate_vector,
            createVector(x, y));

        point(coordinate_vector);
    }

    quad(args) {
        let x1 = fallbackToDefault(args.x1, width/2);
        let y1 = fallbackToDefault(args.y1, height/2);
        let x2 = fallbackToDefault(args.x2, x1+30);
        let y2 = fallbackToDefault(args.y2, y1+30);
        let x3 = fallbackToDefault(args.x3, x1+45);
        let y3 = fallbackToDefault(args.y3, y1+45);
        let x4 = fallbackToDefault(args.x4, x1-30);
        let y4 = fallbackToDefault(args.y4, x1-30);

        quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    rect(args) {
        let x = fallbackToDefault(args.x, width/2);
        let y = fallbackToDefault(args.y, height/2);
        let w = fallbackToDefault(args.w, 30);
        let h = fallbackToDefault(args.h, w);
        let tl = fallbackToDefault(args.tl, 0);
        let tr = fallbackToDefault(args.tr, tl);
        let br = fallbackToDefault(args.br, tl);
        let bl = fallbackToDefault(args.bl, tl);

        rect(x, y, w, h, tl, tr, br, bl);
    }

    square(args) {
        let x = fallbackToDefault(args.x, width/2);
        let y = fallbackToDefault(args.y, height/2);
        let s = fallbackToDefault(args.s, 30);
        let tl = fallbackToDefault(args.tl, 0);
        let tr = fallbackToDefault(args.tr, tl);
        let br = fallbackToDefault(args.br, tl);
        let bl = fallbackToDefault(args.bl, tl);

        square(x, y, s, tl, tr, br, bl);
    }

    triangle(args) {
        let x1 = fallbackToDefault(args.x1, width/2);
        let y1 = fallbackToDefault(args.y1, height/2);
        let x2 = fallbackToDefault(args.x2, x1+30);
        let y2 = fallbackToDefault(args.y2, y1+30);
        let x3 = fallbackToDefault(args.x3, x1-30);
        let y3 = fallbackToDefault(args.y3, y1-30);

        triangle(x1, y1, x2, y2, x3, y3);
    }

}
