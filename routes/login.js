const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/userSchema');
const passport = require('passport');
// router.post('/', async function(req, res) {
//     console.log(req.body.uname);
//     User.findOne({username: req.body.uname}, function(err, user){
//         if (err){
//             console.log(err)
//             res.sendFile(path.join(__dirname,'..', '/public/index.html'));
//         } else{
//             console.log(user)
//             if (user.password === req.body.pass){
//                 // if login successful
//                 req.login(user, function(err){
//                     if (err){
//                         console.log(err)
//                         res.redirect('/');
//                     } else{
//                         res.redirect('/edit');
//                     }
//                 })
//             } else{
//                 res.redirect('/');
//                 // res.sendFile(path.join(__dirname,'..', '/public/index.html'));
//             }
//         }
//     });
// });
router.post('/',async function(req, res,){
    console.log(req.body.username);
    passport.authenticate('local', function (err, user, info) {
        console.log(err);
        console.log(info);
        if (err) {
            return res.status(500).json({
                err: err
                });
                }
        if (!user) {
            return res.status(404).json({err: info});
        }
        req.login(user, function(err){
            if (err){
                console.log(err)
                res.redirect('/');
            } else{
                res.redirect('/edit');
            }
        })
    });
})



module.exports = router;