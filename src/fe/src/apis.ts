import { Session } from '@supabase/supabase-js';

export async function saveAnsweredQuery({
  session,
  query,
  analysedDream,
}: {
  session: Session | null;
  query: string;
  analysedDream: string;
}) {
  const formattedAnsweredQuery = {
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
    throw new Error(data.body.error);
  }
  return { data, answeredQuery: formattedAnsweredQuery };
}
export async function analyseDream(query: string) {
  const response = await fetch(
    'https://d3xxs9kqk8.execute-api.eu-west-2.amazonaws.com/dreams/analyse',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: query,
    },
  );
  const data = await response.json();
  return data.body.result;
}
