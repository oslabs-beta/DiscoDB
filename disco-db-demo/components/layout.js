import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import React, { useEffect } from 'react';

export default function Layout({ children }) {
  //temporay storage for props.
  const userNoteArr = [{_id: 'foobar', title: 'foo', content: 'bar'}, {_id: '123', title: 'foobar', content: 'I love pizza'}];
  useEffect(() => {
    fetch('/user')
    .then((res) => {
      //Iterate thru retrived data and create a copy of each object into state array.
      console.log('this is in the layout useEffect: ', res.data);
      res.data.forEach((ele) => {
        const userNote = {...ele};
        userNotesArr.push(userNote);
      });
    })
    .catch((err) => console.log('Error in fetching data', err))
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex'}}>
        <CssBaseline />
          <Navbar />
          <Sidebar usernotes={userNoteArr}/>
          <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign:'left' }}>
            <Toolbar />
              {children}
          </Box>
        </Box>
    </>
  )
}
