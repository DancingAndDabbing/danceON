const express = require('express');
const http = require('http');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()){
        var json = {"status":'true'}
        const data = JSON.stringify(json)
        res.send(data)
    } else {
        var json = {status:'false'}
        const data =  JSON.stringify(json)
        res.send(data)
    }
});

module.exports = router;