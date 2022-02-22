const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

// Do we need this? Or will it be handled by nextJS?
router.get('/login', 
  (req, res) => {
    res.sendStatus(200);
});

// Authenticate user using bcrypt. Send error if not valid. Send session cookie once validated.
router.post('/login', 
  // encryption (bCrypt) middleware
  // user database query middleware
  // sendCookie middleware
  (req, res) => {
    return res.send(200).json(res.locals);
});

// Do we need this? Or will it be handled by nextJS?
router.get('/signup', 
  // () => {console.log(req)}, 
  (req, res) => {
    res.sendStatus(200);
});

// Checks if username is valid. Send error if not valid. Once successfully signed up, automatically logs in user and sends session cookie
// check username middleware
// create entry in user database middleware
// encryption (bCrypt) middleware
// user database query middleware
// sendCookie middleware
router.post('/signup', authController.signup, 
  (req, res) => {
    res.send(200).json(res.locals);
});

router.get('/logout', 
// end session and clear cookies middleware
  (req, res) => {
    res.sendStatus(200);
});

module.exports = router;