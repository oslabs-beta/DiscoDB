const { resolveHref } = require('next/dist/shared/lib/router/router');
const request = require('supertest');
// const app = require('../server/server.js');

const app = 'http://localhost:3000';

// authRouter testing

// /auth/login
describe('userRouter /login testing', ()=>{
  it('Loads the login page', async () => {
    await request(app)
      .get('/auth/login')
      .expect(200)
  })

// // 
//   it('Successfully logs in a user', () => {
//     return request(app)
//       .post('/auth/login')
//       .send({username: 'test123', password: 'test123'})
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           reject(new Error ('An error occurred:', err))
//         }
//         resolve(res.body)
//       })
//   })
})