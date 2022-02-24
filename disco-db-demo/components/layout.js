import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
// import db from './db'
import Dexie from 'dexie';
import React, { useEffect, useState } from 'react';

export default function Layout({ children }) {

  const [isLoading, setLoading] = useState(true);

  // Dexie test
  const db = new Dexie('myDatabase');
  db.version(1).stores({
    notes: '++id, _id, username, title, content, createdAt, updatedAt',
  });
  const userNote = {username: 'test1234', _id: 'asdf123123123', title: 'title', content: 'content', createdAt: [1234,'123',{test:'123'}], updatedAt: 12345};
  const { username, _id, title, content, createdAt, updatedAt } = userNote
  async function dexieTest() {
    const id = await db.notes.add({
      username,
      _id, 
      title, 
      content, 
      createdAt, 
      updatedAt
    })
    console.log('data added sucessfully', id);
  }
  const dexieQuery = async () => {
    const someFriends = await db.notes
    .where('username').equals('test1234').toArray();
    console.log('here is the data: ', someFriends);
  }
  const dexieDelete = async () => {
    const del = await db.notes
    .where('username').equals('test1234').delete();;
    console.log('cleared notes table', del);
  }

  dexieTest();
  dexieQuery();
  // dexieDelete();
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
      data.data.forEach((ele) => {
        // const userNote = {...ele};
        console.log(ele);
        userNoteArr.push(ele);
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
