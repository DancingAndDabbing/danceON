const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/', function(req, res) {
    console.log(req.body)
    if (req.user){
        res.sendFile(path.join(__dirname,'..','/public/edit-index.html'));
    } else {
        res.sendFile(path.join(__dirname,'..', '/public/index.html'));
    }
});
module.exports = router;