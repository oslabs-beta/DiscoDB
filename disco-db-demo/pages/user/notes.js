import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layout from '../../components/layout';
import NotesContainer from '../../components/Notes';
import { useRouter } from 'next/router';

export default function Notes(props) {
  //grab query paramaters from note
  const [setContent, setNewContent] = React.useState('');
  const [setTitle, setNewTitle] = React.useState('');

  const router = useRouter();
  let noteID = Object.keys(router.query)[0];

  React.useEffect(() => {
    for (let i = 0; i < props.data.length; i++) {
      if (props.data[i]._id === noteID) {
        setNewTitle(props.data[i].title);
        setNewContent(props.data[i].content);
      }
    }
    // setNewContent(noteContent)
    // setNewTitle(noteTitle)
  }, [props.data, noteID]);

  return (
    <Box>
        <Typography paragraph>
          User Notes
        </Typography>
        <NotesContainer data={props.data} setNewNote={props.setNewNote} setRefresh={props.setRefresh} setContent={setContent} setTitle={setTitle} noteID={noteID} setNewContent={setNewContent} setNewTitle={setNewTitle}/>
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