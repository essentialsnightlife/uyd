import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';

import { supabaseClient } from '../../auth/client';
import Layout from './Layout';

const emailRedirectUrl = import.meta.env.VITE_EMAIL_REDIRECT_URL;

const handleLogin = async (email: string) => {
  try {
    const { data } = await supabaseClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: emailRedirectUrl,
      },
    });
    console.log(data);
    alert('Success: Check your email to login!');
  } catch (error) {
    console.log(error);
  }
};

function LoginMagicLink() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            handleLogin(email);
            setLoading(false);
          }}
        >
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email address here"
            fullWidth
          />
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              ':hover': {
                bgcolor: 'grey',
              },
            }}
          >
            {loading ? <span>Loading...</span> : 'Get Magic Link'}
          </Button>
        </form>
      </>
    </Layout>
  );
}

export default LoginMagicLink;
