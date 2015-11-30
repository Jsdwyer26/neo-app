//Dependencies
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser');
	hbs = require('hbs'),
	mongoose = require('mongoose');


//array of test data




//middleware
//configure body-parser for form data
app.use(bodyParser.urlencoded({ extended: true}));

//use public folder for static files
app.use(express.static(__dirname + '/public'));	

//set hbs to view engine*
app.set('view engine', 'hbs');

//set-up partials
hbs.registerPartials(__dirname + '/views/partials');	

//connect to mongodb
mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/neo-app'
	); 

//require Neo model
var Neo=require('./views/models/neo');



//Mock home route
app.get('/', function (req, res){
	res.render('index');
});

//AUTH ROUTES
app.get('/signup', function (req, res) {
	res.render('signup');
});

app.get('/userhome', function (req, res) {
	res.render('userhome');
});



/*//NASA neo get
//NASA API SEARCH
//base url for NASA neo API
var baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-29&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
//where on page results will be appended to
var $results = $('#neos-list');
//render helper function
var render = function () {
	var neoHtml = template({neos: allNeos});
	$results.append(neoHtml);
};*/

/*//get neos from NASA api
$.get(baseUrl, function (data){
	//console.log(data);
	allNeos = data.near_earth_objects["2015-11-27"];
	console.log(allNeos);
	render();
});*/






//api routes
app.get('/api/neos', function	(req, res){
		//allNeos is taco, but comming out of our database
	Neo.find(function (err, allNeos) {
		res.json({ neos: allNeos });
	});
	
});
/*baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-28&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
app.get(baseUrl, function	(req, res){
		//allNeos is taco, but comming out of our database
	Neo.find(function (err, allNeos) {
		res.json({ neos: allNeos });
	});
	
});*/





//start server 
app.listen(process.env.PORT || 4000, function() {	
	console.log('listening on 4000');
});
