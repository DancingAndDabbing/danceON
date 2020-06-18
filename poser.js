class Poser {
    constructor(settings) {
        //this.options = settings.options; // defaults
        this.declarations = settings.declarations;
        this.movers = new Movers();
        this.drawFunctions = new DrawFunctions();

        // may need to move these elsewhere
        this.wrappers = {
            'circle': this.circle
        }

        return;
    }

    // parser function that checks for issues at the start?

    execute(pose, poseHistory) {
        let newFuncList = this.declarations(pose, poseHistory);
        //console.log(newFuncList);
        newFuncList.forEach((ff, i) => {

            // dynamic or static
            let type = ff.type || 'static';
            let condition = (typeof ff.condition !== 'undefined') ? ff.condition : true;

            if (returnCondition(condition, pose)) {
                if (type == 'static') {
                    let bind = ff.bind || {};
                    let bindings = splitArgs(bind); // false or list

                    if (bindings) bindings.forEach( b => {
                        this.customDraw({draw: ff.draw, bind: b})
                    });
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

    customDraw(ff) {
        push();
        // if undefined throw certain error;
        //let func = this.wrappers[ff.draw];
        let func = this.drawFunctions[ff.draw];
        let args = ff.bind || {};

        // Check to ensure it is a boolean or a function?

        let fillVal = ff.bind.fill || 255;
        let strokeVal = ff.bind.stroke || 0;

        fill(fillVal);
        stroke(strokeVal);
        // strokeWeight

        func.call(this, args);

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

    circle(args) {
        // set defaults
        let x = args.x || width/2; // 0 won't work!!! make my own func
        let y = args.y || height/2;
        let d = args.d || 30;

        // Call draw functions
        circle(x, y, d);
    }
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

    // check to ensure all array lengths are equal
    let lengthArr = Object.values(lengths);
    if (!(lengthArr.every( (val, i, arr) => val === arr[0] ))) {
        throw `All array lengths in bind aren't equal. ${Object.entries(lengths)}`;
        return false;
    }

    // generate a new list of arguments
    let l = lengthArr[0];
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

function returnCondition(condition, pose) {
    if (typeof(condition) === 'function') return condition(pose);
    else return condition; // More error checking?
}
