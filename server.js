// ================================================================
// tools
// ================================================================
const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const port = 3000;

const app = express()

// ================================================================
// setup express application
// ================================================================
const ApiKey = process.env.API_KEY;
	// console.log(ApiKey);
const baseUrl = "http://api.wunderground.com/api/" + ApiKey + "/forecast10day/geolookup/conditions/hourly/q/"
	// console.log(baseUrl);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

// ================================================================
// setup routes
// ================================================================
app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
	var state = req.body.state;
	var city = req.body.city;
	var url = baseUrl + state + '/' + city + '.json';
	var radarUrl = "http://api.wunderground.com/api/"+ ApiKey +"/animatedradar/animatedsatellite/q/"+ state +"/"+ city +".gif?num=6&delay=50&interval=30"

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.location == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
		let weatherData = weather;
        res.render('index', {weather: weatherData, radar: radarUrl, error: null});
      }
    }
  });
})

// ================================================================
// start our server
// ================================================================
app.listen(process.env.PORT || port, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});