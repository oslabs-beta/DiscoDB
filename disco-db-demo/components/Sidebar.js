import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import NotesIcon from '@mui/icons-material/Notes';
import { Button } from '@mui/material';

const drawerWidth = 240;

export default function SideBar(props) {
const router = useRouter();
const [noteArray, setNewNote] = useState([]);
// const [clickedNote, setClickedNote] = useState("");
//Saves all notes as buttons for user on front-end for later access.
const sidebarArray = [];
//On initial render, invoke useEffect to grab all notes on props pertaining to user.
//Populate the notes in an array and update state to reflect.
console.log(props.usernotes)
  useEffect(() => {
    props.usernotes.forEach((ele) => {
    //usernote has entire object per note for user
    const userNoteButton = <ListItem button id={ele._id}>
    <NotesIcon></NotesIcon>
    <ListItemText primary={ele.title}/>
    </ListItem>
  //Convert each usernote into a button and push in array for useState.
    sidebarArray.push(userNoteButton);
    })
    setNewNote([...sidebarArray])
  }, [])

  function newNoteHandler(){
    //POST request to user/notes with object of {username: username, createdAt: unix time}
    //Expect response of res.locals.data = {_id:id}
    //Poplate note array with a new icon with unique ID
    const newNoteInfo = {
      username: "username",
      createdAt: Math.round((new Date()).getTime() / 1000)
    }
    const testURL = '/api/hello';
    const devURL = '/user/notes';
    fetch(testURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNoteInfo),
    })
    .then(res => res.json())
    .then((data) => {
      // const uniqId = data.data._id;
      const ranNum = Math.ceil(Math.random() * 10)
      const newNote = 
          <ListItem button id={ranNum} onClick={currNoteHandler}>
            <NotesIcon></NotesIcon>
            <ListItemText primary="Untitled Note..."/>
          </ListItem>
      setNewNote([...noteArray, newNote])
    })
    .catch((err) => {return console.log('Error', err)});
  };

  //Click handler to obtain ID attribute and shallow route to the note.
  function currNoteHandler (e){
    const targetId = e.currentTarget.id
    router.push(`/user/notes?${targetId}`, undefined, {shallow: true});
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <Button variant="outlined" onClick={newNoteHandler}>New Note</Button>
        <Divider />
        <List>
          {noteArray}
        </List>
      </Drawer>
    </Box>
  );
}
