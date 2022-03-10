const { Notes } = require('../models/model');
const userController = {};

// get all user notes from Notes collection
userController.getUserNotes = (req, res, next) => {
  const {username} = req.cookies;
  // const {username} = req.body;
  console.log('Retrieving all notes from username: ', username)
  Notes.find({username: username})
    .then(data => {
      console.log(data);
      res.locals.data = data;
      return next();
    })
    .catch(err => {
      return next(err);
    })
}

// create a new notes entry in Notes collection
userController.createAndGetNewNote = (req, res, next) => {
  const {username, createdAt} = req.body;
  console.log('Creating a new note for username: ', username)
  Notes.create({username: [username], title: '', content: '', updatedAt: createdAt, createdAt: createdAt})
    .then(data => {
      console.log(data);
      res.locals.data = data;
      return next();
    })
    .catch(err => {
      return next(err);
    })
}

// modifies an entry in Notes collection
userController.modifyAndGetNote = (req, res, next) => {
  const {_id, title, content, updatedAt} = req.body;
  console.log('Modifying note _id: ', _id)
  Notes.findByIdAndUpdate(_id, {title: title, content: content, updatedAt: updatedAt}, {new: true})
    .then(data => {
      console.log(data);
      res.locals.data = data;
      return next();
    })
    .catch(err => {
      return next(err);
    })
}

// deletes an entry in Notes collection
userController.deleteNote = (req, res, next) => {
  const {_id, username} = req.body;
  console.log('Deleting note _id: ', _id)
  Notes.deleteOne({_id: _id})
    .then(data => {
      console.log('Note successfully deleted')
      return next();
    })
    .catch(err => {
      return next(err);
    })
}

module.exports = userController;