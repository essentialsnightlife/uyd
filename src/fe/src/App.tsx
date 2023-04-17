import './App.css';

import { Session } from '@supabase/supabase-js';
import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';

import { AnalyserResponse } from './AnalyserResponse';
import { analyseDream, saveAnsweredQuery } from './apis';
import { supabaseClient } from './auth/client';
import { DreamAnalyser } from './DreamAnalyser';
import Layout from './Layout';
import LoginMagicLink from './LoginMagicLink';
import { PreviouslyAskedQuestions } from './PreviouslyAskedQuestions';
import { AnsweredQuery } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [previousAnsweredQueries, setPreviousAnsweredQueries] = useState<AnsweredQuery[]>(
    [],
  );
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

  const handleSubmit = async (e: FormEvent, query: string) => {
    e.preventDefault();
    try {
      const analysedDream = await analyseDream(query);
      console.log(analysedDream);
      setResponse(analysedDream);
      const answeredQuery = await saveAnsweredQuery({ session, query, analysedDream });
      console.log(answeredQuery);
      setPreviousAnsweredQueries((prev) => [...prev, answeredQuery.answeredQuery]);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  if (!session) {
    return <LoginMagicLink />;
  }
  return (
    <Layout>
      <>
        <DreamAnalyser
          question={query}
          setQuestion={setQuery}
          onSubmit={handleSubmit}
          placeholderText="Describe your dream here..."
        />
        <AnalyserResponse nonResponseText={'...'} responseText={response} />
        <PreviouslyAskedQuestions
          previousAnsweredQuestions={previousAnsweredQueries}
          title="Previously Asked Questions 📝"
        />
      </>
    </Layout>
  );
}

export default App;
