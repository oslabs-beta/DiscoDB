const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const db = require('./models/dbConnection.js');

const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const apiRouter = require('./routers/apiRouter');


app.prepare().then(() => {
  const server = express();

  // Allows server to process incoming JSON, form data into the req.body, cookies
  server.use(express.json());
  server.use(express.urlencoded({extended: true}));
  server.use(cookieParser()); // add cookieParser in when cookies implemented

  // establish connection to our MongoDB cluster
  // validate this is necessary while testing authRouter
  db.connection();

  server.use('/auth', authRouter);
  server.use('/user', userRouter);
  server.use('/api', apiRouter);

  server.get('/test', (req, res) => {
    console.log('testing using postman');
    return res.sendStatus(200);
  })

  server.get('/', (req, res) => {
    console.log('this is to the root endpoint');
    return handle(req, res);
  });

  server.all('*', (req, res) => {
    console.log('this is a request to the server');
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

module.exports = app;