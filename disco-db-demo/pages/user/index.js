import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Weather from '../../components/Weather';

export default function User() {
  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
        <Navbar />
        <Sidebar />
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