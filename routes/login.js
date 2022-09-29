const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/userSchema');
const passport = require('passport');

router.post('/', function(req, res) {
  console.log(req.body.username)
  User.findOne({username: req.body.username}, function(err, user){
    console.log("The user is: "+user);
    if (user.admin === true){
      // res.redirect('/admin');
      // admin = true;
      passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect: '/'
      })
    } else{
      passport.authenticate('local',{
        successRedirect: '/edit',
        failureRedirect: '/'
      })
    }
  })
})


module.exports = router;