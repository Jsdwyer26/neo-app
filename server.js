// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// connect to mongodb
//connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/neo-app'
  );

// require Post and User models
var User = require('./models/user');
var NeoInfo = require('./models/neo');
    

// middleware for auth
app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// HOMEPAGE ROUTE
app.get('/', function (req, res){
  res.render('userhome');
});


app.get('/signup', function (req, res){
  res.render('signup');
});

//sign up new user, then log them in
//hash and salt password, saves new user to db
app.post('/signup', function (req, res){
  if (req.user) {
    res.redirect('/userhome');
  } else {
    User.register(new User({ username: req.body.username}), req.body.password, 
        function (err, newUser){
          passport.authenticate('local')(req, res, function () {
          //res.send("signed up :D ");
          res.redirect('/userhome');
          });
        }
    );
  }
});


//log in route
app.get('/login', function (req, res){
  res.render('login');
});

//log in user
app.post('/login', passport.authenticate('local'), function (req, res){
  res.redirect('/userhome');
});

//logout user
app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});

//userhome route
app.get('/userhome', function (req, res) {
  res.render('userhome', {user: req.user});
});

//API ROUTES

app.get('/api/dailyneos', function (req, res) {
  User.find(function (err, allDailyNeos){
    res.json({userName: allDailyNeos});
  });
});



//start server 
app.listen(process.env.PORT || 4000, function() { 
  console.log('listening on 4000');
});
