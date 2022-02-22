import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Weather from '../../components/Weather';

export default function User() {
  //temporay storage for props.
  const userNoteArr = [{_id: 'foobar', title: 'foo', content: 'bar'}, {_id: '123', title: 'foobar', content: 'I love pizza'}];
  useEffect(() => {
    fetch('/user')
    .then((res) => {
      //Iterate thru retrived data and create a copy of each object into state array.
      res.data.forEach((ele) => {
        const userNote = {...ele};
        userNotesArr.push(userNote);
      });
    })
    .catch((err) => console.log('Error in fetching data', err))
  }, []);

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
        <Navbar />
        <Sidebar usernotes={userNoteArr}/>
        <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign:'left' }}>
          <Toolbar />
            <Typography paragraph>
              Hello User
            </Typography>
            <Weather />
        </Box>
      </Box>
  )
}