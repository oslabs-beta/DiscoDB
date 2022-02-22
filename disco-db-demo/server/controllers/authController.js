const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const workFactor = 10;
const responseModel = require('../models/responseModel');
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
          first_name: req.body.firstName, // double check firstName on req.body
          email: req.body.email 
        },
        (err, result) => {
          if (err) {
            console.log('Error:', err);
            return next(err);
          }
          console.log('result in signup:', result);
          // res.locals.success = true;
          console.log('res.locals:', res.locals);
          // add to res.locals
          return next();
        })
      })
  },
  
  
  login(req, res, next) {
    console.log('login', req.body);
    const { username, password } = req.body;

    Users.findOne({ username: username }, 
      (err, result) => {
        if(err) {
          return next(err);
        }
        if (!result) {
          // return an error message?? Will we hit this ever? Is this even distinct from if(err) above? 
          console.log('No result object')
          // return next('')
        }
        const { password: hashedPassword } = result;
        console.log(result);
        bcrypt.compare(password, hashedPassword, (err, bcryptRes) => {
          if (bcryptRes) {
            console.log('passwords match!'); 
            return next();
          } else {
            console.log('passwords do not match');  
            return res.status(406).json(responseModel(false, 406, 'Wrong username and/or password', res.locals));
          }
        })
      });
  }, 

  generateCookie(req, res, next) {
    
  }

}; 


// generate cookie
  // set a cookie 



// logout 

module.exports = authController;