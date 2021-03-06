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
        let x = fallbackToDefault(where.x, random(width));
        let y = fallbackToDefault(where.y, random(height));

        let w = fallbackToDefault(how.w, 30);
        let h = fallbackToDefault(how.h, w);
        let start = fallbackToDefault(how.start, 0);
        let stop = fallbackToDefault(how.stop, HALF_PI);
        let mode = fallbackToDefault(how.mode, OPEN);

        // draw things
        arc(x, y, w, h, start, stop, mode);
    }

    ellipse(where, how) {
        let x = fallbackToDefault(where.x, random(width));
        let y = fallbackToDefault(where.y, random(height));

        let w = fallbackToDefault(how.w, 30);
        let h = fallbackToDefault(how.h, w);

        ellipse(x, y, w, h);

    }

    circle(where, how) {
        let x = fallbackToDefault(where.x, random(width));
        let y = fallbackToDefault(where.y, random(height-40)); // fix hardcoding

        let d = fallbackToDefault(how.d, 30);

        circle(x, y, d);
    }

    // Does not support z-coordinates
    line(where, how) {
        let x1 = fallbackToDefault(where.x1, random(width));
        let y1 = fallbackToDefault(where.y1, random(height-40));
        let x2 = fallbackToDefault(where.x2, x1+random(-40, 40));
        let y2 = fallbackToDefault(where.y2, y1+random(-40, 40));

        // ensure there is a stroke, regardless if unspecified
        stroke(fallbackToDefault(how.stroke, 255));
        line(x1, y1, x2, y2);
    }

    point(where, how) {
        let x = fallbackToDefault(where.x, random(width));
        let y = fallbackToDefault(where.y, random(height-40));
        let coordinate_vector = fallbackToDefault(where.coordinate_vector,
            createVector(x, y));

        // ensure there is a stroke, regardless if unspecified
        stroke(fallbackToDefault(how.stroke, 255));
        point(coordinate_vector);
    }

    quad(where, how) {
        let x1 = fallbackToDefault(where.x1, random(width));
        let y1 = fallbackToDefault(where.y1, random(height-40));
        let x2 = fallbackToDefault(where.x2, x1+random(-40, 40));
        let y2 = fallbackToDefault(where.y2, y1+random(-40, 40));
        let x3 = fallbackToDefault(where.x3, x1+random(-40, 40));
        let y3 = fallbackToDefault(where.y3, y1+random(-40, 40));
        let x4 = fallbackToDefault(where.x4, x1+random(-40, 40));
        let y4 = fallbackToDefault(where.y4, x1+random(-40, 40));

        quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    rect(where, how) {
        let x = fallbackToDefault(where.x, random(width));
        let y = fallbackToDefault(where.y, random(height-40));

        let w = fallbackToDefault(how.w, 30);
        let h = fallbackToDefault(how.h, w);
        let tl = fallbackToDefault(how.tl, 0);
        let tr = fallbackToDefault(how.tr, tl);
        let br = fallbackToDefault(how.br, tl);
        let bl = fallbackToDefault(how.bl, tl);

        rect(x, y, w, h, tl, tr, br, bl);
    }

    square(where, how) {
        let x = fallbackToDefault(where.x, random(width));
        let y = fallbackToDefault(where.y, random(height-40));

        let s = fallbackToDefault(how.s, 30);
        let tl = fallbackToDefault(how.tl, 0);
        let tr = fallbackToDefault(how.tr, tl);
        let br = fallbackToDefault(how.br, tl);
        let bl = fallbackToDefault(how.bl, tl);

        // p5 square has been buggy - it complains when side is passed twice,
        // but does not work otherwise.
        rect(x, y, s, s, tl, tr, br, bl);
    }

    triangle(where, how) {
        let x1 = fallbackToDefault(where.x1, random(width));
        let y1 = fallbackToDefault(where.y1, random(height-40));
        let x2 = fallbackToDefault(where.x2, x1+random(-40, 40));
        let y2 = fallbackToDefault(where.y2, y1+random(-40, 40));
        let x3 = fallbackToDefault(where.x3, x1+random(-40, 40));
        let y3 = fallbackToDefault(where.y3, y1+random(-40, 40));

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
        let tStyle = fallbackToDefault(how.textStyle, NORMAL);
        let tSize = fallbackToDefault(how.textSize, 32);
        let tAlign = fallbackToDefault(how.textAlign, [CENTER, CENTER]);
        let tFont = fallbackToDefault(how.textFont, 'Helvetica');

        textStyle(tStyle);
        textSize(tSize);
        textAlign(...tAlign);
        textFont(tFont);
        text(str, x, y);
        pop();
    }

    // -- Generic Shape Functions --
    shape(where, how) {
        let kind = fallbackToDefault(how.kind, undefined);
        let close = fallbackToDefault(how.close, false);
        if (how.close) close = CLOSE;
        else close = undefined;

        let vertices = generateVertices(where);

        push();
        beginShape(kind);
        vertices.forEach(v => vertex(...v));
        endShape(close);
        pop();

    }

    curve(where, how) {
        let close = fallbackToDefault(how.close, false);
        if (how.close) close = CLOSE;
        else close = undefined;

        let tightness = fallbackToDefault(how.tightness, 0.0);

        let vertices = generateVertices(where);

        push();
        curveTightness(tightness);
        beginShape();
        vertices.forEach(v => curveVertex(...v));
        endShape(close);
        pop();
    }

    // -- Custom Shape Functions --
    heart(where, how) {
        let x = fallbackToDefault(where.x, random(width));
        let y = fallbackToDefault(where.y, random(height));
        let d = fallbackToDefault(how.d, 30);

        let xHeart = heartVals.x.map(v => v*d + x);
        let yHeart = heartVals.y.map(v => v*d + y);


        push();
        beginShape();
        xHeart.forEach((xVal, i) => vertex(xVal, yHeart[i]));
        endShape();
        pop();
    }

}

// Used to create a list of vertices useful in drawing shapes and curves
// {x1:2, x2:2, y1:1.1, y2:2.2, y3:3.3} -> [[1, 1.1], [2, 2.2]]
function generateVertices(where) {
    let vertices = [];

    // Figure out the highest number x/y param
    let numPairs = Math.max(...Object.keys(where)
        .map(k => Number(k.substr(1))) // remove the x or y
        .filter(n => n)); // filter out
    if (numPairs == undefined) numPairs = 0;

    // Generate a list of vertices if and only if both x and y vertices are present
    for (var i = 1; i <= numPairs; i++) {
        if (where[`x${i}`] != undefined && where[`y${i}`] != undefined) {
            vertices.push([where[`x${i}`], where[`y${i}`]])
        }
    }

    if (!vertices.length) {
        vertices.push([random(width), random(height)]);
        vertices.push([random(width), random(height)]);
        vertices.push([random(width), random(height)]);
        vertices.push([random(width), random(height)]);
    }

    return vertices;

}

// Custom data for createing a heart
const heartVals = {
    x: Array.from(new Array(628)).map((v, i) => (1/32) * 16 * Math.pow(Math.sin(i/10), 3)),
    y: Array.from(new Array(628)).map((v, i) =>
        (-1/32)*(13 * Math.cos(i/10) - 5*Math.cos(2*(i/10)) - 2*Math.cos(3*(i/10))- Math.cos(4*(i/10))))
}
