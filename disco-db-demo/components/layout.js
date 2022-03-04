import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { dexieTest, dexieQuery, dexieDelete } from './db'
import React, { useEffect, useState } from 'react';

export default function Layout({ children }) {

  const [isLoading, setLoading] = useState(true);

  //pass in to use effect from /api/hello for testing
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
      console.log('this is in the layout useEffect: ', data);
      console.log('username', localStorage.getItem('user'));
      // delete all user related data in indexDB using Dexie
      // need to revisit later to see if delete query works with multiple users in username array
      dexieDelete([localStorage.getItem('user')]);
      data.data.forEach((ele) => {
        // const userNote = {...ele};
        console.log(ele);
        userNoteArr.push(ele);
        // add data to indexedDB using Dexie
        const { username, _id, title, content, createdAt, updatedAt } = ele
        dexieTest(username, _id, title, content, createdAt, updatedAt);
      });
        setNewNote(userNoteArr);
        console.log('noteArray: ', noteArray);
        setLoading(false);
        setRefresh(false);
    })
    .catch((err) => console.log('Error in fetching data', err))
  }, [refresh]);

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
