const request = require('supertest');
// const app = require('../server/server.js');

const app = 'http://localhost:3000';

describe('api testing', ()=>{
  it('Get the home page', () => {
    return request(app)
      .get('/')
      .expect(200)
  })
})