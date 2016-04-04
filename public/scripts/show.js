$(function() {

// VARIABLES AND LOADED MODULES 
  
  // Get neo id from url params and set as id. 
  //console.log(window.location.pathname);
  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);
  var idUrl = "https://api.nasa.gov/neo/rest/v1/neo/" + id + "?api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
  // Momentjs
  moment().format();
  var today = new moment().format("YYYY-MM-DD");
  //var sixM = today.add(6, 'months').format("YYYY-MM-DD");
  console.log();
  var earthNeos = []; // Collect data of the neos that pass just Earth.
  var otherNeos = []; // Collect data of the neos that pass body other than Earth.
  var name; // Asteroid Name 
  var countPast = 0; // Past occurences count for heading
  var countFuture = 0; // Future occurences count for heading
  var neoObj = // Main neo data object.
    {
      allData: [],
      past: [],
      present: [],
      future: [],
      pastAndFuture: [],
      pastAndFutureLst: []
    };
  // HBS
  var source = $('#storyTable-template').html();
  var template = Handlebars.compile(source);


// FUNCTIONS

  // Make sure Earth is the neo's orbiting body and count the number that are. 
  function checkOrbit(dArr) {
      dArr.forEach(function(i) {
          if (i.orbiting_body === "Earth") {
              earthNeos.push(i);
          } else {
              otherNeos.push([i.orbiting_body, i]);
          }
      });
  }
  // Collect and organize data into neoObj. This is where I'll get and store all my data on the neo. 
  function sortDates(dArr) {
      
      for(var i = 0; i < dArr.length; i++) {
          var d = dArr[i];  // Accesses the data at current index.
          neoObj.allData.push([d.close_approach_date, {
              missMi: (Math.round(d.miss_distance.miles * 100) / 100).toFixed(2),
              speedMph: (Math.round(d.relative_velocity.miles_per_hour * 100) / 100).toFixed(2) 
          }]);
          // Categorize by date.
          if (d.close_approach_date == today) {
              console.log(d);
              neoObj.present.push([today, {
                  missMi: (Math.round(d.miss_distance.miles * 100) / 100).toFixed(2),
                  speedMph: (Math.round(d.relative_velocity.miles_per_hour * 100) / 100).toFixed(2) 
              }]);
          } else if (moment(d.close_approach_date).isBefore(today)) { // Neos that already passed
              countPast ++;
              neoObj.past.push([d.close_approach_date, 
                { 
                  missMi: (Math.round(d.miss_distance.miles * 100) / 100).toFixed(2),
                  speedMph: (Math.round(d.relative_velocity.miles_per_hour * 100) / 100).toFixed(2) 
              }]);
              neoObj.pastAndFuture.push([d.close_approach_date, 
                { 
                  missMi: (Math.round(d.miss_distance.miles * 100) / 100).toFixed(2),
                  speedMph: (Math.round(d.relative_velocity.miles_per_hour * 100) / 100).toFixed(2) 
              }]);
          } else if (moment(d.close_approach_date).isAfter(today)) { // Neos to come in the future.
              countFuture ++;
               neoObj.future.push([d.close_approach_date, 
                { 
                  missMi: (Math.round(d.miss_distance.miles * 100) / 100).toFixed(2),
                  speedMph: (Math.round(d.relative_velocity.miles_per_hour * 100) / 100).toFixed(2) 
              }]);
              neoObj.pastAndFuture.push([d.close_approach_date, 
                { 
                  missMi: (Math.round(d.miss_distance.miles * 100) / 100).toFixed(2),
                  speedMph: (Math.round(d.relative_velocity.miles_per_hour * 100) / 100).toFixed(2) 
              }]);      
          }
      }
  }


  Array.max = function(arr) {
      return Math.max.apply(Math, arr);
  };
  Array.min = function(arr) {
      return Math.min.apply(Math, arr);
  };
  Array.average = function(arr) {
      (Array.min(arr) + Array.max(arr)) / 2;
  };

  // Gets avg from array of int.
  function average(arr) {
      var avg = (Array.min(arr) + Array.max(arr)) / 2;
    //console.log(Array.min(arrInt), Array.max(arrInt), avg);
  }
  
  // Set page title--Name and Earth passings count.
  function setHeading() {
      var neoName = $('#show-heading').append('<h1 class="countHeading"> Asteroid ' + '<strong>' + name + '</strong><hr></h1> ');
      var tableTitle = $('#chartTitle').prepend('<h3 class="text-center countHeading">Passed Earth ' + countPast + ' times </h3> <h3 class="text-center countHeading">Will Pass Earth ' + countFuture + ' times </h3>');
  }

  function setTicks(datesArr) {
      // I. Turn string dates in date objects.
      //turnToDates(datesArr);
      // II. Get min date object and date string. Tick Point 1.
      var minObj = moment.min(datesObj);
      var minDate = minObj._i;
      // III. Get max date object and date string. Tick Point 2.
      var maxObj = moment.max(datesObj);
      var maxDate = maxObj._i;
      console.log('the min date is: ' + minDate + ' The max date is: ' + maxDate);
      // III. Median Date. Tick Point 3.
  }

  function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  var datesLst = ['x'];
  var missLst = ['Miss Distance'];
  var speedsLst = ['Speed'];
  // For C3.js. Need to append this as first elem in arr.
  function chartHelper(dArr, yProp) {
      var prop;
      var propLst;
      dArr.forEach(function(i) {  
          if(yProp === 'missDst') {
              propLst = missLst;
              prop = 'missMi';
          } else if(yProp === 'speed'){
              propLst = speedsLst;
              prop = 'speedMph';
          } 
          datesLst.push(i[0]);
          propLst.push(i[1][prop]); // Dynamic key swapping works only with str var and bracket notation.
        });
  }

  // Make c3js missChart...chart mapping all the occernce's "miss distance". Do it in .miles for now.
  function makeChart(dArr, chartType, elemId, dataLst, units) {  //chartType, elemId, lst, unitOf
    var toSix = moment(today).add(6, 'months').format("YYYY-MM-DD");
    var fromSix  = moment(today).subtract(6, 'months').format("YYYY-MM-DD")
    // Variable for chart (missDst, speed)
    chartHelper(dArr, chartType);
    c3.generate({
          // elemId is whichever chart being appended to in DOM (#missChart / #speedChart)
          bindto: d3.select(elemId),
          size : { width: 825, height: 480 },
          data: {
              x: 'x',
              xFormat: '%Y-%m-%d',
            // Lst of data (missLst, speedsLst)
            columns: [ datesLst, dataLst],
            type: 'spline'
          },
          axis: {
              x: {
                type: 'timeseries',
                tick: { fit: false, format: '%Y' },
              },
              y: {
                tick: {
                  format: function(d) { return numberWithCommas(d); }
                },
                // unit of measuremeant(miles, mph)
                label: { text: units, position: 'outer-middle' }
              }
          },  
          tooltip: {
              format: {
                  title: function(d) {
                      // D3js time formatting https://github.com/mbostock/d3/wiki/Time-Formatting.
                      var format = d3.time.format('%Y-%m-%d');
                      //console.log(d);
                      return format(d);
                  },
                  // Unit of (miles, mph)
                  value: function(d) { return numberWithCommas(d) + ' '+ units }
              } 
          },
          regions: [
            { start: fromSix, end: toSix, class: 'regionToday' },
            { end: fromSix, class: 'regionPast' },
            { start: toSix, class: 'regionCame'}
          ]
        });
  
  }
  // Sets chart. If calling makeChart() in GET req., it messes with the onmouseover effect on the chart rendered second. Works if done in a function.
  function setChart(data) {
      var chartData = data;
      makeChart(chartData, 'speed', '#speedChart', speedsLst, 'Mph');
      makeChart(chartData, 'missDst', '#missChart', missLst, 'Miles');
  }

  // Sets table.
  function setTable(dArr) {
      var dataTable = [];
      for(var k in dArr) {
          console.log();
          dataTable.push({
                value: dArr[k][0]
          });
      }

      var storyTableHtml = template({
          story: dataTable
      });
      $("#storyTable").append(storyTableHtml);
  }
  // Set FooTable
  function setFooTable(dataArr) {
      //console.log(dataArr);
      $('.table').footable({
          "columns": "Data",
          "paging": {
            "limit": 3
          }
      });
  }
  // Neo data on earth only available in this function. This gets passed into GET req.
  function earthData(data) {
      checkOrbit(data.close_approach_data);
      sortDates(earthNeos);
      setHeading();
      setTable(neoObj.pastAndFuture);
      console.log(neoObj.allData);
      //setFooTable(pastDates);
      setChart(neoObj.allData);
  }

  $.get(idUrl, function(data) {
    //console.log(data);
    name = data.name;
    earthData(data);

  });

});