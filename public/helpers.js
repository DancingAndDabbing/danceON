// Useful Functions for developers and users
// This file gets loaded first

// Key points we are using and not using from blaze poze
// Copy from one list to the other if you want to change
// Old indices [0,2,5,7,8,11,12,13,14,15,16,23,24,25,26,27,28]
const keyPointsToUse = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "mouth_left",
  "mouth_right",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot_index",
  "right_foot_index",
];
const keyPointsNotToUse = [
  "left_eye_inner",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye_outer",
];
//Search bar functionality
let exampleDivs;
let searchBar = document.getElementById("search");
searchBar.addEventListener("input", function (event) {
  const value = event.target.value.toLowerCase();
  [...exampleDivs].forEach((div) => {
    const title = div.querySelector(".card-header-title").innerHTML.toLowerCase();
    const description = div.querySelector(".content").innerHTML.toLowerCase();
    // const tags = div.querySelector(".tags").innerHTML.toLowerCase();
    if (title.includes(value) || description.includes(value)) {
      div.style.display = "";
    } else {
      div.style.display = "none";
    }
  }
  );
  
});
// example card template
function createCard(
  title,
  description,
  src,
  id
) {
const htmlContent = `
<div class = "card" style = "width:240px">
  <div class = "card-header">
      <p class="card-header-title">${title}</p>
  </div>
  <div class = "container">
    <a href="/?id=${id}">
      <div class="" style="">
        <div class="image is-3by4" id ="egImage" style ="background-image:url(${src});">
            
        </div>
    </div>
    <div class = "card-content">
        <div class="content">
        ${description} 
        </div>
    </div>
    </a>
  </div>
</div>
`

  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  div.style.flexGrow = "0";
  return div;
}
function renderGrid(rootDiv, data, count) {
  while (count >= 0) {
    let imageURL = data[count].image;
    if (imageURL === undefined){
        imageURL = "/assets/sample.jpg";
    }
    let card = createCard(
      data[count].title,
      data[count].description,
      imageURL,
      data[count]._id
    );    
    card.classList.add("column");
    rootDiv.appendChild(card);
    count--;
  }
}

// load examples in the example modal
async function loadPage() {
  let res = await fetch("/examples/files?lazy=true");

  let data = await res.json();

  let rootDiv = document.getElementById("exampleID");
  // clear the div
  rootDiv.innerHTML = "";
  // create the divs
  let count = data.length - 1;
  renderGrid(rootDiv, data, count);
  
  let res2 = await fetch("/examples/files?lazy=false");
  let data2 = await res2.json();
  count = data2.length - 1;
  renderGrid(rootDiv, data2, count);
  exampleDivs = rootDiv.children;
}

// show modal frame
function showframe(id) {
  let modal = document.getElementById(id);
  modal.classList.add("is-active");
  loadPage();
}

// hide modal frame
function hideframe(id) {
  let modal = parent.document.getElementById(id);
  modal.classList.remove("is-active");
}

// get current snapshot of the defaultCanvas0 canvas
function getCanvasSnapshot() {
  let canvas = document.getElementById("defaultCanvas0");
  let dataURL = canvas.toDataURL("image/png");
  return dataURL;
}
// get the db id from the url if it exists
function getdbid() {
  let params = new URL(window.location.href).searchParams;
  let dbid = params.get("id");
  return dbid;
}
// delete the example
async function onDelete(dbid) {
  await deleteExample(dbid);
  window.location.href = "/examples/list";
}

// save example to db
async function saveExample(data) {

  // call snapshot function
  let snapshot = getCanvasSnapshot();
  console.log(snapshot);


  const url = "/examples";
  var tag = "";
  if (document.getElementById("easy").checked) {
    tag = "easy";
  } else if (document.getElementById("medium").checked) {
    tag = "medium";
  } else {
    tag = "tough";
  }
  let jsonData = {
    code: data,
    desc: document.querySelector("#desc1").value,
    title: document.querySelector("#title1").value,
    tag: tag,
    image: snapshot,
  };
  // console.log("Json Data: ", jsonData);

  //
  fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData), // body data type must match "Content-Type" header
  })
    .catch((err) => {
      console.log("ouput");
      console.log(err);
    });
}
// get an example from the db
async function getExample(dbID) {
  return new Promise((resolve) => {
    let url = "/examples";
    let jsonData = {
      dbID: dbID,
    };
    url = url + "?" + new URLSearchParams(jsonData);
    //
    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      //   body: JSON.stringify(jsonData) // body data type must match "Content-Type" header
    })
      .then(async (res) => {
        const f = await res.json();
        resolve(f);
      })
      .catch((err) => {
        console.log("ouput");
        console.log(err);
        resolve(err);
      });
  });
}
// delete example from db
async function deleteExample(dbID) {
  console.log(dbID);
  let url = "/examples";
  let jsonData = {
    dbID: dbID,
  };
  console.log("Json Data: ", jsonData);
  url = url + "?" + new URLSearchParams(jsonData);
  console.log(url);
  fetch(url, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    //   body: JSON.stringify(jsonData) // body data type must match "Content-Type" header
  })
    .then((res) => {
      console.log("input");
      console.log(res);
    })
    .catch((err) => {
      console.log("ouput");
      console.log(err);
    });
}

