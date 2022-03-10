import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { useRouter } from 'next/router';

export default function Navbar(props) {
  const router = useRouter();

  const handleChange = (event) => {
    //will need to add logic for offline mode
    props.setOnline(event.target.checked);
  }

  //check for network connectivity
  window.addEventListener('offline', (event) => {
    props.setOnline(false);
  })
  window.addEventListener('online', (event) => {
    props.setOnline(true);
  })
  
  const handleLogout = (event) => {
    event.preventDefault();
    //sends GET request to auth/logout

    const testURL = '/api/hello';
    const devURL = '/auth/logout';

    fetch(testURL)
    .then(response => response.json())
    .then(data => {
      //clear out username in local storage when user logs off
      localStorage.clear();
      router.push('/auth/login');
    })
    .catch(error => console.log('Error', error));

  }
  return (
    <Box>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notes
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={props.online}
                  onChange={handleChange}
                  aria-label="online switch"
                  color="default"
                />
              }
              label={props.online ? 'Online' : 'Offline'}
            />
          </FormGroup>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}