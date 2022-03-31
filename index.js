const express = require('express');
const mongoService = require("./services/mongoservice").mongoService
const app = express();
const routes = require('./routes');
const path = require('path');
const bodyParser = require("body-parser"); // to parse request response body in user friendly way
const mongoose = require('mongoose'); // Create and connect DB
const { MongoClient } = require('mongodb');
const cors = require('cors');
const { title } = require('process');
const ObjectId = mongoose.Types.ObjectId;
app.use(cors());;
app.use('./api/v1',routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(express.static("public2"));
const dbUrl = "mongodb://127.0.0.1:27017/danceonDB"
let port  = process.env.PORT || 3000;
// const client = new MongoClient(dbUrl,{ useNewUrlParser: true})
app.set('view engine', 'ejs');
const exampleSchema = new mongoose.Schema({
    authorName: String,
    createDate: String,
    description: String,
    title: String,
    tags: String,
    examples: String
});

const Example = mongoose.model("Example",exampleSchema);


// GET /
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// GET /examples
var examplesLen = 0
app.get('/examples/list', function(req, res) {
    res.sendFile(path.join(__dirname, '/public2/index.html'));
    // Example.find(function(err,examples){
    //      if (err){
    //          console.log(err)
    //      } else{
    //          res.sendFile(path.join(__dirname, '/public2/index.html'));
    //         //  res.render('index', {examples : examples.length, exampleList:examples})
    //         //  console.log(examples.length)
    //      }
    // });
});
app.get('/examples/files', function(req, res) {
    Example.find(function(err,examples){
         if (err){
             console.log(err)
         } else{
             res.send(examples);
         }
    });
});

// POST /examples
app.post('/examples', async function (req, res) {


    var data = await Example.create({
            authorName: "Naren", 
            createDate: "03/03/2022", 
            description:req.body.desc,
            // description: "Sample test",
            // title: "Sample title test",
            title:req.body.title,
            tags:req.body.tag,
            examples: req.body.code
    });
    console.log(data)
    res.status(200).send(data);
});
app.get('/examples', function(req, res) {
    Example.findOne({_id: ObjectId(req.query.dbID)},function(err,example){
        if (err){
            console.log(err)
        } else{
            res.send(example)
        }
   });
})

app.delete('/examples', function(req, res) {
    console.log(req.query.dbID)
    Example.deleteOne({_id: ObjectId(req.query.dbID)},function(err,example){
        if (err){
            console.log(err)
        } else{
            res.send('deleted')
        }
   });
})


app.listen(port, ()=>{
    console.log(`The server is listening on port ${port}`)
    const mongoURL = 'mongodb://127.0.0.1:27017/danceonDB'
    mongoService.startConnection(mongoURL) // mongoDB connection
})


[
    {
        authorName: "Naren",
        createDate: "03/03/2022",
        description: "Sample description 1",
        title: "Sample title 1",
        tags: "tough",
        examples: `(pose, poseHistory) => {
            let shoulderScale = 40;
            return [
              {
                  // this is the wing
                  what: 'rect',
                  where: {
                      x: width/2,
                      y: 0
                  },
                  how: {
                      h: height,
                      w: width/2,
                      fill: "black"
                  }
              },
                  {
                  // this is the "active space"
                  what: 'rect',
                  where: {
                      x: 0,
                      y: 0
                  },
                  how: {
                      h: height,
                      w: width/2,
                      fill: color(
                      map(pose.leftShoulder.x-pose.rightShoulder.x,
                      0,
                      shoulderScale,
                      0,
                      255), // red
                      map(pose.leftShoulder.x-pose.rightShoulder.x,
                      0,
                      shoulderScale,
                      255,
                      0), // green
                      0, // blue
                      100)
                  }
              },
            ];
          }`
    },
    
    {
        authorName: "Naren",
        createDate: "03/03/2022",
        description: "Sample description 2",
        title: "Sample title 2",
        tags: "easy",
        examples: `(pose, poseHistory) => {
            let delay = 30;
            
            return [
            {
                what: 'line',
                where: {
                    // get the pose from 'delay' frames ago
                    x1: [pastPose(poseHistory, delay).leftWrist.x,
                            pastPose(poseHistory, delay).rightWrist.x],
                    y1: [pastPose(poseHistory, delay).leftWrist.y,
                            pastPose(poseHistory, delay).rightWrist.y],
                    x2: [pastPose(poseHistory, delay).leftElbow.x,
                            pastPose(poseHistory, delay).rightElbow.x],
                    y2: [pastPose(poseHistory, delay).leftElbow.y,
                            pastPose(poseHistory, delay).rightElbow.y]
                },
                how: {
                    strokeWeight: 4,
                    stroke: ["hotpink", "orange"]
                }
            },
           {
                what: 'line',
                where: {
                    // get the pose from 30 frames or 1 second ago
                    x1: [pose.leftWrist.x,pose.rightWrist.x],
                    y1: [pose.leftWrist.y,pose.rightWrist.y],
                    x2: [pose.leftElbow.x,pose.rightElbow.x],
                    y2: [pose.leftElbow.y,pose.rightElbow.y]
                },
                how: {
                    strokeWeight: 4,
                    stroke: ["lime", "aqua"]
                }
        },
         //   {
         //       what: 'line',
         //       where: {
         //           // look to the last 30 frames
         //           x1: pastParts(poseHistory, 'leftWrist', 'x', 0, delay, 1),
         //           y1: pastParts(poseHistory, 'leftWrist', 'y', 0, delay, 1),
         //           x2: pastParts(poseHistory, 'leftElbow', 'x', 0, delay, 1),
         //           y2: pastParts(poseHistory, 'leftElbow', 'y', 0, delay, 1),
         //       },
          //      how: {
         //           stroke: "tan",
         //       }
         //   },
        ];
        }`
    },
    {
        authorName: "Naren",
        createDate: "03/03/2022",
        description: "Sample description 3",
        title: "Sample title 3",
        tags: "medium",
        examples: "sample code"
    },
    
    {
        authorName: "Naren",
        createDate: "03/03/2022",
        description: "Sample description 4",
        title: "Sample title 4",
        tags: "tough",
        examples: `(pose) => [
            {
                
                what:  'triangle',
                   when: true, 
                   //pose.rightWrist.y < pose.rightShoulder.y,
                    where: {
                        start: {
                            x1: random (-100, 100),
                            y1: height - random(-40,40),
                            x2: random (10, 75),
                            y2: height - random(0, 150),
                            x3: random (100, 150),
                            y3: height - random(-40,40),
                           velocityX: 0,
                           velocityY: -1.0
                       },
                        accelerationX: 0,
                        accelerationY: random(-0.02, -0.08)
                    },
            
                    how: {
                      fill:  [{frame: 0, value: color(180, 10, 0, 55)},
                     {frame: 30, value: color(241, 214, 59, 200)},
                     {frame: 55, value: color(220, 0, 0, 0)}],
                    }   
                }, // flames
                
              {
                    what: 'triangle',
                   when: true, 
                   //pose.rightWrist.y < pose.rightShoulder.y,
                    where: {
                        start: {
                            x1: random (width/2, 300),
                            y1: height - random(-40,40),
                            x2: random (100, width+200),
                            y2: height - random(-40, 40),
                            x3: random (width/2, width),
                            y3: height - random(0,150),
                           velocityX: 0,
                           velocityY: -1.0
                       },
                        accelerationX: 0,
                        accelerationY: random(-0.02, -0.08)
                    },
                    how: {
                      fill:  [{frame: 0, value: color(200, 30, 0, 255)},
                     {frame: 30, value: color(241, 214, 59, 150)},
                     {frame: 55, value: color(255, 100, 0, 0)}],
                    }    
                }, // flames
              
             ];`
    }
]


// Send postrequest to the db

// Example.create(
//     {
//         authorName: "Naren",
//         createDate: "03/03/2022",
//         description: "Sample description 5",
//         title: "Sample title 5",
//         tags: "tough",
//         examples: `(pose) => 
//         {
//             let y = random(100, 200); 
//             let x = 0; 
            
//         return [
//         {
//                 what: 'quad',
//                 where: {
//                     start: {
//                         x1: x,
//                         y1: y,
//                         x2: x+10,
//                         y2: y+2, 
//                         x3: x,
//                         y3: y+10,
//                         x4: x+7,
//                         y4: y+5,
//                         velocityX: 2,
//                         velocityY: -10
//                     },
//                     accelerationX: 0.5,
//                     accelerationY: 0.5
//                 }
//             },    
//             {
//                 what: 'quad',
//                 where: {
//                     start: {
//                         x1: (width-x),
//                         y1: (height-y),
//                         x2: (width-x)-10,
//                         y2: (height-y)-8, 
//                         x3: (width-x),
//                         y3: (height-y)-10,
//                         x4: (width-x)-7,
//                         y4: (height-y)-5,
//                         velocityX: -2,
//                         velocityY: +10
//                     },
//                     accelerationX: -0.5,
//                     accelerationY: -0.5
//                 }
//             },   
//         ]
//         }`
//     }
    
// )
