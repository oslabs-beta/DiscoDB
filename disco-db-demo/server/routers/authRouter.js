const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const { createResponse } = require('../models/responseModel');

// Do we need this? Or will it be handled by nextJS?
// router.get('/login', 
//   (req, res) => {
//     res.sendStatus(200);
// });

// Authenticate user using bcrypt. Send error if not valid. Send session cookie once validated.
router.post('/login',
  authController.login,
  authController.generateCookie,
  (req, res) => {
    return res.status(200).json(createResponse(true, 200, 'Login successful'));
});

// Do we need this? Or will it be handled by nextJS?
// router.get('/signup',  
//   (req, res) => {
//     return res.sendStatus(200);
// });

// Checks if username is valid. Send error if not valid. Once successfully signed up, automatically logs in user and sends session cookie
router.post('/signup', 
  authController.signup, 
  authController.generateCookie,
  (req, res) => {
    return res.status(200).json(createResponse(true, 200, 'Signup successful'));
});

// end session and clear cookies middleware
router.get('/logout', authController.logout,
  (req, res) => {
    return res.status(200).json(createResponse(true, 200, 'Logout successful'));
});

module.exports = router;