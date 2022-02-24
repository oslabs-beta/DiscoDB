import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import React, { useEffect } from 'react';
// import db from './db'
import Dexie from 'dexie';

export default function Layout({ children }) {
  //temporay storage for props.
  const userNoteArr = [{_id: 'foobar', title: 'foo', content: 'bar'}, {_id: '123', title: 'foobar', content: 'I love pizza'}];

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
