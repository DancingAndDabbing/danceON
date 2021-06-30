// P5 Pose Editor
// STEM FROM DANCE | NYU - 2020

// BUG - Webcam turns off, but I can't deactivate the light
// https://stackoverflow.com/questions/11642926/stop-close-webcam-which-is-opened-by-navigator-getusermedia

// ----- Global Options -----
let options = {
    // Assume that if the user is using the webcam, we will run Posenet
    // Otherwise, we will wait for an uploaded JSON file
    webcam: false, // true or false
    posenetLoaded: false,
    finishedAnalyzing: false,
    finishedSetup: false,

    // video options
    videoLoaded: false,
    videoToggle: 'videoToggle',
    webcamToggle: 'webcamToggle',
    videoUpload: 'videoUpload',
    poseUpload: 'poseUpload',
    videoLocation: 'assets/SFD_Nov.mp4',
    videoPoses: 'assets/SFD_Nov.json',
    videoPredictions: 'assets/SFD_Nov_predictions.json',
    videoFramerate: 30, // For Yoav - always 30?
    videoWidth: 640,
    videoHeight: 360,
    videoScale: undefined,
    videoVerticalShift: 0,
    videoHorizontalShift: 0,
    playing: false, // true or false
    muted: false,
    recording: false, // true or false
    audioStream: undefined, // used for recording
    // frameNum?

    editor: editor,

    playbarHeight: 40,

    mlInput: 'mlInput',
    modelURL: 'https://teachablemachine.withgoogle.com/models/Lp16aC0Y2/',

    // UI Overlay toggles
    toggles: ['mousePosition', 'skeleton', 'ml', 'teachableMachineOn'],
    mousePosition: false,
    skeleton: false,
    ml: false,
    teachableMachineOn: true,
}


// ----- Global Variables -----
let canvas;

let pose; // Current pose
let poseHistory = []; // Recent history of poses

let tmClassifier; // Teachable Machine classifier
let prediction; // Current prediction

let video; // Video source - either preloaded or webcam
let recorder; // For storing recording after button pressed
let playBar; // Controls shown during video mode

let poser; // Code API - This will all parsing/running of user code

let cacher; // Used for saving code to local cache

let preloadedPredictions; // temporary solution to prevent load times on default video

// -----                                       -----

// ----- Main P5 Functions -----
function preload() {
    tmClassifier = new BlazeDetector();
    //tmClassifier.loadJSON(options);
    // Temporary solution to prevent classifier loading with
    // embedded video
    //preloadedPredictions =loadJSON(options.videoPredictions);
    tmClassifier.loadModel(options, function() {
        tmClassifier.predictions = preloadedPredictions.predictions;
        tmClassifier.gotAllFrames = true;
    });

}

