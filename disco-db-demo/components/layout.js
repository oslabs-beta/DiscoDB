import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import React, { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [isLoading, setLoading] = useState(true);
  const userNoteArr = [];
  const [online, setOnline] = React.useState(true);
  const [noteArray, setNewNote] = useState([]);
  const [refresh, setRefresh] = useState(false);
  //passing online prop to all children
  const childrenWithProps = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { online: online, data: noteArray, setNewNote: setNewNote, setRefresh: setRefresh });
    }
    return child;
  });



  useEffect(() => {

    const testURL = '/api/hello';
    const devURL = '/user/load';
    fetch(devURL)
    .then((res) => res.json())
    .then( (data) => {
      //Iterate thru retrived data and create a copy of each object into state array.
      data.data.forEach((ele) => {
        userNoteArr.push(ele);
      });
        setNewNote(userNoteArr);

        setLoading(false);
        setRefresh(false);

    })
    .catch((err) => console.log('Error in fetching data', err))
  }, [refresh, online]);

  if (isLoading) return null;
  else {
  return (
      <>
        <Box sx={{ display: 'flex'}}>
          <CssBaseline />
            <Navbar online={online} setOnline={setOnline}/>
            <Sidebar setNewNote={setNewNote} noteArray={noteArray} setRefresh={setRefresh}/>
            <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign:'left' }}>
              <Toolbar />
                {childrenWithProps}
            </Box>
          </Box>
      </>
    )
  }
}
