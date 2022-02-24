import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layout from '../../components/layout';
import NotesContainer from '../../components/Notes';
import { useRouter } from 'next/router';

export default function Notes(props) {
  //grab query paramaters from note
  const router = useRouter();
  console.log(Object.keys(router.query));
  console.log(props);

  return (
    <Box>
        <Typography paragraph>
          User Notes
        </Typography>
        <NotesContainer data={props.data} setNewNote={props.setNewNote} noteArray={props.noteArray} setRefresh={props.setRefresh}/>
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