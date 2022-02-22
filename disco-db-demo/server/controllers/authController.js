const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const workFactor = 10;

// require User object from db schema
const { Users, Notes } = require('../models/model');

// function to encrypt account password 
function encrypt(password) {
  const workFactor = 10;
  return bcrypt.hash(password, workFactor);
}

// auth middleware functions 
const authController = {
  
  signup(req, res, next) {
    // encrypt
    // console.log(req.body);
    encrypt(req.body.password)
      .then(hash => {
        Users.create({
          username: req.body.username, 
          password: hash,
          first_name: req.body.name,
          email: req.body.email 
        },
        (err, result) => {
          if (err) {
            console.log('Error:', err);
            return next(err);
          }
          console.log('result in signup:', result);
          res.locals.success = true;
          console.log('res.locals:', res.locals);
          // add to res.locals
          return next();
        })
      })
  }
  
  
  // login(req, res, next) {
  //   const { username, password } = req.body; 

  // }

}; 


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


// logout 

module.exports = authController;