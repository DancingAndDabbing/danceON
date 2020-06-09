class Poser {
    constructor(settings) {
        //this.options = settings.options; // defaults
        this.declarations = settings.declarations;

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
            push();
            // order by type
            let func = this.wrappers[ff.draw];
            // if undefined throw certain error;
            let args = ff.bind || {};
            //console.log(args);

            let condition = (typeof ff.condition !== 'undefined') ? ff.condition : true;
            // Check to ensure it is a boolean or a function?

            let fillVal = ff.fill || 255;
            let strokeVal = ff.stroke || 0;

            fill(fillVal);
            stroke(strokeVal);

            // Only call on the current pose
            if (returnCondition(condition, pose)) func.call(this, args);


            /*for (let [key, value] of Object.entries(ff)) {
                this.wrappers[key](value);
            }*/
            pop();
        });
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
        // Call draw functions
        let self = this;
        argsList.forEach(a => self.circle(a));

    }
}

function returnCondition(condition, pose) {
    if (typeof(condition) === 'function') return condition(pose);
    else return condition; // More error checking?

}
