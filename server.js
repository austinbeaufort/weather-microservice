const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Influx = require('influx');
const axios = require('axios');

// CONNECT TO DATABASE
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'weather'
});

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
app.get('/api/weather', showWeatherData);
app.post('/api/weather', saveWeatherToInflux);

function showWeatherData(req, res) {
    influx.query(`select * from weather`)
    .then(results => {
        res.send(JSON.stringify(results));
    })
}

function saveWeatherToInflux(req, res) {
    influx.writePoints([
        {
            measurement: "weather",
            tags: { location: req.body.name},
            fields: {
                currentForecast: req.body.currentForecast,
                currentTemp: req.body.currentTemp,
                windSpeed: req.body.windSpeed
            }
        }
    ])
    console.log(`weather recieved at ${Date().toString()}`);
}


// LISTEN
const port = 3000 || process.env.PORT;

app.listen(port, () => console.log(`Listening on port ${port}`));







// MANUALLY POST WEATHER TO DB VIA POSTMAN
// app.post('/api/weather', saveWeather);

// function saveWeather(req, res) {

//     influx.writePoints([
//         {
//             measurement: 'forecast_7day',
//             tags: { day: req.body.day },
//             fields: { high: req.body.high, low: req.body.low, forecast: req.body.forecast }
//         }
//     ])

//     influx.query(`select * from forecast_7day`)
//     .then(results => {
//         res.send(JSON.stringify(results));
//     })
// }