$(function() {

  //GLOBAL VARIABLES
  // MomentJs
  moment().format();
  var today = new moment().format("YYYY-MM-DD");
  var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
  var source = $('#dailyTable-template').html();
  var template = Handlebars.compile(source);
  var todaysLst = [];
  var todaysTupleUrl = [];
  var eachData = [];
  var eachDataTable = [];
  var eachTuple = [];
  var showObj = [];
  var toShow = [];
  var urls = [];


  //FUNCTIONS

  // Build a tuple of each asteroids name and link for GET req. of self.
  // Inputs: todaysLst[]
  // Ouputs: todaysTupleUlr[]
  function buildUrlTuple(dArr) {
    console.log(dArr);
    dArr.forEach(function(i) {
      todaysTupleUrl.push([i.name, i.links.self]);
    });
  }

  // Iterates through, and builds array.
  // Inputs: i[url]
  // Outputs: eachData[] eachDataTable[], eachTuple[]
  function getEachData(dObj) {
    eachTuple.push([
      [dObj.name, dObj.close_approach_data.length], '/show/' + dObj.neo_reference_id
    ]);
    eachData.push([dObj.name, dObj.close_approach_data.length]);
    eachDataTable.push({
      "name": dObj.name,
      "value": dObj.close_approach_data.length
    });
    console.log(eachTuple);
  }

  // Inputs: eachTuple[]
  // Outputs: showObj[], toShow[], urls[]
  function splitTuples(dTup) {
    dTup.forEach(function(i) {
      showObj.push({
        'name': i[0][0],
        'value': i[0][1],
        'url': i[1]
      });
      toShow.push(i[0][0]);
      urls.push('/show/' + i[1]);
    });
  }

  function setForRows(dTup) {
    console.log(dTup);
  }
  setForRows();
  // Build c3.js chart
  // Inputs: 
  function buildChart(d) {
    console.log(d);
    //splitTuples(d);
    c3.generate({
      bindto: document.getElementById('chart'),
      data: {
        columns: d,
        type: 'donut',
        onclick: function(d, elem) {
          console.log(d);
        }
      },
      donut: {
        label: {
          format: function(value) {
            return d3.format()(value);
          }
        },
        width: 65,
      },
      tooltip: {
        format: {
          title: function(id) {
            return 'Asteroid: ';
          },
          value: function(value, ratio, id, index) {
            return value + ' passings';
          }
        }
      }
    });
    d3.select('#chart').on('click', function(d) {
      console.log(d);
    });
  }

  // Build table.
  // Inputs: eachDataTable(x), eachTuple(y)
  function buildTable(x, y) {
    splitTuples(y);
    var dailyTableHtml = template({
      daily: showObj
    });

    $("#dailyTable").append(dailyTableHtml);
    $('tbody tr').on('click', function(e) {
      //console.log(this); 
      //console.log(this.dataset.url);
      document.location = $(this).data('url');
    });
  }


  // II. Do GET for each of today's neos.
  function eachReq(dArr) {
    //console.log(dArr);
    dArr.forEach(function(i) {
      // GET...i[1] = url elem. in inputted tuple.
      $.get(i[1], function(j) {
        getEachData(j);
        buildChart(eachData);
        buildTable(eachDataTable, eachTuple);
        // SHIFT OUT  i[0] AT END OF ITERATION TO AVOID REPEAT WHEN CREATING TABLE
        eachDataTable.shift();
        eachTuple.shift();
        showObj.shift();
        urls.shift();
      });
    });
  }


  // I. GET today's Neos.
  $.get(rootUrl, function(data) {
    todaysLst = data.near_earth_objects[today];
    buildUrlTuple(todaysLst);
    $('#daily-count').append('<h3 class="text-center" id="count"> The Daily Asteroid Count Is: ' + '<strong>' + todaysLst.length + '</strong></h3>');
    eachReq(todaysTupleUrl);
  });



});