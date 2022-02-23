const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController')
const { createResponse } = require('../models/responseModel');

router.post('/weather', 
  weatherController.getWeather,
  (req, res) => {
    return res.status(200).json(createResponse(true, 200, 'city not found', res.locals));
});

module.exports = router;