function setup() {
    // p5 Canvas Setup
    canvas = createCanvas(options.videoWidth,
        options.videoHeight + options.playbarHeight);
    canvas.parent('p5Canvas');
    noCursor();
    background(245);
    loadingText('video and classifier');

    // Dom Elements
    bulmaQuickview.attach();
    playBar = new PlayBar(options);
    document.getElementById('fontSizeSelector').addEventListener('change', function(e) {
        let options =  [ ...e.target.children ];
        let selectedSize = options.filter(o => o.selected)[0].value;
        changeEditorFontSize(selectedSize);
    })

    // Check the cache and set starting code if it exists
    cacher = new Cacher();
    let storedDeclarations = cacher.retrieveDeclarations();
    if (storedDeclarations) declarations.setValue(storedDeclarations);

    // Pose setup - add event listeners based on user editing
    poser = new Poser();
    poser.addEventListener('*', (p) => setSteps(p.state));
    ['starting', 'running'].forEach(s => poser.addEventListener(s, (p) => disableRevertButton()));
    ['editing', 'debugging'].forEach(s => poser.addEventListener(s, (p) => disableRevertButton(false)));
    poser.addEventListener('runningChange', p => cacher.saveDeclarations(p.declarations.text));
    //poser.addEventListener('*', (p) => console.log(p.state));

    // Video setup
    video = startVideo(options);
    video.onended((elt) => stopRecording(elt, options));
    tmClassifier.onComplete(() => toggleAnalyzingNotifier(false)); // Callback

    // Toggle between Webcam and Video
    select(`#${options.videoToggle}`).mouseClicked(() => {
        if (!options.webcam) return;
        options.webcam = false;
        handleVideoToggle(() => {
            if (!tmClassifier.gotAllFrames) {
                toggleAnalyzingNotifier(true, options);
            }
        });
    });

    select(`#${options.webcamToggle}`).mouseClicked(() => {
        if (options.webcam) return;
        options.webcam = true;
        handleWebCamToggle();
    });

    //
    document.getElementById('recordingPromptStart').addEventListener('click', function() {
        startRecording(options, video);
    });

    // This will upload the file, attempt to switch to the video source, and
    // clear out the old classifier if successful
    document.getElementById(options.videoUpload).addEventListener('change', (ev) => {
        // In case there are problems, we'll revert back
        //if (!finishedSetup) return;
        if (!(ev.target.files && ev.target.files[0]))  {
            alert("No video file found. We'll keep using the old one.");
            return;
        }

        options.videoLoaded = false;
        let oldVideoLocation = options.videoLocation;
        options.videoLocation = URL.createObjectURL(ev.target.files[0]);
        let newFileURL = ev.target.value;

        activateVideoButton();
        options.webcam = false;
        playPauseVideo(false);

        try {
            handleVideoToggle(() => { // callback after video loads
                toggleAnalyzingNotifier(true, options);
                tmClassifier.resetForNewVideo();
                options.videoLoaded = true;
                updateVideoFileText(newFileURL);
                updatePoseFileText("", false);
                playPauseVideo(true);
            });

        } catch (err) {
            console.log(err);
            options.videoLocation = oldVideoLocation;
            handleVideoToggle(() => {
                if (!tmClassifier.gotAllFrames) {
                    toggleAnalyzingNotifier(true, options);
                    playPauseVideo(true);
                }
                options.videoLoaded = true;
            });
            alert("Something wrong with that video file. We'll keep using the old one.")
        }
    });

    // Pose JSON File upload
    document.getElementById(options.poseUpload).addEventListener('change', (ev) => {
        if (ev.target.value == '') return;
        if (!(ev.target.files && ev.target.files[0]))  {
            alert("No pose file found. We'll keep using the old one.");
            return;
        }

        let newFileURL = ev.target.value;
        let oldPoseLocation = options.videoPoses;
        options.videoPoses = URL.createObjectURL(ev.target.files[0]);

        tmClassifier.loadJSON(options,
            (() => updatePoseFileText(newFileURL)), // Success handler
            (() => options.videoPoses = oldPoseLocation) // Fail handler
        );
    });

    // Teachable Machine Link paste
    document.getElementById(options.mlInput).addEventListener('input', (ev) => {
        let txt = ev.target.value;

        // Error cases
        if (txt == '') return changeTMLinkInput('empty'); // dom manipulation
        if (!txt.startsWith("https://teachablemachine.withgoogle.com/models/")) return changeTMLinkInput('error');

        // We might have good link
        changeTMLinkInput('loading');
        let oldModelURL = options.modelURL;
        options.modelURL = txt;
        tmClassifier.loadModel(options,
            (() => changeTMLinkInput('success')), // success callback
            (() => {
                changeTMLinkInput('error');
                options.modelURL = oldModelURL;
            })
        );
    });

    // Teachable Machine Toggle Button (enable or disable the GUI notifier)
    document.getElementById('teachableMachineOn').addEventListener('change', e => {
        if (e.target.checked && !tmClassifier.gotAllFrames) toggleAnalyzingNotifier(true, options);
        else toggleAnalyzingNotifier(false);
    });

    document.getElementById('revertButton').addEventListener('click', () => {
        let currentCode = poser.revertToPreviousCode();
        fromSetValueCall = true;
        declarations.setValue(currentCode.text);
    });

    // Code upload/download
    document.getElementById('declarationsDownload')
    .addEventListener('click', () => downloadDeclarations());

    document.getElementById('declarationsUpload')
    .addEventListener('change', (ev) => {
        if (ev.target.value == '') return;
        uploadDeclarations(ev.target.files[0]);
    });


    // Editor/Poser API (declarations is an editor)
    poser.update(declarations.getValue());
    declarations.on('change', function(e) {
        let val = declarations.getValue();
        parseAndShowErrors(val);
        if (val == '' && !fromSetValueCall && (declarations.curOp.command.name != 'paste')) {
            declarations.setValue(STARTING_CODE);
            return;
        };
        poser.update(val);
        fromSetValueCall = false;
    });

    // Mouse Click Events on Canvas - Disabled if recording
    canvas.mouseClicked(() => {
        // Play button click event - toggles the video and also toggles the
        // 'analyzing' notifier if it hasn't finished yet
        if ((!options.webcam) && playBar.overPlayButton()) {
            playPauseVideo(undefined, undefined, function() {
                if (!tmClassifier.gotAllFrames) toggleAnalyzingNotifier(true, options);
            });
        }
        else if ((!options.webcam) && playBar.overBar()) changeFrame(playBar.getFrame());
        else if ((!options.webcam) && playBar.overRecordButton()) openRecordingPrompt();
        else if ((!options.webcam) && playBar.overMuteButton()) muteVideo(options, video);
        else { console.log(tmClassifier); }
        // other ideas include getting the coordinates
        // and getting the skeleton part
        return false; // prevent default
    });

    // Connect toggles in GUI to options
    options.toggles.forEach(t => {
        select(`#${t}`).changed(() => {
            options[t] = select(`#${t}`).checked();
        })
    });
}

