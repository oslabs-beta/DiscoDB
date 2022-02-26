// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const responseModel = require('../models/responseModel');
const { createResponse } = require('../models/responseModel');
// require User object from db schema
const { Users } = require('../models/model');

// function to encrypt account password 
function encrypt(password) {
  const workFactor = 10;
  return bcrypt.hash(password, workFactor);
}

// auth middleware functions 
const authController = {
  
  signup(req, res, next) {
    console.log('this is in the authcontroller/signup: ', req.body)
    // encrypt password
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
            return next(err);
          }
          return next();
        })
      })
  },
  
  
  login(req, res, next) {
    console.log('this is in the authcontroller/login', req.body);
    const { username, password } = req.body;

    Users.findOne({ username: username }, 
      (err, result) => {
        
        //if user not found, there is no error but result is set to null
        //causing error when you try to destructure password from result
        if (result === null) {
          return res.status(406).json(createResponse(false, 406, 'Wrong username and/or password'));
        }
        if(err) {
          return next(err);
        }
        // destructure hashedPassword and compare to user's inputed password
        const { password: hashedPassword } = result;
        bcrypt.compare(password, hashedPassword, (err, bcryptRes) => {
          if (bcryptRes) {
             console.log('passwords match!'); 
            return next();
          } else {
             console.log('passwords do not match');  
            return res.status(406).json(createResponse(false, 406, 'Wrong username and/or password'));
          }
        })
      });
  }, 

  generateCookie(req, res, next) {

    const { username } = req.body;
    res.cookie('username', username, { httpOnly: true });
    return next();
  },

  logout(req, res, next) {
    res.clearCookie('username');
    return next();
  }
}; 




// logout 

module.exports = authController;