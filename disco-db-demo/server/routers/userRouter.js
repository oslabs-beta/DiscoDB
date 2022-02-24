const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

//commenting this out so nextjs routes to page without having to login/signup each time
// router.get('/', 
//   userController.getUserNotes,
//   (req, res) => {
//     return res.status(200).json(res.locals);
// });

router.get('/load', 
  userController.getUserNotes,
  (req, res) => {
    return res.status(200).json(res.locals);
});

// Create a new entry in notes database. Send back unique id for the new entry
router.post('/notes', 
  userController.createAndGetNewNote,
  (req, res) => {
    return res.status(200).json(res.locals);
});

// Modify an entry in notes database. Send back all data related to the updated entry
router.patch('/notes', 
  userController.modifyAndGetNote,
  (req, res) => {
    res.status(200).json(res.locals);
});

// Delete an entry in notes database.
router.delete('/notes', 
  userController.deleteNote,
  (req, res) => {
    res.sendStatus(200);
});

module.exports = router