const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const workFactor = 10;

// function to encrypt account password 
function encrypt(password) {
  const workFactor = 10;
  return bcrypt.hash(password, workFactor);
}

// define auth middlewares 
const authController = {}; 

// router.post('/login', 
  // encryption (bCrypt) middleware
  // user database query middleware
  // sendCookie middleware


// router.post('/signup', 
  // check username middleware
  // create entry in user database middleware
  // encryption (bCrypt) middleware
  // user database query middleware
  // sendCookie middleware


// middleware functions 


// login 
  // destructure req.body
  // Read query to db 
  // then 
    // if error, return next(err);
    // if query result.rows.length === 0, return next() with error code of not authenticated
    // destructure hashed password and username from result.rows
    // bcrypt compare 
      // if success, return next()
      // if not success, reutnr next() with error code of not auth'd 

// signup 
  // call encrypt(req.body.password)
    // then 

// generate cookie
  // set a cookie 