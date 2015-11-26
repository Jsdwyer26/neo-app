//Dependencies
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser');

//middleware
app.use(bodyParser.urlencoded({ extended: true}));	/*configure body-parser for form data*/

app.use(express.static(__dirname + '/public'));	/*use public folder for static files*/

app.set('view engine', 'hbs');	/*set hbs to view engine*/



//Mock home route
app.get('/', function (req, res){
	res.render('index');
});

//api routes
var allNeos = [ 	/*test data*/
	{date: 'date', name: 'name', magnitude: 'magnitude', velocity: 'velocity', distance: 'miss_distance' }, 
	{date: '2015-11-25', name: 'its name', magnitude: 'really bright', velocity: 'x mph', distance: 'just missed us by thiiiiis much' }
];	

app.get('/api/neos', function	(req, res){
	res.json({ neos: allNeos });
});




//start server 
app.listen(4000, function() {	
	console.log('listening on 4000');
});
