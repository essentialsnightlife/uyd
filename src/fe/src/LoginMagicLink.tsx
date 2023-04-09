import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import Layout from './Layout';

function LoginMagicLink() {
  return (
    <Layout>
      <>
        <Typography
          sx={{
            mb: 2,
          }}
          variant="h6"
          component="h2"
          gutterBottom
        >
          Login with Magic Link
        </Typography>
        <form noValidate>
          <TextField label="Email" fullWidth />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              ':hover': {
                bgcolor: 'grey',
              },
            }}
          >
            Get Magic Link
          </Button>
        </form>
      </>
    </Layout>
  );
}

export default LoginMagicLink;
