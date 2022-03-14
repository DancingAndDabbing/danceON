class Poser {
    constructor() {
        //this.options = settings.options; // defaults
        this.declarations = {text: '() => []', func: () => []}; // function that gets set in update
        this.movers = new Movers();
        this.drawFunctions = new DrawFunctions();

        this.declarationsHistory = [this.declarations]; // history of working code
        this.codeChanged = true;
        this.usingOldCode = false;

        // We can bind custom events based on where the user has progressed
        // All but the last event only get fired once on state change
        // The last event supports cases when the user has working code and
        // makes a change that is still working code
        this.events = {'starting': [],
                       'editing': [],
                       'debugging': [],
                       'running': [],
                        '*': [],
                        'runningChange': []}; // any state change
        this.state = 'starting';

        return;
    }


    // Shannon's idea - when could be an object, not just a boolean
    execute(pose, poseHistory, tm) {
        let newFuncList = this.declarations.func(pose, poseHistory, tm);
        if (!newFuncList.length) { // empty
            if (!this.usingOldCode) this.callEventListenersIfStateChange('starting');
            return;
        }
        newFuncList.forEach((ff, i) => {

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

        // probably I should return this to run later since it won't
        // draw movers unless a pose has been detected
        this.movers.update();
        let funcArray = this.movers.show();
        funcArray.forEach((ff) => {
            this.customDraw(ff);
        });

        if (!this.usingOldCode) this.callEventListenersIfStateChange('running');
        if (this.codeChanged) {
            this.addWorkingCodeToHistory();
            this.callEventListenersAnyWorkingChange();
            this.codeChanged = false;
        }

    }

    customDraw(bb) {
        push();
        // if undefined throw certain error;
        let func = this.drawFunctions[bb.what];

        // Check to ensure it is a boolean or a function?

        let fillVal = fallbackToDefault(bb.how.fill, 255);
        let strokeWeightVal = fallbackToDefault(bb.how.strokeWeight, 1);

        fill(fillVal);
        strokeWeight(strokeWeightVal);

        if (bb.how.stroke == undefined) noStroke();
        else stroke(bb.how.stroke);

        func.call(this, bb.where, bb.how);

        pop();

    }

    update(d) {
        // call on codemirror change
        let func;

        try { func = new Function(`return ${d}`.trim())(); }
        catch(err) { // syntax errors in code - don't run yet
            if (this.state = 'debugging') this.revertToPreviousCode();
            this.callEventListenersIfStateChange('editing');
            this.usingOldCode = true;
            return false;
        }

        this.declarations = {text: d, func: func};
        this.usingOldCode = false;
        this.codeChanged = true;
    }

    addWorkingCodeToHistory() {
        let workingDeclarations = {};
        workingDeclarations.text = this.declarations.text;
        workingDeclarations.func = this.declarations.func;

        this.declarationsHistory.unshift(workingDeclarations);
        this.declarationsHistory.length = min(this.declarationsHistory.length, 100);
    }

    // Reverts back to the last working code and returns the current state
    revertToPreviousCode() {
        this.declarations = this.declarationsHistory[0];
        return this.declarations;
    }

    clearMovers() { this.movers.clear(); }

    // Event Handling
    addEventListener(eventType, eFunc) {
        this.events[eventType].push(eFunc);
    }

    // Call anytime the user changes code that works
    callEventListenersAnyWorkingChange() {
        this.events['runningChange'].forEach(f => f(this));
    }

    // Calls when state changes - does not call unless the state changes
    callEventListenersIfStateChange(newState) {
        if (this.state == newState) return;
        this.state = newState;
        this.events[this.state].forEach(f => f(this));
        this.events['*'].forEach(f => f(this));
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
