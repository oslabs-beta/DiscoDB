import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

export default function NotesContainer(props) {


  console.log('current setTitle: ',props.setTitle)

  const handleTitle = (event) => {
    props.setNewTitle(event.target.value);
  };

  const handleContent = (event) => {
    props.setNewContent(event.target.value);
  }

  const formField = [
    <Box>
              <TextField
              fullWidth
              value={props.setTitle || ''}
              onChange={handleTitle}
              name="noteTitle"
              multiline
              rows={1}
              />
              <TextField
              fullWidth
              value={props.setContent || ''}
              onChange={handleContent}
              name="noteContent"
              multiline
              rows={8}
              />
            </Box>
  ]

  const handleSave = (event) => {
    event.preventDefault();

    const noteTitle = document.querySelector('[name="noteTitle"]');
    const noteContent = document.querySelector('[name="noteContent"]');


    const saveBody = {
      //grab id from query params
      _id: props.noteID,
      title: noteTitle.value,
      content: noteContent.value,
      updatedAt: Date.now(),
    }
    
    const testURL = '/api/hello';
    const devURL = '/user/notes';
    fetch(devURL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveBody),
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success, this is the patch response', data);
      //what do we do here on successful note update?

      props.setRefresh(true);
    })
    .catch((err) => {
      console.log('Error in patching notes:', err)
    }
  )};

  const handleDelete = (event) => {
    event.preventDefault();

    const deleteBody = {
      //grab id from query params
      _id: props.noteID,
      username: localStorage.user,
    }
    
    const testURL = '/api/hello';
    const devURL = '/user/notes';
    fetch(devURL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteBody),
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success', data);
      //should remove entry from array

      props.setRefresh(true);
    })
    .catch((err) => {
      console.log('Error in deleting notes:', err)
      props.setRefresh(true);
    })
  };

  return (
    <Container component="main">
      <CssBaseline />
        <Box sx={{ width: 500, maxWidth: '100%', }}>
          <Box component="form" sx={{ mt: 1}}>
            {formField}
            <Box component="div" sx={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button onClick={handleDelete} variant="outlined" color="error">
                {/* Delete click should open modal for verification - implement after MVP */}
                Delete
              </Button>
              <Button onClick={handleSave} variant="contained" sx={{ ml: 2}}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
    </Container>
  )
}
