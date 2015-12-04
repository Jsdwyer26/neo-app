$( function () {
	

	//results element on mainuser.hbs
	var $results = $('#results');

	//empty array w/ an empty object to hold all neo data from NASA API
	var allNeosObj = [];

	//get element count, which can be asteroid count per day if querying in one day time period
	var dailyNeoCount;
		//dailyCountObj = {};
	
	//get asteroid id...for user to save
	var neoId;	

	//property names for chart
	var dataPie =[];

	//MOMENT
	moment().format();
	//save dates
	var today = new moment().format("YYYY-MM-DD"),
		tomorrow = moment().add(1, 'day').format("YYYY-MM-DD"),
		day3 = moment().add(2, 'day').format("YYYY-MM-DD"),
		day4 = moment().add(3, 'day').format("YYYY-MM-DD"),
		day5 = moment().add(4, 'day').format("YYYY-MM-DD"),
		day6 = moment().add(5, 'day').format("YYYY-MM-DD"),
		day7 = moment().add(6, 'day').format("YYYY-MM-DD"),
		toOneWeek = moment().add(7, 'day').format("YYYY-MM-DD");

	//chartjs  	
	var ctx = $("#myChart").get(0).getContext("2d");
	var myNewChart = new Chart(ctx);	

	//url's
	var baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-30&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
	var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

	//HBS
	//compile hb template
/*	var source = $('#neos-template').html();
	var template = Handlebars.compile(source);
*/
	//new function
	function buildData(prop) {
		//clear array dataset
		dataPie = [];

		allNeosObj.forEach(function (day) {
			var todaysNeos = day[today];
			
			todaysNeos.forEach(function (neo){
				var value;
				if (prop === "diameter") {
					value = neo.estimated_diameter.feet.estimated_diameter_max;
				
				} else if(prop === "magnitude") {
					value = neo.absolute_magnitude_h;
				
				} else if (prop === "missDist" ) {
					value = neo.close_approach_data[0].miss_distance.miles;
				
				} else if (prop === "approachDate") {
					value = neo.close_approach_data[0].close_approach_date;
				
				} else if (prop === "velocity") {
					value = neo.close_approach_data[0].relative_velocity.miles_per_hour;
				}
				
				dataPie.push({
					value: value,
					color: randomColor(),
					highlight: "#FF5A5E",
					label: "asteroid " + neo.name 
				});
			});
		
		});
		console.log(dataPie);
	}
	

	//Get req. to my server for username info.
	$.get('/api/dailyneos', function (data){
	 	//get username to render on view
	 	allNeos = data.userName;	
	});	

	var myDoughnutChart;
	//get neos from NASA api
	$.get(rootUrl, function (data){ 
		//saving NASA data to empty array
		allNeosObj.push(data.near_earth_objects);
		console.log(allNeosObj);
		
		//get element count; sibling of near_earth_objects array
		dailyNeoCount = data.element_count;
		
		//daily neo count rendered
		$('#daily-count').append('<h3 class="text-center" id="dailyCount"> The daily neo count is: ' + dailyNeoCount + '</h3>');
		
		//Call buildData on pageload 
		buildData("velocity");	
		
		//Make chart right after calling build data func
		myDoughnutChart = new Chart(ctx).Doughnut(dataPie);
		console.log(myDoughnutChart.generateLegend());
		$('#pieLegend').append(myDoughnutChart.generateLegend());

		//gets selected chart segment data
		$('#myChart').on('click', function (e){
    		var activePoints = myDoughnutChart.getSegmentsAtEvent(e);
    		// => activePoints is an array of segments on the canvas that are at the same position as the click event.
			console.log(activePoints[0]);
		});
		//render();
 
	});/*closing NASA get request*/	
	
	//jQuery for selecting Property to show
	$('.neo-prop').on('click', function (e){
		myDoughnutChart.destroy();
		var property = $(this).attr('data-prop');
		//build data on jQuery click
		buildData(property);
		myDoughnutChart = new Chart(ctx).Doughnut(dataPie);
	});


});/*closing load brace*/
