$(function() {
	console.log('hello world');

//compiling hbs template	
var source = $('#neos-template').html();
var template = Handlebars.compile(source);



//NASA API SEARCH
//base url for NASA neo API
var baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-29&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
//where on page results will be appended to
var $results = $('#neos-list');
//render helper function
var render = function () {
	var neoHtml = template({neos: allNeos});
	$results.append(neoHtml);
};

//get neos from NASA api
$.get(baseUrl, function (data){
	/*console.log(data);*/
	allNeos = data.near_earth_objects["2015-11-27"];
	console.log(allNeos);

	render();
});





//ajax call to get all neos from my API
/*$.get('/api/neos', function (data){
	console.log(data);
	 allNeos = data.neos;	//neos = key for data.neos--the data in our server

	var neosHtml = template({ neos : allNeos });	//our data from server made into an object
	$('#neos-list').append(neosHtml);	
});*/





}); /*closing loading brace*/