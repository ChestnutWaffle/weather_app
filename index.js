//jshint esversion:7

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));


const WEATHER_API_KEY = "3cc7aab936333063bbfce31ca1128996";
const GEO_API_KEY = "b96fed1ffa962c35406cf0a6b043f087";


var location = "NewDelhi,India";
var label = 'New Delhi, DL, India';

var lat = 28.557163;
var lon = 77.163665;



function hourlyGraphData(hourly, timezone_offset) {
  var times = [];
  var temps = [];
  var pressures = [];
  var humidities = [];
  var winds = [];
  var label =  ["Temperature (Celcius)", "Pressure (atm)", "% Humidity", "Wind Speed (m/sec)"];

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
    var timeRaw = new Date((hour.dt-19800+timezone_offset)*1000);
    var timeAtIns = timeRaw.toLocaleTimeString();
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
    var dataset = {
      label: label[j],
      data : data[j],
      backgroundColor: backgroundColors[j],
      borderColor: borderColors[j],
      borderWidth: 1
    };
    datasets.push(dataset);
  }



  var hourlyData = {
    labels: times,
    datasets: datasets,

  };

  return hourlyData;
}








app.route('/')
.get((req, res) => {

  location = "NewDelhi,India";
  label = 'New Delhi, DL, India';
  lat = 28.557163;
  lon = 77.163665;
  // console.log(label);
  var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${WEATHER_API_KEY}`;
  request(weatherUrl, function(err, response, body) {
        if (err) {
            res.render('index', { weather: null, error: 'Could not get weather data' });
        } else {
            let weather = JSON.parse(body);
            // console.log(weather);
            // console.log(label);
            var timeAtLoc = new Date((weather.current.dt-19800+weather.timezone_offset)*1000);
            var dateAtLoc = timeAtLoc.toLocaleDateString();
            var currentTime = timeAtLoc.toLocaleTimeString();
            var hourlyData = hourlyGraphData(weather.hourly, weather.timezone_offset);
            res.render('index',
              {
                weather: weather,
                current: weather.current,
                label: label,
                time : currentTime,
                date : dateAtLoc,
                hourlyData: hourlyData
              });
          }
  });
})
.post((req,res) => {
  location = req.body.city;
  console.log(req.body.city);
  if (req.body.city === '') {
    res.redirect('/');
  } else {
  let geoCodingUrl = `http://api.positionstack.com/v1/forward?access_key=${GEO_API_KEY}&query=${location}`;
  request(geoCodingUrl, function(err, response, body) {
    if (err) {
      res.render('index', {weather: null , error: 'Could not get location. Please try again.'});
    } else {

        let geoData = JSON.parse(body);

        if (geoData.error) {
          res.redirect('/');
        } else {

        console.log(geoData);
        lat = geoData.data[0].latitude;
        lon = geoData.data[0].longitude;

        label = geoData.data[0].label;
        // console.log("longitude: "+lat+" longitude: "+ lon);

        let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${WEATHER_API_KEY}`;
        request(weatherUrl, function(err1, response1, body1) {
          if (err1) {
            res.render('index', { weather: null, error: 'Could not get weather data' });
          } else {
              let weather = JSON.parse(body1);
              // console.log(weather);
              // console.log(label);
              var timeAtLoc = new Date((weather.current.dt-19800+weather.timezone_offset)*1000);
              var dateAtLoc = timeAtLoc.toLocaleDateString();
              var currentTime = timeAtLoc.toLocaleTimeString();
              var hourlyData = hourlyGraphData(weather.hourly, weather.timezone_offset);
              res.render('index',
                {
                  weather: weather,
                  current : weather.current,
                  label: label,
                  time : currentTime,
                  date : dateAtLoc,
                  hourlyData: hourlyData
                });
            }
        });
}
}

  });
}
});


app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");

});
