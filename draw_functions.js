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
    arc(where, how) {
        // set variables/defaults
        let x = fallbackToDefault(where.x, width/2);
        let y = fallbackToDefault(where.y, height/2);

        let w = fallbackToDefault(how.w, 30);
        let h = fallbackToDefault(how.h, w);
        let start = fallbackToDefault(how.start, 0);
        let stop = fallbackToDefault(how.stop, HALF_PI);
        let mode = fallbackToDefault(how.mode, OPEN);

        // draw things
        arc(x, y, w, h, start, stop, mode);
    }

    ellipse(where, how) {
        let x = fallbackToDefault(where.x, width/2);
        let y = fallbackToDefault(where.y, height/2);

        let w = fallbackToDefault(how.w, 30);
        let h = fallbackToDefault(how.h, w);

        ellipse(x, y, w, h);

    }

    circle(where, how) {
        let x = fallbackToDefault(where.x, random(0,width));
        let y = fallbackToDefault(where.y, random(0,height));

        let d = fallbackToDefault(how.d, 30);

        circle(x, y, d);
    }

    image(where, how) {
        let x = fallbackToDefault(where.x, width/2);
        let y = fallbackToDefault(where.y, height/2);
        //path
        let imagePath = fallbackToDefault(how.file, 'assets/devil-face-icon.png')
        //scale
        let dx = fallbackToDefault(how.dx, 50);
        let dy = fallbackToDefault(how.dy, 50);
        loadImage(imagePath, img => {
          image(img, x, y, dx, dy);
        });
        image(devilIcon, x, y, dx, dy);
    }

    // Does not support z-coordinates
    line(where, how) {
        let x1 = fallbackToDefault(where.x1, width/2);
        let y1 = fallbackToDefault(where.y1, height/2);
        let x2 = fallbackToDefault(where.x2, x1+30);
        let y2 = fallbackToDefault(where.y2, y1+30);
//        let st = fallbackToDefault(how.stroke, 50);
  //      let col = fallbackToDefault(how.fill, 'rgba(0,0,255,1)');
        line(x1, y1, x2, y2);
    }

    point(where, how) {
        let x = fallbackToDefault(where.x, width/2);
        let y = fallbackToDefault(where.y, height/2);
        let coordinate_vector = fallbackToDefault(where.coordinate_vector,
            createVector(x, y));

        point(coordinate_vector);
    }

    quad(where, how) {
        let x1 = fallbackToDefault(where.x1, width/2);
        let y1 = fallbackToDefault(where.y1, height/2);
        let x2 = fallbackToDefault(where.x2, x1+30);
        let y2 = fallbackToDefault(where.y2, y1+30);
        let x3 = fallbackToDefault(where.x3, x1+45);
        let y3 = fallbackToDefault(where.y3, y1+45);
        let x4 = fallbackToDefault(where.x4, x1-30);
        let y4 = fallbackToDefault(where.y4, x1-30);

        quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    rect(where, how) {
        let x = fallbackToDefault(where.x, width/2);
        let y = fallbackToDefault(where.y, height/2);

        let w = fallbackToDefault(how.w, 30);
        let h = fallbackToDefault(how.h, w);
        let tl = fallbackToDefault(how.tl, 0);
        let tr = fallbackToDefault(how.tr, tl);
        let br = fallbackToDefault(how.br, tl);
        let bl = fallbackToDefault(how.bl, tl);

        rect(x, y, w, h, tl, tr, br, bl);
    }

    square(where, how) {
        let x = fallbackToDefault(where.x, width/2);
        let y = fallbackToDefault(where.y, height/2);

        let s = fallbackToDefault(how.s, 30);
        let tl = fallbackToDefault(how.tl, 0);
        let tr = fallbackToDefault(how.tr, tl);
        let br = fallbackToDefault(how.br, tl);
        let bl = fallbackToDefault(how.bl, tl);

        square(x, y, s, tl, tr, br, bl);
    }

    triangle(where, how) {
        let x1 = fallbackToDefault(where.x1, width/2);
        let y1 = fallbackToDefault(where.y1, height/2);
        let x2 = fallbackToDefault(where.x2, x1+30);
        let y2 = fallbackToDefault(where.y2, y1+30);
        let x3 = fallbackToDefault(where.x3, x1-30);
        let y3 = fallbackToDefault(where.y3, y1-30);

        triangle(x1, y1, x2, y2, x3, y3);
    }

    // -- Text Functions --
    // Does not currently implement x2 and y2 arguments for text boxing
    // only existing fonts -> perhaps we should load some in?
    text(where, how) {
        push(); // uses additional push/pop to not affect error message formatting
        let x = fallbackToDefault(where.x, width/2);
        let y = fallbackToDefault(where.y, height/2);

        let str = fallbackToDefault(how.str, 'Words, words, words.');
        let tSize = fallbackToDefault(how.textSize, 32);
        let tAlign = fallbackToDefault(how.textAlign, [CENTER, CENTER]);
        let tFont = fallbackToDefault(how.textFont, 'Helvetica');

        textSize(tSize);
        textAlign(...tAlign);
        textFont(tFont);
        text(str, x, y);
        pop();
    }

}