function draw() {
    background(245);
    strokeWeight(1); // set unless it gets overridden (happened once?)

    // Things still loading - don't try to draw or calculate anything
    if (!tmClassifier.loaded) {
        push();
        stroke(200);
        strokeWeight(2);
        for (i = 0; i < 20; i++) {line(random(width), random(height), random(width), random(height));}
        pop();
        loadingText('classifier');
        return false;
    }
    if (!options.webcam && !options.videoLoaded) {
        loadingText('video');
        playBar.draw();
        cursorIcon();
        return false;
    }

    // Draw the current frame of the video at the proper size
    image(video, 0, 0, ...resizeVideo(options, video));

    // Detection and prediction for Video Mode (nonblocking)
    if (!options.webcam) {
        let frameNum = getFrame(options, video);
        let totalFrames = getTotalFrames(options, video);
        tmClassifier.predictForVideo(options, canvas, video, frameNum, setPoseInWebCamMode);
        //console.log(pp); // Returning undefined
        // One or both of these may return undefined if it has not been
        // calculated yet
        //pose = pp.pose;
        //prediction = pp.prediction;

        playBar.update({playing: options.playing, frameNum: frameNum, totalFrames: totalFrames});
    }

    // Detection and prediction for Webcam
    // Sets values for pose/prediction when available - may lag behind image
    else { tmClassifier.predictForWebCam(options, video, setPoseInWebCamMode);}

    // Draw on top of the image using pose and prediction
    if (pose) {
        let scaledPoseUnfilled = scalePoseToWindow(options, pose);
        let scaledPose = fillInEmptyPoints(scaledPoseUnfilled, poseHistory);

        // Only add to history if the video is not paused, or we are
        // using the webcam
        if (options.playing || options.webcam) {
            poseHistory.unshift(scaledPose);
            if (poseHistory.length >= 1000) poseHistory.pop();
        }

        try {
            push();
            poser.execute(scaledPose, poseHistory, prediction); // check if any issues occur on return
        } catch (e) {
            errorText(e);
            poser.callEventListenersIfStateChange('debugging');
        } finally { pop(); }

        if (options.skeleton && !options.recording) skeleton(options, scaledPose);
    }

    // Draw movers here - they should keep going even if the current frame
    // does not have a pose

    if (poser.state == 'editing' && !options.recording) warningText();

    playBar.draw();

    // Display cursor, but not during record to prevent it from appearing
    if (!options.recording) {
        if (prediction && options.ml) mlText(options, prediction);
        cursorIcon();
        if (options.mousePosition) cursorPosition(options);
    }
}

