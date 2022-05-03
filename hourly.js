//jshint esversion:6

module.exports = function(hourly, timezone_offset) {
  var times = [];
  var temps = [];
  var pressures = [];
  var humidities = [];
  var winds = [];
  var label =  ["Temperature (Celcius)", "Pressure (atm)", "% Humidity", "Wind Speed (m/sec)"];
  var yAxisID = "right-y-axis";
  var types = ['line', 'bar', 'line', 'bar'];

  var backgroundColors = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(155,234,54,0.2)'
            ];

  var borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(155,234,54,1)'
            ];

  for (var i=0; i< 24; i++){
    var hour = hourly[i];
    var timeRaw = new Date((hour.dt+timezone_offset)*1000);
    var timeAtIns = timeRaw.toLocaleTimeString('en-US', {timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    times.push(`${timeAtIns}`);

    temps.push(hour.temp);

    var pressure = hour.pressure* 0.0009869233;
    pressures.push(pressure.toFixed(2));

    humidities.push(hour.humidity);

    winds.push(hour.wind_speed);
  }

  data = [temps, pressures, humidities, winds];

  var datasets = [];

  for(var j=0; j<4; j++) {
    var dataset = {};
    if (j == 1 || j==3) {
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
      borderWidth: 2,
    };
  }
    datasets.push(dataset);
  }



  var hourlyData = {
    labels: times,
    datasets: datasets,

  };

  return hourlyData;
};
