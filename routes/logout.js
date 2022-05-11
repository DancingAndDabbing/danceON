const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const User = require('../models/userSchema');

router.get('/', function(req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;