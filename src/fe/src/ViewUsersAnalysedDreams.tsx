import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { AnalysedDream } from '../../domains/analysedDreams/types';
import { deleteDream, getUsersDreams } from './apis';
import { supabaseClient } from './auth/client';
import { formatDate, sortedAnalysedDreams } from './helpers';
import Layout from './Layout';

function ViewUsersAnalysedDreams() {
  const queryClient = new QueryClient();

  return (
    // For caching
    <QueryClientProvider client={queryClient}>
      <UsersAnalysedDreams />
    </QueryClientProvider>
  );
}

function UsersAnalysedDreams() {
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

  const userId = session?.user?.id || '';
  const { data, isLoading } = useQuery('usersDreams', () => getUsersDreams(userId));

  useEffect(() => {
    const fetchAnalysedDreams = async () => {
      const responses = data?.responses;
      return responses || [];
    };

    fetchAnalysedDreams().then((analysedDreams) => {
      console.log('data', analysedDreams);
      setAnalysedDreams(sortedAnalysedDreams(analysedDreams));
    });
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="Your Dreams">
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
                    component="h5"
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
                  <Typography variant="h6" component="h2" gutterBottom>
                    ANS: {analysedDream.response}
                  </Typography>
                  <Button
                    sx={{
                      mb: 6,
                    }}
                    onClick={async () => {
                      const dreamId = analysedDream.id;
                      console.log('dreamId', dreamId);
                      if (confirm('Are you sure you want to delete this dream?')) {
                        await deleteDream(dreamId);
                        setAnalysedDreams(
                          analysedDreams.filter((dream) => dream.id !== analysedDream.id),
                        );
                      }
                    }}
                  >
                    {'Delete?'}
                  </Button>
                </>
              );
            })}
        </Typography>
      </>
    </Layout>
  );
}

export default ViewUsersAnalysedDreams;
