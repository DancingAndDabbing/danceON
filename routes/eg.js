const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose'); // Create and connect DB
const ObjectId = mongoose.Types.ObjectId;
// const exampleSchema = new mongoose.Schema({
//     authorName: String,
//     createDate: String,
//     description: String,
//     title: String,
//     tags: String,
//     examples: String
// });

const Example = require('../models/exampleModel');

router.post('/', async function (req, res) {
    // console.log(req.user);
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let time = date_ob.getUTCHours() + "-"+date_ob.getUTCMinutes()+"-"+date_ob.getUTCMilliseconds()
    let createDate =  year + "-" + month + "-" + date+"T"+time;
    // console.log(req.body.image);
    var data = await Example.create({
            authorName:req.user.username, 
            createDate: createDate, 
            description:req.body.desc,
            title:req.body.title,
            tags:req.body.tag,
            examples: req.body.code,
            image: req.body.image
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
    Example.deleteOne({_id: ObjectId(req.query.dbID), authorName:req.user.username},function(err,example){
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