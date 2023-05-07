import Typography from '@mui/material/Typography';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { AnalysedDream } from '../../domains/analysedDreams/types';
import { supabaseClient } from './auth/client';
import Layout from './Layout';
import { formatDate } from './PreviouslyAskedQuestions';

function ViewUsersAnalysedDreams() {
  const [session, setSession] = useState<Session | null>(null);
  const [analysedDreams, setAnalysedDreams] = useState<AnalysedDream[]>([]);

  useEffect(() => {
    supabaseClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      });
    const {
      data: { subscription },
    } = supabaseClient().auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    const fetchAnalysedDreams = async () => {
      const response = await fetch(
        'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/' + 'user123',
        // + session?.user?.id,
      );
      const data = await response.json();
      return data.responses || [];
    };

    const sortedAnalysedDreams = (analysedDreams: AnalysedDream[]) =>
      analysedDreams!.sort((a, b) => {
        if (!a.date || !b.date) {
          return 0;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    fetchAnalysedDreams().then((data) => {
      console.log('data', data);
      setAnalysedDreams(sortedAnalysedDreams(data));
    });
  }, []);

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
          {analysedDreams &&
            analysedDreams.map((analysedDream) => {
              return (
                <>
                  <Typography
                    sx={{
                      mb: 2,
                    }}
                    variant="h6"
                    component="h2"
                    gutterBottom
                  >
                    {formatDate(analysedDream.date)}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 2,
                    }}
                    variant="h6"
                    component="h2"
                    gutterBottom
                  >
                    Q: {analysedDream.query}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 2,
                    }}
                    variant="h6"
                    component="h2"
                    gutterBottom
                  >
                    ANS: {analysedDream.response}
                  </Typography>
                </>
              );
            })}
        </Typography>
      </>
    </Layout>
  );
}

export default ViewUsersAnalysedDreams;
