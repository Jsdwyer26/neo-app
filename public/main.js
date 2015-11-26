$(function () {
	console.log('hello world');

//compiling hbs template	
var source = $('#neos-template').html();
var template = Handlebars.compile(source);

//array of test data


//ajax call to get all neos 
$.get('/api/neos', function (data){
	console.log(data);
	 allNeos = data.neos;	/*neos = key for data.neos--the data in our server*/

	var neosHtml = template({ neos : allNeos });	/*our data from server made into an object*/
	$('#neos-list').append(neosHtml);	
});



}); /*closing loading brace*/