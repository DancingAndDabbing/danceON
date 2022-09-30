const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/', function(req, res) {
    if (req.isAuthenticated() && req.user.admin === true){
        console.log('Sucess')
        res.sendFile(path.join(__dirname,'..','/public/dashboard.html'));
    } else {
        res.redirect('/');
    }
});


module.exports = router;