import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Footer from './Footer';
import {ReactElement} from "react";

export default ({ children }: { children: ReactElement }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dream Analyser
        </Typography>
        <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
          ☁️ Start here | 🧠 Use your dreams
        </Typography>
      </Box>
      {children}
      <Footer />
    </Container>
  );
};
