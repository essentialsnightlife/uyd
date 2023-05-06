import Typography from '@mui/material/Typography';
import { useState } from 'react';
import * as React from 'react';

import { AnsweredQuery } from '../../domains/analysedDreams/types';
import Layout from './Layout';

function UsersDreams() {
  const [answeredQueries, setAnsweredQueries] = useState([]);
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
          Users Dreams
        </Typography>
      </>
    </Layout>
  );
}

export default UsersDreams;
