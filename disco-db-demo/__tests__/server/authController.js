// import the exported module from ./server/controllers/authController.js
import authController from '../../server/controllers/authController';
const db = require('../../server/models/dbConnection')
// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Users, Notes } = require('../../server/models/model');


describe('Auth Controller', () => {
  const deleteTestUsers = () => {
    Users.deleteOne({username: 'testUser1'});
    Users.deleteOne({username: 'testUser2'});
  }
  const setExistingUser = username => {
    return user1 = {username: username}
  }

  const mockRequest = (username, password) => {
    return {body: {username: username, password: password}}
  }

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const encrypt = (password, workFactor) => {
    return bcrypt.hash(password, workFactor);
  }

  berforeAll(() => {
    db.connection();
    deleteTestUsers();
    const workFactor = 10;
    const username = 'testUser1';
    const password = 'test123';
    const encryptPW = encrypt(password, workFactor);
  })
    
  // afterEach? afterAll? 
  // drop the record(s) that were just created 

  describe('Sign up ', async () => {
    // declare a test req.body object with a test username and password 
    const req = mockRequest(username, password);
    const res = mockResponse();
    await authController.signup(req, res)
      // it should hash the password 
      it('Should hash the password', () => {
        expect(res.locals.password).toBe(encryptPW)
      })
      // it should create the new user with password in the db 
      // it should reject a username if it is not unique 
  
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