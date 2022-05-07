//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv');
const session = require('express-session');


dotenv.config();


const hourlyGraphData = require(__dirname + '/hourly.js');
const dailyGraphData = require(__dirname + '/daily.js');

const app = express();

app.use(session({
  secret: 'ASFGEHE',
  resave: true,
  saveUninitialized: true
}));
var ssn;

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));


const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const GEO_API_KEY = process.env.GEO_API_KEY;


var label = 'New Delhi, DL, India';

var lat = 28.557163;
var lon = 77.163665;




app.route('/')
  .get((req, res) => {
    ssn = req.session
    if (!(ssn.label || ssn.lat || ssn.lon)) {
      ssn.label = label;
      ssn.lat = lat;
      ssn.lon = lon;
    }
    // console.log(label);
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${ssn.lat}&lon=${ssn.lon}&exclude=minutely&units=metric&appid=${WEATHER_API_KEY}`;
    request(weatherUrl, function (err, response, body) {
      if (err) {
        res.render('index', { weather: null, error: 'Could not get weather data' });
      } else {
        let weather = JSON.parse(body);
        // console.log(weather.current);
        // console.log(label);
        var netOffset = weather.timezone_offset * 1000;
        var hourlyData = hourlyGraphData(weather.hourly, weather.timezone_offset);
        var dailyData = dailyGraphData(weather.daily, weather.timezone_offset);
        // console.log(dailyData.datasets);
        res.render('index',
          {
            weather: weather,
            current: weather.current,
            label: ssn.label,
            offset: netOffset,
            hourlyData: hourlyData,
            dailyData: dailyData
          });
      }
    });
  })
  .post((req, res) => {
    ssn = req.session;

    var location = req.body.city;
    // console.log(req.body.city);
    if (req.body.city === '') {
      ssn.label = label
      ssn.lat = lat;
      ssn.lon = lon;
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
            ssn.label = label
            ssn.lat = lat;
            ssn.lon = lon;
            res.redirect('/');
          } else {
            ssn.lat = geoData.data[0].latitude;
            ssn.lon = geoData.data[0].longitude;

            ssn.label = geoData.data[0].label;
            // console.log("longitude: "+lat+" longitude: "+ lon);
            res.redirect('/')
          }
        }
      });
    }
  });

  app.post('/location', (req, res) => {
    ssn = req.session;
    let data = req.body;

    if (data === '' || data === undefined) {
        res.redirect('/');
    } else {
        ssn.lat = data.lat;
        ssn.lon = data.lon;

        let revGeoUrl = `http://api.positionstack.com/v1/reverse?access_key=${GEO_API_KEY}&query=${ssn.lat},${ssn.lon}`;

        request(revGeoUrl, (err, response, body) => {
            if (err) {
                ssn.label = "New Delhi, DL, India";
                ssn.lat = 13.123123;
                ssn.lon = 23.213123;
                res.redirect('/');
            } else {
                let revGeoData = JSON.parse(body);
                if (revGeoData.error || revGeoData.data[0] === undefined) {
                    ssn.label = label
                    ssn.lat = lat;
                    ssn.lon = lon;
                    res.redirect('/');
                } else {
                    ssn.label = `Near ${revGeoData.data[0].label}`;
                    // console.log("longitude: "+lat+" longitude: "+ lon);
                    // res.redirect('/')
                    res.redirect('/');
                }
            }
        })
    }
})



app.listen(process.env.PORT || 3000, () => {
  // console.log("Listening on http://localhost:3000");

});
