import './App.css';

import { Session } from '@supabase/supabase-js';
import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { AnalysedDream } from '../../domains/analysedDreams/types';
import { AnalyserResponse } from './AnalyserResponse';
import { analyseDream, getUsersDreams, publishAnalysedDream } from './apis';
import { supabaseClient } from './auth/client';
import { DEFAULT_MAX_API_CALLS } from './constants';
import { DreamAnalyser } from './DreamAnalyser';
import { apiCallsLeft, formatterAnalysedDream, sortedAnalysedDreams } from './helpers';
import Layout from './Layout';
import LoginMagicLink from './LoginMagicLink';
import { PreviouslyAnalysedDreams } from './PreviouslyAnalysedDreams';

function Home() {
  const queryClient = new QueryClient();

  return (
    // For caching
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [analysedDreams, setAnalysedDreams] = useState<AnalysedDream[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        console.log(session);
        setSession(session);
      });

    const {
      data: { subscription },
    } = supabaseClient().auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id || '';
  const { data, isLoading } = useQuery('usersDreams', () => getUsersDreams(userId));

  useEffect(() => {
    const fetchAnalysedDreams = async () => {
      const responses = data?.responses;
      return responses || [];
    };

    fetchAnalysedDreams().then((analysedDreams) => {
      console.log('fetchingAnalysedDreams: ', analysedDreams);
      setAnalysedDreams(sortedAnalysedDreams(analysedDreams));
    });
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: FormEvent, query: string) => {
    e.preventDefault();
    try {
      if (apiCallsLeft(analysedDreams, DEFAULT_MAX_API_CALLS) > 0) {
        const dreamResponse = await analyseDream(query);
        console.log(dreamResponse);
        setResponse(dreamResponse);
        const analysedDream = formatterAnalysedDream({
          query,
          analysedDream: dreamResponse,
          session,
        });
        await publishAnalysedDream(analysedDream);
        setAnalysedDreams((prev) => [...prev, analysedDream]);
        if (apiCallsLeft(analysedDreams, DEFAULT_MAX_API_CALLS) === 1) {
          alert(`You have one more dream to analyse for today! 1️⃣`);
        }
      } else {
        alert(
          `You have reached your limit of ${DEFAULT_MAX_API_CALLS} analysed dreams per day 🙈. Please try again tomorrow!`,
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!session && process.env.NODE_ENV == 'production') {
    return <LoginMagicLink />;
  }

  return (
    <Layout title="Dream Analyser">
      <>
        <DreamAnalyser
          question={query}
          setQuestion={setQuery}
          onSubmit={handleSubmit}
          placeholderText="Describe your dream here..."
        />
        <AnalyserResponse nonResponseText={'...'} responseText={response} />
        <PreviouslyAnalysedDreams
          previousAnalysedDreams={analysedDreams}
          title="Your Analysed Dreams 📝"
        />
      </>
    </Layout>
  );
}

export default Home;
