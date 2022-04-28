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

var current = null;
var location = "NewDelhi,India";
var label = location;

var lat = 0;
var lon = 0;

app.route('/')
.get((req, res) => {
  console.log(label);
  res.render('index', {current : current, label: label});
})
.post((req,res) => {
  location = req.body.city;

  let geoCodingUrl = `http://api.positionstack.com/v1/forward?access_key=${GEO_API_KEY}&query=${location}`;
  request(geoCodingUrl, function(err, response, body) {
    if (err) {
      res.render('index', {weather: null , error: 'Could not get location. Please try again.'});
    } else {

        let geoData = JSON.parse(body);
        console.log(geoData);
        lat = geoData.data[0].latitude;
        lon = geoData.data[0].longitude;

        label = geoData.data[0].label;
        console.log("longitude: "+lat+" longitude: "+ lon);

        let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
        request(weatherUrl, function(err1, response1, body1) {
              if (err1) {
                  res.render('index', { weather: null, error: 'Could not get weather data' });
              } else {
                  let weather = JSON.parse(body1);
                  console.log(weather);
                  console.log(label);
                  res.render('index', {current : current, label: label});

                }
        });
      }
  });
});


app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");

});
