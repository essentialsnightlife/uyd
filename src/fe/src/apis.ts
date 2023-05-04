import { Session } from '@supabase/supabase-js';

import { AnsweredQuery } from './types';

export async function saveAnsweredQuery({
  session,
  query,
  analysedDream,
}: {
  session: Session | null;
  query: string;
  analysedDream: string;
}) {
  const formattedAnsweredQuery: AnsweredQuery = {
    id: 'UYD' + Date.now(),
    userId: session?.user.id,
    query,
    response: analysedDream,
    date: new Date().toISOString(),
  };

  const response = await fetch(
    'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedAnsweredQuery),
    },
  );
  const data = await response.json();
  console.log(data);
  if (data.body.error) {
    throw new Error(data);
  }
  return { data, answeredQuery: formattedAnsweredQuery };
}
export async function analyseDream(query: string) {
  let response;
  let data;
  try {
    response = await fetch(
      'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/analyse',
      {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query,
      },
    );
    data = await response.json();
    console.log('query: ', query);
    console.log('data gott: ', data);
  } catch (err: unknown) {
    console.log('api error');
    console.log(err);
    throw new Error('api error');
  }

  if (data.body.error) {
    console.log('data body error');
    console.log(data.body);
    throw new Error(data.body.error);
  }
  return data.body.result;
}
