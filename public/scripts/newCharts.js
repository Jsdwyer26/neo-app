$(function() {

  //MomentJS.
  moment().format();

  var today = new moment().format("YYYY-MM-DD"),
      tomorrow = moment().add(1, 'day').format("YYYY-MM-DD");
  
  //Date variable for dev. purposes.
  var date = tomorrow;

  //HBS template = dailyTable-template.
  var source = $('#dailyTable-template').html();
  var template = Handlebars.compile(source);
  
  var dailyNeos = [],
          dataTable = [],
          dataPie = [],
          neoId = [];
  
  //NASA url's.
  var baseUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-11-27&end_date=2015-11-30&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
  var rootUrl = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + tomorrow + "&end_date=" + tomorrow + "&api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";

  //Build daily count display.
  function dailyCount(data) {
    var dailyNeoCount = data.element_count;

    $('#daily-count').append('<h3 class="text-center" id="count"> The Daily Asteroid Count Is: ' + '<strong>' + dailyNeoCount + '</strong></h3>');
  }

  //Build data to be shown on table and pie chart.
  function buildData(prop) {
    var dailies = dailyNeos[0][date];
    console.log(dailies);

    dailies.forEach(function(neo) {
      var value;
      value = neo.close_approach_data[0].miss_distance.miles;
      dataTable.push({
        name: neo.name,
        value: value
      });
      dataPie.push(
        [neo.name, value]
      );
      neoId.push(neo.neo_reference_id);

    });
    console.log(neoId);
  }

  //Set table contents. Called in GET.
  function setTableContents() {
    var dailyTableHtml = template({
        daily: dataTable
    });
    $("#dailyTable").append(dailyTableHtml);
  }
  //Make c3 pie chart. Pass in dataPie array as columns.
  function makeChart() {
    c3.generate({
        data: {
          columns: dataPie,
          type: 'bar'
        },
        axis: {
          x: {
            type: 'category'
          }
        },
        bar: {
          width: {
            ratio: 0.5
          }
        }
    });
  }

  //GET NASA daily data.
  $.get(rootUrl, function(data) {
    dailyNeos.push(data.near_earth_objects);
    dailyCount(data);
    buildData();
    setTableContents();
    makeChart();
  });

  //GET NASA data on each daily asteroid.
  function getIdData() {
    console.log(neoId);
    idUrl = "https://api.nasa.gov/neo/rest/v1/neo/" + 'id' + "?api_key=KjIyXoQcYUWnl10kdwABKaIVU65Hiy8vvlW44Y77";
    
  }
    getIdData();


});