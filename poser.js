class Poser {
    constructor(settings) {
        //this.options = settings.options; // defaults
        this.declarations = settings.declarations;
        this.movers = new Movers();
        this.drawFunctions = new DrawFunctions();

        return;
    }

    // parser function that checks for issues at the start?

    execute(pose, poseHistory) {
        let newFuncList = this.declarations(pose, poseHistory);
        //console.log(newFuncList);
        newFuncList.forEach((ff, i) => {
            // look for condition, bind, draw, type
            // dynamic or static
            let type = 'static';
            // fix - if (ff.where != undefined)
            if (ff.where == undefined) type = 'static'
            else if (ff.where.start != undefined) type = 'dynamic';
            let when = fallbackToDefault(ff.when, true);

            if (returnCondition(when, pose)) {
                if (type == 'static') {
                    let where = fallbackToDefault(ff.where, {});
                    let how = fallbackToDefault(ff.how, {});

                    let whereList = splitArgs(where); // false or list
                    let howList = splitArgs(how);

                    // if either is false - there is something wrong

                    let bindings = [];
                    let numberOfBindings;

                    // If either list has only length one - apply its values
                    // to everything
                    if (whereList.length == 1 || howList.length == 1) {
                        numberOfBindings = max(whereList.length, howList.length);
                    }
                    else numberOfBindings = min(whereList.length, howList.length);

                    for (let i = 0; i < numberOfBindings; i++) {
                        let w, h;

                        if (whereList.length == 1) w = whereList[0];
                        else w = whereList[i];

                        if (howList.length == 1) h = howList[0];
                        else h = howList[i];

                        bindings.push({what: ff.what, where: w, how: h});
                    }

                    if (bindings) bindings.forEach( b => this.customDraw(b) );
                }
                // framesToActivate parameter?
                else if (type == 'dynamic') this.movers.add(ff);
            }
        });

        this.movers.update();
        let funcArray = this.movers.show();
        funcArray.forEach((ff) => {
            this.customDraw(ff);
        });
    }

    customDraw(bb) {
        push();
        // if undefined throw certain error;
        let func = this.drawFunctions[bb.what];

        // Check to ensure it is a boolean or a function?

        let fillVal = fallbackToDefault(bb.how.fill, 255);
        let strokeVal = fallbackToDefault(bb.how.stroke, 0);

        fill(fillVal);
        stroke(strokeVal);
        // strokeWeight

        func.call(this, bb.where, bb.how);

        pop();

    }

    update(d) {
        // call on codemirror change
        // I could append d to a history
        let func;

        try { func = new Function(`return ${d}`.trim())(); }
        catch(err) {
            return false;
        }

        this.declarations = func;
        /*if (typeof(Storage) !== "undefined") {
            localStorage.setItem('userDeclarations', d.trim());
        }*/
    }

    clearMovers() { this.movers.clear(); }
}

// For static objects
function splitArgs(args) {
    let lengths = {};
    let argsList = [];

    for (const [key, val] of Object.entries(args)) {
        if (Array.isArray(val)) lengths[key] = val.length;
    }

    // If none of the provided arguments are arrays, we can
    // return here
    if (!Object.keys(lengths).length) return [args];

    let lengthArr = Object.values(lengths);
    // check to ensure all array lengths are equal
    /*if (!(lengthArr.every( (val, i, arr) => val === arr[0] ))) {
        throw `All array lengths in bind aren't equal. ${Object.entries(lengths)}`;
        return false;
    }*/

    // generate a new list of arguments
    // The final list is as long as the shortest list argument
    // This protects errors from cases that use a partial history
    let l = Math.min(...lengthArr);
    for (let i = 0; i < l; i++) {
        let newArgs = {};

        for (const [key, val] of Object.entries(args)) {
            if (Array.isArray(val)) newArgs[key] = val[i];
            else newArgs[key] = val;
        }
        argsList.push(newArgs);
    }

    return argsList;
}

function returnCondition(when, pose) {
    if (typeof(when) === 'function') return when(pose);
    else return when; // More error checking?
}
