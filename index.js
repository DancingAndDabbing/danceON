require('dotenv').config()
const express = require('express');
const mongoService = require("./services/mongoservice").mongoService
const app = express();
const bodyParser = require("body-parser"); // to parse request response body in user friendly way
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
// var morgan = require('morgan')
// app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:false}));
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

const mongoURL = process.env.MONGODB_URI
mongoService.startConnection(mongoURL) // mongoDB connection
const port  = process.env.PORT || 3000;
// Routes

app.use('/', require('./routes/home.js'));
app.use('/edit', require('./routes/edit'));
app.use('/examples', require('./routes/eg'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/logout', require('./routes/logout'));
app.use('/user', require('./routes/user'));
app.use(express.static("public"));
app.listen(port, ()=>{
    console.log(`The server is listening on port ${port}`)
})