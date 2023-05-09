import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { ReactElement } from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

function Layout({ children, title }: { children: ReactElement; title: string }) {
  return (
    <Container maxWidth="sm">
      <Navbar />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
          ☁️ Start here | 🧠 Use your dreams
        </Typography>
      </Box>
      {children}
      <Footer />
    </Container>
  );
}

export default Layout;
