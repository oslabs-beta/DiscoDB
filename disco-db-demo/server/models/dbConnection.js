require('dotenv').config();
const mongoose = require('mongoose');
const URI = process.env.DB_CONNECTION_STRING;

module.exports = {
query: function (){
  mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'demo' });
  mongoose.connection.once('open', ()=>{
  console.log('Connected to MongoDB');
    });
  }
}
