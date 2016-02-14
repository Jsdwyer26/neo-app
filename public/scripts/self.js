$(function() {

  var source = $('#dailyTable-template').html();
  var template = Handlebars.compile(source);

  var today = '2016-02-13';
  var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

  // Build list of today's neo name and self url. Outputs tupple [name, url]. 
  var dailiesList = [];

  // Holds each day's neo's name and number of occurences
  eachInfo = [];

  // Build and req. list of neo urls and thier names. Outputs.
  function buildList(x) {
    console.log(x);
    // Build array to map over.
    x.forEach(function(i) {
      dailiesList.push([i.name, i.links.self]);
    });
    // Map over loop's output, with GET function.
    dailiesList.map(function(i) {
      eachReq(i[1]);
    });
  }
  // Takes in url and does GET req.
  // Outputs array(tuple) of [name, num of occurences].
  var dataObj = {
    name: '',
    stories: 0,
    link: ''
  };

  function eachReq(url) {
    $.get(url, function(data) {
      eachInfo.push([data.name, data.close_approach_data.length]);
      dataObj.name = data.name;
      dataObj.stories = data.close_approach_data.length;
      dataObj.link = data.links.self;
      makeChart(eachInfo, dataObj);
      buildTable(eachInfo);
    });
    
  }

  // Make chart c3.
  function makeChart(dataObj) {
    c3.generate({
      bindto: document.getElementById('chart'),
      data: {
        columns: dataObj,
        type: 'donut',
        onclick: function(d, elem) {
          console.log(d);
        }
      },
      donut: {
        label: {
          format: function(value, ratio, id) {
            return d3.format()(value);
          }
        },
        width: 65,
      },
      tooltip: {
        format: {
          value: function(value, ratio, id, index) {
            return value;
          }
        }
      }
    });
    d3.select('#chart').on('click', function(d) {
      /*console.log(d);*/
    });
  }


  // Build Table
  function buildTable(data) {
    var dataTable = [];
    data.forEach(function(i) {
      dataTable.push({
        name: i[0],
        value: i[1]
      });
    });
    var dailyTableHtml = template({
        daily: dataTable
    });
    $("#dailyTable").append(dailyTableHtml);
  }

  // GET today's neos
  $.get(rootUrl, function(data) {
    buildList(data.near_earth_objects[today]);
  });

});