$(function() {

  moment().format();
  var today = new moment().format("YYYY-MM-DD");
  var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
  // Build list of today's neo name and self url. Outputs tupple [name, url]. 
  var dailiesList = [];
  // Holds each day's neo's name and number of occurences
  var eachInfo = [];
  var source = $('#dailyTable-template').html();
  var template = Handlebars.compile(source);

  var tableObj = {
      name: '',
      stories: 0,
      link: ''
  };

  function buildTableObj(dArr) {
      tableObj.name = dArr.name;
      tableObj.stories = dArr.close_approach_data.length;
      tableObj.link = dArr.links.self;
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
      d3.select('#chart').on('click', function(d) {});
  }

  var dataTable = [];
  // Build Table
  function buildTable(data) {
    //console.log(data);
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

  // GET. Takes in url and does req. for each of the day's asteroids. Outputs array(tuple) of [name, num of occurences].
  function eachReq(url) {
      $.get(url, function(data) {
          //console.log(data);
          eachInfo.push([data.name, data.close_approach_data.length]);
          buildTableObj(data);
          makeChart(eachInfo, tableObj);
          buildTable(eachInfo);
      });
  }
  // Build list, dailiesList, of neo names and url's...then pass function into GET. 
  function buildList(x) {
      // Build array to map over.
      x.forEach(function(i) {
          dailiesList.push([i.name, i.links.self]);
      });
      // Map over loop's output, with GET function for each.
      dailiesList.map(function(i) {
          console.log(i);
          eachReq(i[1]);
      });
  }

  // GET today's neos
  $.get(rootUrl, function(data) {
      console.log(data);
      buildList(data.near_earth_objects[today]);
  });

});