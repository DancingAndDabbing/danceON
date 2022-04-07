const express = require('express');
const mongoService = require("./services/mongoservice").mongoService
const app = express();
const path = require('path');
const bodyParser = require("body-parser"); // to parse request response body in user friendly way
const mongoose = require('mongoose'); // Create and connect DB
const { MongoClient } = require('mongodb');
const cors = require('cors');
const { title } = require('process');
const ObjectId = mongoose.Types.ObjectId;
app.use(cors());;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));

const dbUrl = "mongodb://127.0.0.1:27017/danceonDB"
let port  = process.env.PORT || 3000;

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


// GET /examples/list
app.get('/examples/list', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/examples.html'));
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
            title:req.body.title,
            tags:req.body.tag,
            examples: req.body.code
    });
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