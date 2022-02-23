const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  first_name: {type: String},
  email: {type: String}
});

const noteSchema = new Schema({
  username: {type: [String], required: true},
  title: {type: String},
  content: {type: String},

  // unsure if this date field is correctly written 
  createdAt: {type: Date},
  updatedAt: {type: Date}
})

// creating model objects
const Users = mongoose.model('user', userSchema);
const Notes = mongoose.model('note', noteSchema);

// exporting model object
module.exports = { Users, Notes }