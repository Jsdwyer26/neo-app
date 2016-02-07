$( function () {
	

	//results element on mainuser.hbs
	var $results = $('#results');

	//empty array w/ an empty object to hold all neo data from NASA API
	var allNeosObj = [];

	//get element count, which can be asteroid count per day if querying in one day time period
	var dailyNeoCount;
		
	
	//get asteroid id...for user to save
	var neoId;	

	//property names for chart
	var dataPie =[],
		dataTable = [];

	var neoHeadInfo =[];
	var idInfo = [];

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
	var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + tomorrow + "&end_date=" + tomorrow + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

	//HBS
	//compile hb template
/*	var source = $('#neos-template').html();
	var template = Handlebars.compile(source);
*/
	var source = $('#dailyTable-template').html();
	var template = Handlebars.compile(source);

	

	//new function
	function buildData(prop) {
		//clear array dataset
		dataPie = [];
		dataTable = [];
		allNeosObj.forEach(function (day) {
		
			var todaysNeos = day[tomorrow];
			
			todaysNeos.forEach(function (neo){
				//console.log(neo);
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
				dataTable.push({
					name: neo.name,
					value: value
				});
				console.log(dataTable);

				neoHeadInfo.push({
					id: neo.neo_reference_id,
					name: neo.name 
				});
			});
		});
		/*console.log(dataPie);*/
	}

	
	function getIdData (id)	{
		var neoHeadInfo = [],
			idInfoObj = {},
			ast = [];

		allNeosObj.forEach(function (day) {
			var todaysNeos = day[tomorrow];

			todaysNeos.forEach(function (neo){
				//id = neo.neo_reference_id;
				//id = this.id;
				id = "3735612"
				idUrl = "https://api.nasa.gov/neo/rest/v1/neo/" + id + "?api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77"
				//get by each id for today's asteroids
				$.get(idUrl, function (data){
					var name = data.name;
					neoHeadInfo.push({"data.name": data});
				});
			});	
		});
	}
 /* function idDetails () {

  }*/

	//Get req. to my server for username info.
	$.get('/api/dailyneos', function (data){
	 	//get username to render on view
	 	allNeos = data.userName;	
	});	

	var testData = [
	{name: "my ast", value: 45968264},
	{name: "my ast", value: 45968264}
	];
	var myDoughnutChart;
	//get NASA data
	$.get(rootUrl, function (data){ 
		allNeosObj.push(data.near_earth_objects);
		dailyNeoCount = data.element_count;
		//daily neo count
		$('#daily-count').append('<h3 class="text-center" id="count"> The Daily Asteroid Count Is: ' + '<strong>' + dailyNeoCount + '</strong></h3>');
		buildData("missDist");
		getIdData();
		
		//Make chart 
		myDoughnutChart = new Chart(ctx).Doughnut(dataPie); 
		var placeTitle = $('#prop-title').append('<h3 class="text-center" id="prop-title"> Todays Miss Distances </h3>');
		
		//Make table
		var dailyTableHtml = template({ daily: dataTable });
		$("#dailyTable").append(dailyTableHtml);

		//gets selected chart segment data
		$('#myChart').on('click', function (e){
    		var activePoints = myDoughnutChart.getSegmentsAtEvent(e);
    		/*console.log(activePoints[0].label);*/
		});
		//render();
 
	});/*closing NASA get request*/	

	function capitalizeFirstLetter(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	}

	//jQuery for selecting Property to show
	$('.neo-prop').on('click', function (e){
		//declare clicked property to show
		var property = $(this).attr('data-prop');
		var propTitle = capitalizeFirstLetter(property)
		//clear existing chart and table
		myDoughnutChart.destroy();
		$('#prop-title').empty().append('<h3 class="text-center"> Todays ' + propTitle + '</h3>');
		$("#dailyTable").empty().append( "<thead> <tr id='tableColName'> <th></th> <th>Name</th> <th>" + propTitle + " </th> </tr> </thead> <tbody>" );
		

		
		//build data on jQuery click
		buildData(property);
		
		myDoughnutChart = new Chart(ctx).Doughnut(dataPie);
		
		var dailyTableHtml = template({ daily: dataTable });
		$("#dailyTable").append(dailyTableHtml);
	});


});/*closing load brace*/