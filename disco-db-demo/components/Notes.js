import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';

export default function NotesContainer(props) {

  //grab query paramaters from note - work in progress
  const router = useRouter();
  let noteID = Object.keys(router.query)[0];
  let noteTitle;
  let noteContent;

  // console.log(props);

  // for (let i = 0; i < props.data.length; i++) {
  //   if (props.data[i]._id === noteID) {
  //     noteTitle = props.data[i].title;
  //     noteContent = props.data[i].content;
  //   }
  // }

  console.log(noteTitle, noteContent);

  const handleSave = (event) => {
    event.preventDefault();

    const noteTitle = document.querySelector('[name="noteTitle"]');
    const noteContent = document.querySelector('[name="noteContent"]');


    const saveBody = {
      //grab id from query params
      _id: 'id',
      username: localStorage.user,
      title: noteTitle.value,
      content: noteContent.value,
      updatedAt: Date.now(),
    }
    
    const testURL = '/api/hello';
    const devURL = '/user/notes';
    fetch(testURL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveBody),
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success', data);
      //what do we do here on successful note update?

    })
    .catch(err => console.log('Error', err))
  };

  const handleDelete = (event) => {
    event.preventDefault();

    const deleteBody = {
      //grab id from query params
      _id: 'id',
      username: localStorage.user,
    }
    
    const testURL = '/api/hello';
    const devURL = '/user/notes';
    fetch(testURL, {
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

    })
    .catch(err => console.log('Error', err))
  };

  return (
    <Container component="main">
      <CssBaseline />
        <Box sx={{ width: 500, maxWidth: '100%', }}>
          <Box component="form" sx={{ mt: 1}}>
            {noteID
              ?
            <Box>
              <TextField
              fullWidth
              defaultValue={noteTitle}
              name="noteTitle"
              />
              <TextField
              fullWidth
              defaultValue={noteContent}
              name="noteContent"
              multiline
              rows={8}
              />
            </Box>
            :
            <>
              <TextField
              fullWidth
              label="Note Title"
              name="noteTitle"
              />
              <TextField
              fullWidth
              label="Note Content"
              name="noteContent"
              multiline
              rows={8}
              />
            </>
            }
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