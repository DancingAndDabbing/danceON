require('dotenv').config()
const express = require('express');
const mongoService = require("./services/mongoservice").mongoService
const app = express();
const connectEnsureLogin = require('connect-ensure-login');
const bodyParser = require("body-parser"); // to parse request response body in user friendly way
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const passport = require('passport');
const cors = require('cors');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
app.use(session({
    cookie: {
        maxAge: 86400000
    },
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:false}));
app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/userSchema');
passport.use(new LocalStrategy(
    function verify(username, password, next) {
        console.log('auth');
        User.findOne({username: username},'username salt hash', function(err, user) {
            console.log('passport');
            console.log(user)
            if(err) { return  next(err);}
            if(!user) { 
                return next(null, false, {message : 'invalid username'});
            }

            crypto.pbkdf2(password, user.salt, 25000, 512, 'sha256', function(err, hashedPassword) {
                if (err) { return next(err); }
                // console.log(hashedPassword.toString());
                if (user.hash !== hashedPassword.toString('hex')) {
                    return next(null, false, {message : 'invalid password'});
                }
                // if (!crypto.timingSafeEqual(Buffer.from(user.hash), Buffer.from(hashedPassword))) {
                //   return next(null, false, { message: 'Incorrect username or password.' });
                // }
                return next(null, user);
              });
            // if(!user.validPassword(password)) {
            //     return next(null, false, {message: 'invalid password'})
            // }
            // return next(null, user);
        });
    }
));
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// var morgan = require('morgan')
// app.use(morgan('dev'));




const mongoURL = process.env.MONGODB_URI
mongoService.startConnection(mongoURL ? mongoURL :  process.env.DBURL) // mongoDB connection
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