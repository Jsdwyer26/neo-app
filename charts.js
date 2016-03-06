

// Make missChart.
function missChart(datesArr, valuesArr) {
    var preserveDatesArr = datesArr;
    var preserveValuesArr = valuesArr;
    // Add 'x' as element at i[0] for c3js.
    datesArr.unshift('x');
    preserveValuesArr.unshift('Miss Distance');
    var chart = c3.generate({
        bindto: '#missChart',
        size: {
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
module.exports = missChart;

// Make speedChart chart.
function speedChart(datesArr, valuesArr) {
    // Add 'x' as element at i[0] for c3js.
    datesArr.unshift('x');
    valuesArr.unshift('Speed');
    var chart = c3.generate({
      bindto: '#speedChart',
      size: {
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
          type: 'scatter'
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
module.exports = speedChart;



