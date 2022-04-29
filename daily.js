//jshint esversion:6


module.exports = function(daily, timezone_offset) {
  var times = [];
  var avgtemps = [];
  var mintemps = [];
  var maxtemps = [];
  var pressures = [];
  var humidities = [];
  var winds = [];
  var label =  ["Avg. Temperature (Celcius)", "Min. Temperature (Celcius)", "Max. Temperature (Celcius)", "Pressure (atm)", "% Humidity", "Wind Speed (m/sec)"];
  var types= ['line', 'line', 'line', 'bar', 'line', 'bar'];
  var yAxisID = "right-y-axis";

  var backgroundColors = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(155,234,54,0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',

            ];

  var borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(155,234,54,1)',
                'rgba(255, 159, 64, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',

            ];

  for (var i=0; i< 7; i++){
    var day = daily[i];
    var timeRaw = new Date((day.dt-19800+timezone_offset)*1000);
    var timeAtIns = timeRaw.toLocaleDateString();
    times.push(`${timeAtIns}`);

    avgtemps.push(((day.temp.min + day.temp.max) / 2).toFixed(2));
    mintemps.push(day.temp.min);
    maxtemps.push(day.temp.max);

    var pressure = day.pressure* 0.0009869233;
    pressures.push(pressure.toFixed(2));

    humidities.push(day.humidity);

    winds.push(day.wind_speed);
  }

  data = [avgtemps, mintemps, maxtemps, pressures, humidities, winds];

  var datasets = [];

  for(var j=0; j<6; j++) {
    var dataset ={};
    if( j == 3 || j == 5) {
      dataset = {
        type: types[j],
        label: label[j],
        data : data[j],
        backgroundColor: backgroundColors[j],
        borderColor: borderColors[j],
        borderWidth: 2,
        yAxisID: yAxisID
      };
    } else {
      dataset = {
        type: types[j],
        label: label[j],
        data : data[j],
        backgroundColor: backgroundColors[j],
        borderColor: borderColors[j],
        borderWidth: 2
      };
    }
    datasets.push(dataset);
  }



  var dailyData = {
    labels: times,
    datasets: datasets,

  };

  return dailyData;
};
