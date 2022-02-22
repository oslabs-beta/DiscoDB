import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

export default function Layout({ children }) {
  return (
    <>
      <Box sx={{ display: 'flex'}}>
        <CssBaseline />
          <Navbar />
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, textAlign:'left' }}>
            <Toolbar />
              {children}
          </Box>
        </Box>
    </>
  )
}
