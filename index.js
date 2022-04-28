//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));


const API_KEY = "3cc7aab936333063bbfce31ca1128996";

var current = null;

app.route('/')
.get((req, res) => {
  res.render('index', {current : current});
})
.post((req,res) => {

  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=17.495556&lon=78.564319&exclude=hourly&appid=${API_KEY}`;
  request(url, function(err, response, body) {
        // On return, check the json data fetched
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body);
            console.log(weather);
          }
  });
  res.redirect('/');
});


app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");

});
