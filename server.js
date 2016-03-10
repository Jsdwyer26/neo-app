// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    /*cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,*/
    chartsHelper = require('./charts.js');

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

    

// middleware for auth
/*app.use(cookieParser());
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
passport.deserializeUser(User.deserializeUser());*/


// HOMEPAGE ROUTE
app.get('/', function (req, res){
  res.render('index');
});

app.get('/showNeo', function (req, res) {
  res.render('show');
});
app.get('/show/:id', function (req, res) {
  var neoId = req.params.id;
  var charts = chartsHelper;
  res.render('show');
});
app.get('/about', function(req, res) {
  res.render('about');
}) 



//API ROUTES
app.get('/api/dailyneos', function (req, res) { // Users no longer exist. Pass in number of occurences data.
  User.find(function (err, allDailyNeos){
    res.json({userName: allDailyNeos});
  });
});



//start server 
app.listen(process.env.PORT || 5000, function() { 
  console.log('to the moon on 5000');
});
