//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv');

dotenv.config();


const hourlyGraphData = require(__dirname + '/hourly.js');
const dailyGraphData = require(__dirname + '/daily.js');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));


const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const GEO_API_KEY = process.env.GEO_API_KEY;


var location = "NewDelhi,India";
var label = 'New Delhi, DL, India';

var lat = 28.557163;
var lon = 77.163665;




app.route('/')
  .get((req, res) => {

    location = "NewDelhi,India";
    label = 'New Delhi, DL, India';
    lat = 28.557163;
    lon = 77.163665;
    // console.log(label);
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${WEATHER_API_KEY}`;
    request(weatherUrl, function (err, response, body) {
      if (err) {
        res.render('index', { weather: null, error: 'Could not get weather data' });
      } else {
        let weather = JSON.parse(body);
        // console.log(weather);
        // console.log(label);
        var date = new Date();
        var offset = date.getTimezoneOffset();
        var netOffset = (offset * 60 + weather.timezone_offset) * 1000;
        var hourlyData = hourlyGraphData(weather.hourly, weather.timezone_offset);
        var dailyData = dailyGraphData(weather.daily, weather.timezone_offset);
        // console.log(dailyData.datasets);
        res.render('index',
          {
            weather: weather,
            current: weather.current,
            label: label,
            offset: netOffset,
            hourlyData: hourlyData,
            dailyData: dailyData
          });
      }
    });
  })
  .post((req, res) => {
    location = req.body.city;
    // console.log(req.body.city);
    if (req.body.city === '') {
      label = 'New Delhi, DL, India';
      lat = 28.557163;
      lon = 77.163665;
      res.redirect('/');
    } else {
      let geoCodingUrl = `http://api.positionstack.com/v1/forward?access_key=${GEO_API_KEY}&query=${location}`;
      request(geoCodingUrl, function (err, response, body) {
        if (err) {
          res.render('index', { weather: null, error: 'Could not get location. Please try again.' });
        } else {

          let geoData = JSON.parse(body);
          // console.log(geoData);
          if (geoData.error || geoData.data[0] === undefined) {
            label = 'New Delhi, DL, India';
            lat = 28.557163;
            lon = 77.163665;
            res.redirect('/');
          } else {
            lat = geoData.data[0].latitude;
            lon = geoData.data[0].longitude;

            label = geoData.data[0].label;
            // console.log("longitude: "+lat+" longitude: "+ lon);

            let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${WEATHER_API_KEY}`;
            request(weatherUrl, function (err1, response1, body1) {
              if (err1) {
                res.render('index', { weather: null, error: 'Could not get weather data' });
              } else {
                let weather = JSON.parse(body1);
                // console.log(weather);
                // console.log(label);
                var date = new Date();
                var offset = date.getTimezoneOffset();
                var netOffset = ((offset * 60) + weather.timezone_offset) * 1000;
                var hourlyData = hourlyGraphData(weather.hourly, weather.timezone_offset);
                var dailyData = dailyGraphData(weather.daily, weather.timezone_offset);
                // console.log(dailyData.datasets[0].yAxisID);
                res.render('index',
                  {
                    weather: weather,
                    current: weather.current,
                    label: label,
                    offset: netOffset,
                    hourlyData: hourlyData,
                    dailyData: dailyData
                  });
              }
            });
          }
        }
      });
    }
  });


app.listen(process.env.PORT || 3000, () => {
  // console.log("Listening on http://localhost:3000");

});
