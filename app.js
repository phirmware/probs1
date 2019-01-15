var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
const passport = require('passport');
const db = require("./models");
const localStrategy = require("passport-local").Strategy;
// const jwt = require("jsonwebtoken");
const async = require('async');
// const crypto = require('crypto');
const AuthController = {};


var cors = require('cors');
app.use(cors());
let http = require('http');
let server = http.createServer(app);
let socketIO = require('socket.io');
let path = require('path');
var problemRoute = require('./routes/problem');
// var playlistRoute = require('./routes/playlist');
let io = socketIO(server);
app.set('io', io);
io.on('connection', (socket) => {
    console.log('user connected');
});

passport.use(new localStrategy(db.user.authenticate()));
passport.serializeUser(db.user.serializeUser());
passport.deserializeUser(db.user.deserializeUser());


//use static files
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.use(require('express-session')({
    secret: 'Tmx8Y=fEn!A2KF=5cU2#&UaHMJweeUcTSWN5-6pXTUEHpu?Yhv',
    resave: false,
    saveUninitialized: false
}));


//secret code password = 'Tmx8Y=fEn!A2KF=5cU2#&UaHMJweeUcTSWN5-6pXTUEHpu?Yhv';

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

// use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/problem', problemRoute);
// app.use('/api/playlist', playlistRoute);

var line = __dirname + '/views'
app.use(express.static(line))

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.get('/',(req,res)=>{
    db.problem.find().then(probs=>{
        res.render('index',{probs:probs});
    });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

//user signup
app.post("/signup", (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.redirect('/signup');
    }
    db.user.register(
        new db.user({
            username: req.body.username,
            twitter_url :req.body.twitter_url
        }),
        req.body.password,
        (err, user) => {
            if (err) {
                return res.render('signup', { msg: err });
            }
            passport.authenticate("local")(req, res, () => {
                res.redirect('/');
            })
        }
    );
});

app.get('/login', (req, res) => {
    res.render('login');
});

//user login
app.post('/login',passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),(req,res)=>{});


app.post('/problem', (req, res) => {
    db.problem.create({
        username: req.user.username,
        userId: req.user._id,
        title: req.body.title,
        twitter_url: req.user.twitter_url,
        content: req.body.content,
        genres: req.body.genres.split(','),
        country: req.body.country
    }).then(prob => {
        io.emit('new_post');
        res.redirect('/problem/' + prob._id);
    }).catch(err=>{
        res.redirect('/');
    });
});

app.get('/problem/:id',(req,res)=>{
    db.problem.findById(req.params.id).then(prob=>{
        res.render('single',{prob:prob});
    });
});


//listen var likeRoute = require('./routes/likes');
// var playlistRoute = require('./routes/playlist');
server.listen(port, () => {
    console.log(`listening at port ${port}`);
});