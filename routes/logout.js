const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const User = require('../models/userSchema');

router.get('/', function(req, res) {
    res.send("You are logged out")
})

module.exports = router;