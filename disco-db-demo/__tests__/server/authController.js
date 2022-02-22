// import the exported module from ./server/controllers/authController.js
import authController from '../../server/controllers/authController';
const db = require('../../server/models/dbConnection')
const mongoose = require('mongoose');
const { Users, Notes } = require('../../server/models/model');


describe('Auth Controller', () => {
  const deleteTestUsers = () => {
    Users.deleteOne({username: 'testUser1'});
    Users.deleteOne({username: 'testUser2'});
  }
  const setExistingUser = user1 => {
    return user1 = {username: 'testUser1'}
  }
  // needed? beforeAll? 
  // beforeEach(() => {
  //  
  // })
  berforeAll(() => {
    db.connection();
    deleteTestUsers();
  })
    

  // afterEach? afterAll? 
  // drop the record(s) that were just created 

  describe('Sign up ', () => {
    // declare a test req.body object with a test username and password 
      // it should hash the password 
      // it should create the new user with password in the db 
      // it should reject a username if it is not unique 

    it('', () => {
      // 
      // expect
    });
    
    it('', () => {
      // 
      // expect
    });
      
    // after each
      // remove the user just created via Delete operation  
  });


  // before
    // create a test user 

  // describe('Log in', )
    // it should log in the test user 
    // it should return the appropriate error message if password incorrect 
    // it should return next() if password compare successful 
    // it should return error if no matching username found 

    // after 
      // delete the test user 
});