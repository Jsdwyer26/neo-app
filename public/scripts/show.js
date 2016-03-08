$(function() {

  //console.log(window.location.pathname);
  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);
  console.log(id);

  // Mock url. Just to get data now.
  var idUrl = "https://api.nasa.gov/neo/rest/v1/neo/" + id + "?api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

  var neoData = [];
  var earthNeos = [];
  var otherNeos = [];
  var name;
  // Momentjs
  moment().format();
  var today = new moment().format("YYYY-MM-DD");

  // HBS
  var source = $('#storyTable-template').html();
  var template = Handlebars.compile(source);


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

  var countPast = 0; // Past occurences count for heading
  var countFuture = 0; // Future occurences count for heading
  var present = []; // Data array for today's neo passing. Output of sortDates(). Input for .
  var pastAndFuture = []; // DATES list for past&future passings. Output of sortDates(). Input for: .  
  var pastDates = []; // Array of . Output of . Input for .
  var futureDates = []; // Array of . Output of . Input for .
  var pastAndFutureDates = []; // Array of . Output of . Input for .
  
  var datesObj = 
    {
      past: [],
      present: [],
      future: [],
      pastAndFuture: []
    };

  function sortDates(dArr) {
      dArr.map(function(i) {
          var dateData = i.close_approach_date;

          if (i.close_approach_date == today) {
              present.push(i);
              //datesObj.present = {today: i};
          } else if (moment(dateData).isBefore(today)) {
              countPast ++;
              //datesObj.past.push([dateData, i]);
              //datesObj.pastAndFuture.push([dateData, i]);
              pastDates.push(i.close_approach_date);
              pastAndFuture.push(i);
              pastAndFutureDates.push(i.close_approach_date);
          } else if (moment(i.close_approach_date).isAfter(today)) {
              countFuture ++;
              //datesObj.future.push([dateData, i]);
              //datesObj.pastAndFuture.push([dateData, i]);
              futureDates.push(i.close_approach_date);
              pastAndFuture.push(i);
              pastAndFutureDates.push(i.close_approach_date);          
          }
      });
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
  
  // Outputs attrVals data array.
  var attrVals = [];
  var newAttrValsArr = [];
  var attrObj = { 
      "miss": [],
      "speedMph": [],
      "speedKmh": [],
      "speedKms": []
  };
  function getNeoAttr(dArr) {
      //console.log(dArr);
      dArr.forEach(function(i) {
          //console.log((Math.round(i.relative_velocity.miles_per_hour * 100) / 100).toFixed(2));
          // Round to 2 decimals. 
          attrVals.push([(Math.round(i.miss_distance.lunar * 100) / 100).toFixed(2), (Math.round(i.relative_velocity.miles_per_hour * 100) / 100).toFixed(2)]);
          attrObj.miss.push((Math.round(i.miss_distance.miles * 100) / 100).toFixed(2));
          attrObj.speedMph.push((Math.round(i.relative_velocity.miles_per_hour * 100) / 100).toFixed(2));
          attrObj.speedKmh.push((Math.round(i.relative_velocity.kilometers_per_hour * 100) / 100).toFixed(2));
          attrObj.speedKms.push((Math.round(i.relative_velocity.kilometers_per_second * 100) / 100).toFixed(2));
        
      });
      average(attrVals);
  }

  // Set page title--Name and Earth passings count.
  function setHeading() {
      var neoName = $('#show-heading').append('<h1 class="countHeading"> Asteroid ' + '<strong>' + name + '</strong><hr></h1> ');
      var tableTitle = $('#storyTableContainer').prepend('<h3 class="text-center countHeading">Passed Earth ' + countPast + ' times </h3> <h3 class="text-center countHeading">Will Pass Earth ' + countFuture + ' times </h3>');
  }

/*  var datesObjNew = [];
  function turnToDates(datesArr) {
      datesArr.map(function(i) {
          var date = new moment(i).format("YYYY-MM-DD");
          datesObjNew.push(date);
      });
      console.log(datesObjNew);
  }*/

  function setTicks(datesArr) {
      // I. Turn string dates in date objects.
      turnToDates(datesArr);
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

  // Make c3js missChart...chart mapping all the occernce's "miss distance". Do it in .miles for now.
  function makeMissChart(datesArr, valuesArr) {
      //console.log(datesArr);
        var preserveDatesArr = datesArr;
        var preserveValuesArr = valuesArr;
        // Add 'x' as element at i[0] for c3js.
        datesArr.unshift('x');
        valuesArr.unshift('Miss Distance');
        var chart = c3.generate({
          bindto: '#missChart',
          size : {
            width: 825,
            height: 480
          },
          data: {
              x: 'x',
              xFormat: '%Y-%m-%d',
            columns: [
              datesArr, 
              valuesArr
            ],
            type: 'spline'
          },
          axis: {
              x: {
                type: 'timeseries',
                tick: {
                  fit: false,
                  format: '%Y'
                },
              },
              y: {
                tick: {
                  format: function(d) {
                    return numberWithCommas(d);
                  }
                },
                label: {
                    text: 'Miles',
                    position: 'outer-middle'
                }
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
                    value: function(d) {
                        return numberWithCommas(d) + ' miles';
                    }
                } 
            }
        });
  }
  // Make c3js speedChart...chart mapping all the occernce's velocity. Do it in .mph for now.
  function makeSpeedChart(datesArr, valuesArr) {
      //console.log(datesArr);
        // Add 'x' as element at i[0] for c3js.
        //datesArr.unshift('x');
        valuesArr.unshift('Speed');
        var chart = c3.generate({
          bindto: '#speedChart',
          size : {
              width: 825,
              height: 480
          },
          data: {
              x: 'x',
              xFormat: '%Y-%m-%d',
              columns: [
                  // Dates and vaules.
                  datesArr, 
                  valuesArr
              ],
              type: 'spline'
          },
          axis: {
              x: {
                type: 'timeseries',
                tick: {
                  fit: false,
                  format: '%Y'
                }
              },
              y: {
                tick: {
                    format: function(d) {
                      return numberWithCommas(d);
                    } 
                },
                label: {
                    text: 'Miles',
                    position: 'outer-middle'
                } 
              }
          },
          tooltip: {
              format: {
                  title: function(d) {
                    // D3js time formatting https://github.com/mbostock/d3/wiki/Time-Formatting.
                    var format = d3.time.format('%Y-%m-%d');
                    return format(d); 
                  },
                  value: function(d) {
                    return numberWithCommas(d) + ' mph';
                  }
              } 
          },
        });
        //datesArr.shift();
        /*valuesArr.shift();*/
  }



  // Sets table.
  function setTable(arr) {
      var dataTable = [];
      arr.forEach(function(i) {
          dataTable.push({
              value: i
          });
      });
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
      getNeoAttr(pastAndFuture);
      setTable(pastAndFutureDates);
      console.log(datesObj);
      //console.log(past, pastDates, future, futureDates);
      //setFooTable(pastDates);
      //charts.missChart(pastAndFutureDates, attrObj.miss);
      makeMissChart(pastAndFutureDates, attrObj.miss);
      makeSpeedChart(pastAndFutureDates, attrObj.speedMph);
  }

  $.get(idUrl, function(data) {
    //console.log(data);
    name = data.name;
    earthData(data);

  });

});