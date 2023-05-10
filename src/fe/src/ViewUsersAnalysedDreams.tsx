import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { AnalysedDream } from '../../domains/analysedDreams/types';
import { supabaseClient } from './auth/client';
import Layout from './Layout';
import { formatDate } from './PreviouslyAskedQuestions';

async function handleDeleteDream(dreamId: string) {
  try {
    const response = await fetch(
      'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/' + dreamId,
      {
        method: 'DELETE',
      },
    );
    const result = await response.json();
    if (result.error) {
      console.log(result.error);
      alert('Sorry, we could not delete your dream. Please try again.');
      return;
    }
    console.log('result', result);
    alert('Dream deleted! 👋');
    return result;
  } catch (err) {
    console.log('Error deleting dream');
    console.log(err);
  }
}

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

  const getUsersDreams = async () => {
    try {
      const response = await fetch(
        'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/' +
          // session?.user?.id ||
          'user123',
      );
      const result = await response.json();
      console.log('result', result);
      return result;
    } catch (err) {
      console.log(err);
      alert("Sorry, we couldn't get your dreams. Please refresh the page.");
    }
  };

  const { isLoading, data } = useQuery({
    queryKey: ['getUsersDreams'],
    queryFn: getUsersDreams,
  });

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
      const responses = data?.responses;
      return responses || [];
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
                        await handleDeleteDream(dreamId);
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
