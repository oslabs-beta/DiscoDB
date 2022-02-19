const mongoose = require('mongoose');
const { Users, Notes } = require('./model');
require('dotenv').config();
const db = require('./dbConnection.js');

// mongoose.connect('mongodb+srv://discodb48:Codesmith@cluster0.p9y48.mongodb.net/DiscoDB?retryWrites=true&w=majority', 
//   { useNewUrlParser: true, 
//     useUnifiedTopology: true, 
//     dbName: 'demo' 
//   });

db.connection();

const userData = {
  username: 'testuser3',
  password: 'testpass3',
  first_name: 'testfirst',
  email: 'beep'
}

const noteData = { 
  username: 'testuser3',
  title: 'testnote3',
  content: 'jokes',
  createdAt: new Date(),
  updatedAt: new Date()
}

Users.insertMany(userData)
  .then(value => {
    console.log('user saved successfully');
  })
  .catch(error => {
    console.log(error);
  })

Notes.insertMany(noteData)
  .then(value => {
    console.log(' note saved successfully');
  })
  .catch(error => {
    console.log(error);
  })