import './App.css';

import { PublishCommand, PublishCommandInput, SNSClient } from '@aws-sdk/client-sns';
import { Session } from '@supabase/supabase-js';
import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';

import { AnalyserResponse } from './AnalyserResponse';
import { analyseDream } from './apis';
import { supabaseClient } from './auth/client';
import { DreamAnalyser } from './DreamAnalyser';
import Layout from './Layout';
import LoginMagicLink from './LoginMagicLink';
import { PreviouslyAskedQuestions } from './PreviouslyAskedQuestions';
import { AnsweredQuery } from './types';

const credentials = {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
};

const snsClient = new SNSClient({
  region: 'eu-west-2',
  credentials,
});

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

  function formatterAnsweredQuery({
    query,
    analysedDream,
    session,
  }: {
    query: string;
    analysedDream: string;
    session: Session | null;
  }): AnsweredQuery {
    return {
      id: 'UYD' + Date.now(),
      userId: session?.user.id,
      query,
      response: analysedDream,
      date: new Date().toISOString(),
    };
  }

  async function publishAnsweredQuery(answeredQuery: AnsweredQuery) {
    const { id, userId, query, response, date } = answeredQuery;

    const input: PublishCommandInput = {
      TopicArn: 'arn:aws:sns:eu-west-2:410317984454:AnsweredQueryTopic',
      Message: JSON.stringify({ id, userId, query, response, date }),
    };

    try {
      const command = new PublishCommand(input);
      const snsResponse = await snsClient.send(command);
      return { snsResponse };
    } catch (err: unknown) {
      console.log('Error: ', err);
      console.log(err);
      console.log(
        'aws access: ',
        import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        'secretAccessKey: ',
        import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(err.stack);
    }
  }

  const handleSubmit = async (e: FormEvent, query: string) => {
    e.preventDefault();
    try {
      const analysedDream = await analyseDream(query);
      console.log(analysedDream);
      setResponse(analysedDream);
      const answeredQuery = formatterAnsweredQuery({ query, analysedDream, session });
      await publishAnsweredQuery(answeredQuery);
      setPreviousAnsweredQueries((prev) => [...prev, answeredQuery]);
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
        <PreviouslyAskedQuestions
          previousAnsweredQuestions={previousAnsweredQueries}
          title="Previously Asked Questions 📝"
        />
      </>
    </Layout>
  );
}

export default App;
