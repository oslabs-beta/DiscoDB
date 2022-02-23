import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Weather from '../../components/Weather';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Layout from '../../components/layout';

export default function User() {

  return (
    <Box>
      <Typography paragraph>
        Hello User
      </Typography>
      <Weather />
    </Box>
  )
}

User.getLayout = function getLayout(user) {
  return (
    <Layout>
      {user}
    </Layout>
  )
}
