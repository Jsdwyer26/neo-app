$(function() {

  var today = "2016-02-08",
    date = today;

  var dailyNeos = [],
    dataTable = [],
    dataPie = [],
    neoId = [];

  var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

  //HBS template = dailyTable-template.
  var source = $('#dailyTable-template').html();
  var template = Handlebars.compile(source);

  // Make daily count.
  function dailyCount(data) {
    var dailyNeoCount = data.element_count;
    $('#daily-count').append('<h3 class="text-center" id="count"> The Daily Asteroid Count Is: ' + '<strong>' + dailyNeoCount + '</strong></h3>');
  }
  // Set home table contents.
  function setTableContents() {
    var dailyTableHtml = template({
      daily: dataTable
    });
    $("#dailyTable").append(dailyTableHtml);
  }
  // Make home chart.
  function makeChart() {
    c3.generate({
      data: {
        columns: dataPie,
        type: 'bar'
      }
    });
  }
  // Extract each NeoId to be each placed in GET req. 
  function getNeoId() {
    var dailies = dailyNeos[0][date];
    dailies.forEach(function(neo) {
      neoId.push(neo.neo_reference_id);
    });
    return neoId;
  }

  var idUrl = [];
  // Format and set the url for each neo's GET.
  function setUrl(id) {
    id.forEach(function(neoId) {
      idUrl.push("https://api.nasa.gov/neo/rest/v1/neo/" + neoId + "?api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77");
    });
  }

  sampleArr = [
    ["00 Apple", 15]
  ];
  // Format returned [name, occurences(int)] as ab object to be passed into to format the home table function.
  function formatTable(arr) {
    dataTable.push({
      name: arr[0],
      value: arr[1]
    });
  }

  //GET the each asteroid's name and the number of past occurences.
  var storyInfo = [];

  function neoRemembrances(dataArr) {
    for (var i = storyInfo.length; i < dataArr.length; i++) {
      var name = dataArr[i].name;
      var length = dataArr[i].close_approach_data.length;
      storyInfo.push([dataArr[i].name, length]);
    }
    return storyInfo;
  }
  // Pass in data to be formatted for the home table. 
  function makeTableData(arr) {
    arr.forEach(function(i) {
      formatTable(i);
    });
    console.log(dataTable);
  }

  // 
  var neoStory = [];

  function getIdData(idUrl) {
    idUrl.forEach(function(url) {
      $.get(url, function(data) {
        neoStory.push(data);
        neoRemembrances(neoStory);
        makeTableData(storyInfo);
      });
    });
  }

  //I. GET for all of today's asteroids and their id.
  function getDailies() {
    $.get(rootUrl, function(data) {
      dailyNeos.push(data.near_earth_objects);
      dailyCount(data);
      getNeoId();
      setUrl(neoId);
      getIdData(idUrl);
    });
  }

  //Iterate through today's asteroids id's and do a GET for each id.
  function getStory() {
    getDailies();
  }

  getStory();


});