// ----- Key Press Events -----
function keyPressed() {
    let settingsOverlay = document.getElementById('settings').classList.contains("is-active");
    if (settingsOverlay || editor.isFocused() || options.webcam || options.recording || !options.videoLoaded) return;

    if (keyCode == 32) playPauseVideo(); // spacebar
    if (keyCode == RIGHT_ARROW) goForwardOrBackward(options, video, 1);
    if (keyCode == LEFT_ARROW) goForwardOrBackward(options, video, -1);
    if (keyCode == UP_ARROW) goForwardOrBackward(options, video, 10);
    if (keyCode == DOWN_ARROW) goForwardOrBackward(options, video, -10);

    return false;
}


// ----- Other Functions -----

// Due to asyncronous issues, I directly set the pose and prediction
// variables here rather than waiting for them to return
function setPoseInWebCamMode(pp) {
    pose = pp.pose;
    prediction = pp.prediction;
}

function handleVideoToggle(callback=undefined) {
    poseHistory = [];
    poser.clearMovers();

    // Attempts at disabling webcam light
    video.pause();
    video.src = "";
    video.srcObject = null;

    navigator.getUserMedia({audio: true, video: true},
        (stream => stream.getTracks().forEach( (track) => track.stop())),
        (error => console.log('getUserMedia() error', error))
    );

    // Start video this time with video source
    video = startVideo(options, callback);
    video.onended((elt) => stopRecording(elt, options));
}

function handleWebCamToggle(callback=undefined) {
    options.playing = false;
    options.videoLoaded = false; // make this consistent with video source

    poseHistory = [];
    poser.clearMovers();

    video._onended = undefined;

    // Start video - this time with webcam
    video = startVideo(options, () => {
        toggleAnalyzingNotifier(false);
        options.videoLoaded = true;
        if (callback != undefined) callback();
    });
}

// Play or Pause the video - if a value is passed, do that
// If a value is not passed it will check the state of the media object
function playPauseVideo(optionalValue, disableLoop, playCallback, pauseCallback) {
    if (optionalValue == undefined) {
        if (video.elt.paused || video.elt.ended) options.playing = true;
        else options.playing = false;
    }
    else options.playing = !!optionalValue;

    if (options.playing && disableLoop) {
        video.elt.loop = false;
        video.play();
    }
    else if (options.playing) {
        video.elt.muted = false;
        video.elt.playsiInline = true;
        video.loop();
        if (playCallback != undefined) playCallback();
    }
    else {
        if (pauseCallback != undefined) pauseCallback();
        video.pause();
    }
}

function startRecording(options, video) {
    if (options.webcam) return; // don't support webcam recording
    poser.clearMovers(); // clear movers
    poseHistory = []; // clear poseHistory

    muteVideo(options, video, false); // unmute if muted

    // Resize the canvas so that the play bar disappears
    // (This would otherwise show up in the video!)
    resizeCanvas(options.videoWidth, options.videoHeight);
    toggleRecordingNotifier(true); // Recording indicator

    // Start the video from the beginning and ensure that it does not loop
    // (Recording stops when the video ends - looping would prevent callback)
    video.stop();
    playPauseVideo(true, true);

    // Start recording the canvas
    recorder = record(options, recorder, canvas);

    // When recording is true, all the overlays and the cursor will disappear
    // Click events on canvas are also disabled
    options.recording = true;
}

function stopRecording(elt, options) {
    if (!options.recording) return;

    if (recorder) recorder.stop();
    options.recording = false;
    playPauseVideo(false);

    // Remove the notification and display the playbar again
    toggleRecordingNotifier(false);
    resizeCanvas(options.videoWidth, options.videoHeight + options.playbarHeight);
}

// Scrubbing function - doesn't seem to work in local host - will set to 0
function changeFrame(frameNum) {
    video.time(getTimeFromFrame(frameNum, options.videoFramerate));
}

// Secret
let danceON = {
    what: 'text',
    how: {
        textSize: 14,
        fill: 255,
        stroke: 255,
        str: 'Built by Willie Payne while listening to Phoebe Bridgers and procrastinating an essay.'
    }
}
