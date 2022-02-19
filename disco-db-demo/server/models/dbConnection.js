require('dotenv').config({path: '../../.env'});
const mongoose = require('mongoose');
const URI = process.env.DB_CONNECTION_STRING;


// unsure if the query method is what we call to query the DB 
// eric - changed to connection
// connection method invoked in server.js to establish connection, possibly not needed
module.exports = {
connection: function (){
  mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'demo' });
  mongoose.connection.once('open', ()=>{
  console.log('Connected to MongoDB');
    });
  }
}
