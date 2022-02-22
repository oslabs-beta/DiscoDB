const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const db = require('./models/dbConnection.js');
const cookieParser = require('cookie-parser');

const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const { sendData } = require('next/dist/server/api-utils');


app.prepare().then(() => {
  const server = express();

  // establish connection to our MongoDB cluster
  // validate this is necessary
  db.connection();

  server.use(cookieParser());
  server.use(express.json());
  server.use('/auth', authRouter);
  server.use('/user', userRouter);

  server.get('/', (req, res) => {
    console.log('this is to the root endpoint');
    return handle(req, res);
  });

  // server.all('*', (req, res) => {
  //   console.log('this is a request to the server');
  //   return handle(req, res);
  // });

  // local error handler
  server.use((req, res) => {
    res.status(404).send('Not Found')
  });

  // global error handler
  server.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

module.exports = app;