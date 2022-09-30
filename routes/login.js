const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/userSchema');
const passport = require('passport');

router.post('/',passport.authenticate('local'),function(req, res) {
  console.log(req.body.username)
  if (req.user){
    console.log(req.user)
    User.findOne({username: req.body.username}, function(err, user){
      console.log("The user is: "+user.admin);
      console.log("expression: "+user.admin === true)
      if (user.admin === true){
        res.redirect('/admin');
        // admin = true;
        // passport.authenticate('local',{
        //   successRedirect: '/admin',
        //   failureRedirect: '/'
        // })
      } else{
        res.redirect('/edit');
        // passport.authenticate('local',{
        //   successRedirect: '/edit',
        //   failureRedirect: '/'
        // })
      }
    })
  }

})


module.exports = router;