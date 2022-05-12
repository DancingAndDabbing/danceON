const express = require('express');
const router = express.Router();
const path = require('path');
// const passport = require('passport');
const User = require('../models/userSchema');


router.post('/', async function(req, res) {
    console.log(req.body.uname);
    User.register({username: req.body.uname}, req.body.psw, function(err, user){
        if (err){
            console.log(err)
            console.log("error happened")
            res.sendFile(path.join(__dirname,'..', '/public/index.html'));
        } else{
            const authenticate = User.authenticate();
            authenticate(req.body.uname, req.body.psw, function(err, result){
                if (err){
                    console.log(err)
                    console.log("here lies error")
                    res.sendFile(path.join(__dirname,'..', '/public/index.html'));
                } else{
                    req.login(result, function(err){
                        if (err){
                            console.log(err)
                            console.log("I am the culprit")
                            res.sendFile(path.join(__dirname,'..', '/public/index.html'));
                        } else{
                            res.redirect('/edit');
                        }
                    })
                }
            })
        }
    })
})
module.exports = router;