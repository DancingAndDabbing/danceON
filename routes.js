const express = require('express');

const router = express.Router();

const elastic = require('elasticsearch');

const bodyParser = require('body-parser').json();

const elasticClient = elastic.Client({
    host: 'localhost:9200'
})

// edit (permission), delete(permission), search, create (permission)

let code = [
    //code 1
    {
        // chains
        "what": 'quad',
        "where": {
          "x1": "0",
          "y1": "height",
          "x2": "pose.rightWrist.x",
          "y2": "pose.rightWrist.y",
          "x3": "pose.leftWrist.x",
          "y3": "pose.leftWrist.y",
          "x4": "width",
          "y4": "height",
        },
        "how": {
            "stroke": "color(128,128,128,255)",
            "strokeWeight": "5",
            "fill": "color(255,255,255,0)",
        }
    }, 
    //code 2
    [
        {
            "what": 'line',
            "where": {
                "x1": "width/2",
                "y1": "height/2",
                "x2": "width/2+100*cos(5*video.time())",
                "y2": "height/2+100*sin(5*video.time())",
            },
            "how": {
                "strokeWeight": "5",
            }
        },
        {
            "what": 'line',
            "where": {
                "x1": "width/2",
                "y1": "height/2",
                "x2": "width/2+50*cos(5*video.time()/12)",
                "y2": "height/2+50*sin(5*video.time()/12)",
            },
            "how": {
                "strokeWeight": "5",
            }
        }
    ],
];

router.use((req,res,next) =>{
    elasticClient.index({
        index:'logs',
        body: {
            url: req.url,
            method: req.method
        }
    })
    .then(res=> {
        console.log('Logs indexed')
    })
    .catch (err => {
        console.log(err)
    })
    next();
});

module.exports = router;
