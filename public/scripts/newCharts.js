$(function() {

  //MomentJS dates.
  moment().format();

  var today = new moment().format("YYYY-MM-DD"),
    tomorrow = moment().add(1, 'day').format("YYYY-MM-DD");

  //HBS template = dailyTable-template.
  var source = $('#dailyTable-template').html();
  var template = Handlebars.compile(source);

  //NASA url's.
  var baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-30&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
  var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + tomorrow + "&end_date=" + tomorrow + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

  var dailyNeos = [],
      dataTable = [];

  //Build daily count display.
  function dailyCount(data) {
    var dailyNeoCount = data.element_count;
    $('#daily-count').append('<h3 class="text-center" id="count"> The Daily Asteroid Count Is: ' + '<strong>' + dailyNeoCount + '</strong></h3>');
  }

  function setTableContents() {
    var dailyTableHtml = template({
      daily: dataTable
    });
    $("#dailyTable").append(dailyTableHtml);
  }

  //GET NASA data.
  $.get(rootUrl, function(data) {
    dailyNeos.push(data.near_earth_objects);
    console.log(dailyNeos);
    //I. Get content.
    dailyCount(data);
    //II. Build data for dailies.


    

  });



});