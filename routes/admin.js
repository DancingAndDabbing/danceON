const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/', function(req, res) {
    // console.log(req.body.uname)
    // console.log(req.body.psw)
    if (req.user){
        console.log('Sucess')
        res.sendFile(path.join(__dirname,'..','/public/admin.html'));
    } else {
        res.redirect('/');
    }
});


module.exports = router;