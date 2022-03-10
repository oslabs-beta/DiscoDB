const weatherController = {};
const axios = require('axios');
const { createResponse } = require('../models/responseModel');

const API_KEY = '90c77ec3042549f5cc0b7aa750034457'
const UNITS = 'imperial';
const LANG = 'en';

// make request to openweathermap API
weatherController.getWeather = (req, res, next) => {
  let CITY = req.body.city;
  const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${CITY}&lang=${LANG}&appid=${API_KEY}&units=${UNITS}`;
  axios({
    method: 'get',
    url: weatherURL,
  }).then(data => {
    console.log(data.data);
    res.locals = data.data;
    return next();
  })
  .catch(err => {
    return res.status(404).json(createResponse(false, 404, 'city not found'));
    // return next(err);
  })
}

module.exports = weatherController;
