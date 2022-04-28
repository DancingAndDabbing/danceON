const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose'); // Create and connect DB
const ObjectId = mongoose.Types.ObjectId;
const exampleSchema = new mongoose.Schema({
    authorName: String,
    createDate: String,
    description: String,
    title: String,
    tags: String,
    examples: String
});

const Example = mongoose.model("Example",exampleSchema);

router.post('/', async function (req, res) {
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
// GET /examples/:id
router.get('/', function(req, res) {
    Example.findOne({_id: ObjectId(req.query.dbID)},function(err,example){
        if (err){
            console.log(err)
        } else{
            res.send(example)
        }
   });
})

router.delete('/', function(req, res) {
    Example.deleteOne({_id: ObjectId(req.query.dbID)},function(err,example){
        if (err){
            console.log(err)
        } else{
            res.send('deleted')
        }
   });
})

router.get('/list', function(req, res) {
    res.sendFile(path.join(__dirname,'..', '/public/examples.html'));
});
router.get('/files', function(req, res) {
    Example.find(function(err,examples){
         if (err){
             console.log(err)
         } else{
             res.send(examples);
         }
    });
});
module.exports = router;