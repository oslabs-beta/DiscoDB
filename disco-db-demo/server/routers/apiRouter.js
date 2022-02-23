const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController')
// const responseModel = require('../models/responseModel');

router.post('/weather', 
  weatherController.getWeather,
  (req, res) => {
    return res.status(200).json(res.locals);
});

module.exports = router;