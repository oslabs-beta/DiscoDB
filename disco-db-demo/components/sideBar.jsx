import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Button } from '@mui/material';
import NoteContainer from './NoteContainer';

const drawerWidth = 240;

export default function SideBar() {
const [noteArray, setNewNote] = useState([]);
const [clickedNote, setClickedNote] = useState("");
//Saves all notes for user on front-end for later access.
const userNotesArray = [];
const example = [{title: 'foo', content: 'bar'}, {title: 'fizz', content: 'buzz'}]
//On initial render, invoke useEffect to grab all notes pertaining to user.
//Populate the notes in an array and update state to reflect.
useEffect(() => {
  fetch('/user')
  .then((res) => {
    const userNoteArr = [];
    res.data.forEach((ele) => {
      //usernote has entire object per note for user
      const userNote = {...ele};
      userNotesArray.push(userNote);
      const noteButton = <ListItem button id={ele._id}>
      <ListItemText primary={ele.title}/>
    </ListItem>
    //Convert each usernote into a button and push in array for useState.
      userNoteArr.push(noteButton);
    });
    useState([...userNoteArr])
  })
  .catch((err) => console.log('Error in fetching data', err))
}, []);

  function newNoteHandler(){
    //make POST request to user/notes with object of {username: username, cratedAt: unix time}
    //after post req, expect response of res.locals.data = {_id:id}
    //poplate note array with a new icon with unique ID
    const newNoteInfo = {
      username: "username",
      createdAt: Date.now()
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
      const uniqId = data.data;
      const ranNum = Math.ceil(Math.random() * 10)
      const newNote = <ListItem button id={ranNum} onClick={currNoteHandler}>
        <ListItemText primary="Untitled Note..."/>
      </ListItem>
      setNewNote([...noteArray, newNote])
    })
    .catch((err) => {return console.log('Error', err)});
  };
  //Create a click handler to update values in paragraph 
  //Not sure where to save notes data on inital GET request.
  //will make another get request to get info
  function currNoteHandler (e){
    console.log(e.currentTarget.id);
    const targetId = e.currentTarget.id
    //grab note content regarding id
    //populate the content onto a component and append onto page
    setClickedNote(<NoteContainer id={targetId} note={example}/>)
    userNotesArray.forEach((ele) => {
      if(ele._id === targetId){
        setClickedNote(<NoteContainer id={targetId} note={ele}/>)
      }
    })
  }
  //Create a click handler to access a button's id thru e.target.attribute

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Placeholder Title
          </Typography>
        </Toolbar>
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
          {/* {noteArray.map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
          {noteArray}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
        {/* <Typography paragraph> */}
          {clickedNote}
        {/* </Typography> */}
      </Box>
    </Box>
  );
}
