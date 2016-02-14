$(function() {

  var today = "2016-02-10",
      date = today;

  var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

  // Array to hold data for today's neos.
  var dailyNeos = [];

  // I. GET today's asteroids
  $.get(rootUrl, function(data) {
    dailyNeos.push(data.near_earth_objects[today]);
    // Create url for req. for all of today's asteroids.
    getEachIdUrl(dailyNeos, setUrl);
    /*getEachData(idUrl);*/
    setHome();
    var chart = Plotly.newPlot('myDiv', dataPie, layout);
  });

  // Array that holds all the formatted GET req. urls.
  var idUrl = [];
  
  // Take neo id's and format into NASA GET req. url. Passed into getEachId().
  function setUrl(idArr) {
    idArr.forEach(function(id) {
      idUrl.push("https://api.nasa.gov/neo/rest/v1/neo/" + id + "?api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77");
    });
    return idUrl;
  }

  // Array to hold each of today's neos id's...to be formatted as url for each neos GET req.
  var neoIds = [];
  
  // Takes in an array and callback, setUrl().
  // Exectuted in req. for today's asteroids.
  function getEachIdUrl(arr, callback) {
    // 1. Extract the id from each neo's dataObj. and push into an array.
    arr.forEach(function (dataObj) {
      dataObj.forEach(function (neo){
        neoIds.push(neo.neo_reference_id);
      });
    });
    // 2. Pass that array of id's to callback, setUrl(). Outputs array of GET req. as strings.
    callback(neoIds);
  }

  // Make donut chart. 
  function makeChart() {
    var data = [{
        values: [19, 26, 55],
        labels: ['Residental', 'Non-Residental', 'Utility'],
        type: 'pie',
        hole: 0.5
    }];

    var layout = {
      height: 400,
      width: 500
    };
    // Plot pie chart.
    Plotly.newPlot('myDiv', data, layout);
  }
  var layout = {
      height: 400,
      width: 500
    };
  var storyData = [];
  // GET req. for each asteroid. Takes in an array or url as as strings and outputs...
  function getEachData(urlArr) {
    urlArr.forEach(function (neoReq) {
      $.get(neoReq, function (data) {
            storyData.push({
              names: data.name,
              values: data.close_approach_data.length
            });
            /*makeChart();*/
            buildChart(storyData);
      });

    });

  }
  // II. Set homepage.
  function setHome() {
    // 1. GET req. for data on each neo. Outputs data for each of day's neo as dataObj. 
    getEachData(idUrl);
  }
  var dataPie = [];

  function buildChart(dataObj) {
    dataObj.forEach(function(i) {
      var values;
      console.log(i.names, i.values);
      dataPie.push({
        values: i.values,
        labels: i.names,
        type: 'pie',
        hole: 0.5
      });
    });
  }
 


});