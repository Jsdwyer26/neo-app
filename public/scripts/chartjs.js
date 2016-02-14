$(function() {

  var today = "2016-02-10",
      date = today;

  var dailyNeos = [],
    dataTable = [],
    dataChart = [],
    neoId = [],
    idUrl = [],
    refIds = [];
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
  function setTable() {
    var dailyTableHtml = template({
      daily: neoStoryObj
    });
    $("#dailyTable").append(dailyTableHtml);
  }

  // Make home chart.
  /*function makeChart(arr) {
    console.log(neoId);
    c3.generate({
      data: {
        columns: arr,
        type: 'bar',
        onclick: function(d, i) {
          console.log(i);
        }
      },
      pie: {
        label: {
          format: function(value, ratio, id) {
            return d3.format()(value);      
          }
        }
      }        
    });
  }*/
  // Extract each NeoId to be each placed in GET req. 
  function getNeoId() {
    var dailies = dailyNeos[0][date];
    dailies.forEach(function(neo) {
      neoId.push(neo.neo_reference_id);
    });
    return neoId;
  }

  // Format and set the url for each neo's GET.
  function setUrl(id) {
    console.log(id);
    id.forEach(function(neoId) {
      idUrl.push("https://api.nasa.gov/neo/rest/v1/neo/" + neoId + "?api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77");
    });
  }

  var neoStoryArr = [];
  var neoStoryObj = [];
  
  function addStory(arr) {
    /*console.log(arr.name);*/
    neoStoryObj.push({
      name: arr.name,
      value: arr.close_approach_data.length
    });
    return neoStoryObj;
  }
  var myDoughnutChart;
  function getIdData(idUrl) {
    idUrl.forEach(function(url) {
      $.get(url, function(data) {
        neoStoryArr.push([data.name, data.close_approach_data.length]);
        refIds.push();
        addStory(data);
        setTable();
       /* makeChart(neoStoryArr);*/
        myDoughnutChart = new Chart(ctx).Doughnut(neoStoryArr); 
      });
    });
    /*console.log(neoStoryObj);*/
  }

  function getDaily() {
    $.get(rootUrl, function(data) {
      dailyNeos.push(data.near_earth_objects);
      dailyCount(data);
      getNeoId();
      setUrl(neoId);
      getIdData(idUrl);
      
    });
  }

  getDaily();

});