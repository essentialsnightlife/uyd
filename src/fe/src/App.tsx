import './App.css';

import { Session } from '@supabase/supabase-js';
import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';

import { AnalyserResponse } from './AnalyserResponse';
import { supabaseClient } from './auth/client';
import { DreamAnalyser } from './DreamAnalyser';
import Layout from './Layout';
import LoginMagicLink from './LoginMagicLink';
import { PreviouslyAskedQuestions } from './PreviouslyAskedQuestions';
import { AnsweredQuestion } from './types';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [previousAnsweredQuestions, setPreviousAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([]);
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

  const handleSubmit = (e: FormEvent, question: string) => {
    e.preventDefault();
    fetch('https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: question,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResponse(data.body.result);
        const answeredQuestion = { query: question, response: data.body.result };
        setPreviousAnsweredQuestions((prev) => [...prev, answeredQuestion]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  if (!session) {
    return <LoginMagicLink />;
  }
  return (
    <Layout>
      <>
        <DreamAnalyser
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          placeholderText="Describe your dream here..."
        />
        <AnalyserResponse nonResponseText={'...'} responseText={response} />
        <PreviouslyAskedQuestions
          previousAnsweredQuestions={previousAnsweredQuestions}
          title="Previously Asked Questions 📝"
        />
      </>
    </Layout>
  );
}

export default App;
