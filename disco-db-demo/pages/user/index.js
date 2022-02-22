import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Weather from '../../components/Weather';
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