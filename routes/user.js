const express = require('express');
const http = require('http');
const User = require('../models/userSchema');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()){
        User.find({}, function(err, users){
            if (err){
                console.log(err);
            } else {
                res.send(users);
            }
        });
    }
});

module.exports = router;