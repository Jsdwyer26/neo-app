
$( function (){
	console.log('js works');

	var $results = $('#results');

	//empty array w/ an empty object to hold all neo data from NASA API
	var allNeosArr = [];
	var allNeosObj = [];

	//get element count, which can be asteroid count per day if querying in one day time period
	var dailyNeoCount;	

	//property names
	var names = [],
		magnitudes = [],
		missDists = [],
		diameterFt = [],
		apprchDate = [],
		speed = [],
		speeds = {};
		


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
		oneWeek = moment().add(7, 'day').format("YYYY-MM-DD");	

	//CHART 	
	// Get context
	var ctx = $("#myChart").get(0).getContext("2d");
	// This gets the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);	
	
	

	//url's
	var baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-30&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
	var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

	//HBS
	//compile hb template
	var source = $('#neos-template').html();
	var template = Handlebars.compile(source);

	var render = function() {
		
		$results.empty();
		//pass in data to render in the template
		var neoHtml = template({neos: allNeos });
		$results.append(neoHtml);
		
	};

	//get neos from NASA api
	$.get(rootUrl, function (data){
		//As an array
		allNeosArr.push(data.near_earth_objects); 
		//As an object; w/keys as the "searched" date
		allNeosObj = data.near_earth_objects;
		console.log(allNeosObj);

		//get element count is sibling of near_earth_objects array, so just saving it to a different var
		dailyNeoCount = data.element_count;
		$results.append('<h3 class="text-center"> The daily neo count is: ' + dailyNeoCount + '</h3>');


		//function to get desired property from neo api
		function getProps() {
		//saving each property as an array: if search date is more than 1 day at a time
				for(var prop in allNeosObj) {

					function getPropsToShow(propToShow){
					//gets each property out of each date's([prop]) neos' 
						for(var i =0; i < allNeosObj[prop].length; i++) {
							
							//path to info in allNeos obj for properties
							neoInfo = allNeosObj[prop][i];
							
							switch (propToShow) {
							case "names":
								//names.prop = neoInfo.name;
								names.push(neoInfo.name);
							
							case "magnitude":	
								//allMagnitudes =  allNeosObj[prop][i].absolute_magnitude_h;
								magnitudes.push(neoInfo.absolute_magnitude_h);
							
							case "missDist":
								//allMissDist = neoInfo.close_approach_data[0].miss_distance.miles;
								missDists.push(neoInfo.close_approach_data[0].miss_distance.miles);
								//console.log(missDists);
							
							case "diameter":
								diameterFt.push(neoInfo.estimated_diameter.feet.estimated_diameter_max);
								//console.log(diameterFt);
							case "approachDate":
								apprchDate.push(neoInfo.close_approach_data[0].close_approach_date);
								
							case "speed":
								var neoSpeedsInfo = neoInfo.close_approach_data[0].relative_velocity;
								//adding to speed array; getting speed at mph 
								speed.push(neoSpeedsInfo.miles_per_hour);
								//as speed object
								speeds.kmps = neoSpeedsInfo.kilometers_per_second;
								speeds.kmph = neoSpeedsInfo.kilometers_per_hour;
								speeds.mph = neoSpeedsInfo.miles_per_hour;	
								//console.log(speeds);		
							} 	/*closing switch*/
						}	/*closing for*/
					}	/*closing getPropsToShow*/
				
					getPropsToShow("names","missDist", "approachDate", "speed"); 
				}  /*closing for in*/
		}	/*closing getProps*/
		
		//Call getProps
		getProps();	
		//render();
		

		//CHART
		//chart data
		var dataPie = [
		    {
		        value: diameterFt[0],
		        color:"rgb(255, 0, 0)",
		        highlight: "#FF5A5E",
		        label: "asteroid " + names[0]
		    },
		    {
		        value: diameterFt[1],
		        color: "rgb(0, 255, 0)",
		        highlight: "#5AD3D1",
		        label: "asteroid " + names[1]
		    },
		    {
		        value: diameterFt[2],
		        color: "rgb(0, 0, 200)",
		        highlight: "#FFC870",
		        label: "asteroid " + names[2]
		    },
		    {
		        value: diameterFt[3],
		        color: "rgb(255, 0, 255)",
		        highlight: "#FFC870",
		        label: "asteroid " + names[3]
		    },
		    {
		        value: diameterFt[4],
		        color: "rgb(100, 0, 0)",
		        highlight: "#FFC870",
		        label: "asteroid " + names[4] 
		    }
		];


		//pie chart
		var myPolarAreaChart = new Chart(ctx).PolarArea(dataPie);
		
		//var scatterChart = new Chart(ctx).Scatter(dataScatter);
		
	});/*closing NASAget request*/	

	//Get Req. to my server
	$.get('/api/neos', function (data){
		console.log(data);
	 	allNeos = data.neos;	/*neos = key for data.neos--the data in our server*/

			//var neosHtml = template({ neos : allNeos });	/*our data from server made into an object*/
			//$('#neos-list').append(neosHtml);	
	});	


 });/*closing load brace*/
