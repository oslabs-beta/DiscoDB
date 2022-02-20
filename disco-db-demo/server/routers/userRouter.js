const express = require('express');
const router = express.Router();

router.get('/', 
  // database query for user specific notes middleware
  (req, res) => {
    res.send(200).json(res.locals);
});

// Create a new entry in notes database. Send back unique id for the new entry
router.post('/notes', 
  // new entry in notes database middleware
  // get entry in notes database middleware
  (req, res) => {
    res.send(200).json(res.locals);
});

// Modify an entry in notes database. Send back all data related to the updated entry
router.patch('/notes', 
  // modify entry in notes database middleware
  // get entry in notes database middleware
  (req, res) => {
    res.send(200).json(res.locals);
});

// Delete an entry in notes database.
router.delete('/notes', 
  // delete entry in notes database middleware
  (req, res) => {
    res.sendStatus(200);
});

module.exports = router