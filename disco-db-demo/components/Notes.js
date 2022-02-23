import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

export default function NotesContainer(props) {
  return (
    <Container component="main">
      <CssBaseline />
        <Box sx={{ width: 500, maxWidth: '100%', }}>
          <Box component="form" sx={{ mt: 1}}>
            <TextField
              fullWidth
              label="Note Title"
              name="noteTitle"
            />
            <TextField
              fullWidth
              label="Note Content"
              // value={prop.content}
              name="noteContent"
              multiline
              rows={8}
            />
          </Box>
        </Box>
    </Container>
  )
}