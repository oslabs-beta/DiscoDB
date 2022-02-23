import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layout from '../../components/layout';
import NotesContainer from '../../components/Notes';

export default function Notes() {
  return (
    <Box>
        <Typography paragraph>
          User Notes
        </Typography>
        <NotesContainer />
    </Box>
  )
}

Notes.getLayout = function getLayout(notes) {
  return (
    <Layout>
      {notes}
    </Layout>
  )
}