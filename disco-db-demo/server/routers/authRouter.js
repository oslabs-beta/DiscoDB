const express = require('express');
const router = express.Router();

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
  (req, res) => {
    res.sendStatus(200);
});

// Checks if username is valid. Send error if not valid. Once successfully signed up, automatically logs in user and sends session cookie
router.post('/signup', 
  // check username middleware
  // create entry in user database middleware
  // encryption (bCrypt) middleware
  // user database query middleware
  // sendCookie middleware
  (req, res) => {
    res.send(200).json(res.locals);
});

router.get('/logout', 
// end session and clear cookies middleware
  (req, res) => {
    res.sendStatus(200);
});

module.exports = router;