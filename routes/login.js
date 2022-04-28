const express = require('express');
const router = express.Router();
const path = require('path');
router.post('/login', function(req, res) {
    User.findOne({username: req.body.uname}, function(err, user){
        if (err){
            console.log(err)
            res.sendFile(path.join(__dirname, '/public/index.html'));
        } else{
            if (user){
                // if login successful
                if (user.password === req.body.psw){
                    res.sendFile(path.join(__dirname, '/public/edit-index.html'));
                } else{
                    res.sendFile(path.join(__dirname, '/public/index.html'));
                }
            } else{
                console.log("I am the culprit")
                res.sendFile(path.join(__dirname, '/public/index.html'));
            }
        }
    });
});


module.exports = router;