function fallbackToDefault(val, def) {
  if (val === undefined) return def;
  else return val;
}

// pose history subset
function pastParts(pHistory, limb, param, start = 0, end = 1, interval = 1) {
  if (pHistory.length == 0) return pose[limb][param];
  return pHistory
    .slice(start, end)
    .filter((p, i) => i % interval === 0)
    .map((p) => p[limb][param]);
}

function pastPose(pHistory, frames = 0) {
  // bad practice!! But prevents a debugging error at the beginning
  if (pHistory.length == 0) return pose;
  else return pHistory[Math.min(pHistory.length - 1, frames)];
}

function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0;
}

// Array Generators
function repeatOne(howMany = 1) {
  return Array.from(new Array(howMany)).map((v, i) => 1);
}

function countTo(howMany = 1) {
  return Array.from(new Array(howMany)).map((v, i) => i);
}

// Internal Helper Functions
function getFrame(options, video) {
  if (!video) return 0;
  return getFrameFromTime(video.time(), options.videoFramerate);
}

function getFrameFromTime(time, vidFramerate) {
  return floor(time * vidFramerate);
}

function getTimeFromFrame(frame, vidFramerate) {
  return frame / vidFramerate; // may need to check against duration
}

function getTotalFrames(options, video) {
  if (!video) return 0;
  return floor(video.duration() * options.videoFramerate);
}

function goForwardOrBackward(options, video, howFar = 1) {
  let currentTime = video.time();
  let newTime = max(
    0,
    min(currentTime + howFar / options.videoFramerate, video.duration())
  );
  video.time(newTime);
}

function resizeVideo(options, video) {
  if (!options.webcam)
    return [
      video.width * options.videoScale,
      video.height * options.videoScale,
    ];
  else return [video.width, video.height];
}

// Need also to support up/down shifting
function scalePositionToVideo(options, position) {
  return {
    x: position.x * options.videoScale,
    y: position.y * options.videoScale,
    // does z need to get scaled
  };
}

// This should not get called if we are in webcam mode
function scalePoseToWindow(options, pose) {
  if (options.webcam) return pose;
  let scaledPose = { keypoints: [], score: pose.score };

  // Very similar code from convertToML5Structure in blazeDetector
  // Should be refactored to speed up performance?
  pose.keypoints.forEach((kp, i) => {
    let sp = scalePositionToVideo(options, kp.position);
    scaledPose.keypoints.push({
      part: kp.part, // function from helpers
      score: kp.score, // posenet used confidence rather than score...
      position: {
        x: sp.x,
        y: sp.y,
        //z: kp.position.z  // does z need to get scaled??
      },
    });
    scaledPose[kp.part] = {
      x: sp.x,
      y: sp.y,
      //z: kp.position.z,
      confidence: kp.score,
    };
  });
  return scaledPose;
}

function muteVideo(options, video, optionalSet) {
  if (optionalSet != undefined) options.muted = optionalSet;
  else options.muted = !options.muted;

  if (options.muted) video.volume(0.0);
  else video.volume(1.0);

  return;
}

function underscore_to_camelCase(old_word) {
  let newWord = old_word.replace(/_([a-z])/g, (m, w) => w.toUpperCase());
  return newWord;
}

async function modelLoader(url) {
  let modelURL = url + "model.json";
  let metadataURL = url + "metadata.json";

  return tmPose.load(modelURL, metadataURL);
}

// Good example around frame 260
function fillInEmptyPoints(pose, poseHistory) {
  //return pose;
  if (poseHistory.length == 0) return pose;
  let filledInPose = { keypoints: [] };
  pose.keypoints.forEach((p) => {
    filledInPose[p.part] = {
      x: sanitize(p.position.x, poseHistory[0][p.part].x),
      y: sanitize(p.position.y, poseHistory[0][p.part].y),
      confidence: p.score,
    };
    filledInPose.keypoints.push({
      position: {
        x: filledInPose[p.part].x,
        y: filledInPose[p.part].y,
      },
      part: p.part,
      score: p.score,
    });
  });
  return filledInPose;
}

function sanitize(val, def) {
  if (isNaN(val) || val == 0) return def;
  else return val;
}
