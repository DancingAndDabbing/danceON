class Poser {
    constructor(settings) {
        //this.options = settings.options; // defaults
        this.declarations = settings.declarations;
        this.movers = new Movers();

        // may need to move these elsewhere
        this.wrappers = {
            'circle': this.circle,
            'circles': this.circles
        }

        // object containing functions and proper arguments

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
                if (type == 'static') this.customDraw(ff);
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
        console.log(ff);
        let func = this.wrappers[ff.draw];
        let args = ff.bind || {};
        //console.log(args);

        // Check to ensure it is a boolean or a function?

        let fillVal = ff.bind.fill || 255;
        let strokeVal = ff.bind.stroke || 0;

        fill(fillVal);
        stroke(strokeVal);

        // Only call on the current pose
        // this may actually be called as a list
        func.call(this, args);

        pop();

    }

    update(d) {
        // call on codemirror change
        // I could append d to a history
        let func;

        try {
            func = new Function(`return ${d}`.trim())();
        }
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
        let x = args.x || width/2;
        let y = args.y || height/2;
        let d = args.d || 30;

        // Call draw functions
        circle(x/2, y/2, d); // fix

    }

    circles(args) {
        // set defaults
        console.log(this);
        let xList = args.x || [width/2];
        let yList = args.y || [height/2];
        let d = args.d || 30;
        let argsList = [];

        if (xList.length != yList.length) {
            throw "x and y lengths must be equal.";
            return false;
        }

        // need to call in reverse!
        xList.forEach((item, i) => {
            argsList.push({
                x: item,
                y: yList[i],
                d: d
            })
        });


        // console.log(argsList) - Check how out-of-index ones appear
        // Call draw functions - check if I need the self syntax
        let self = this;
        argsList.forEach(a => self.circle(a));

    }
}

function returnCondition(condition, pose) {
    if (typeof(condition) === 'function') return condition(pose);
    else return condition; // More error checking?

}
