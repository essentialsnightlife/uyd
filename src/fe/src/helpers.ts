import { Session } from '@supabase/supabase-js';

import { AnalysedDream } from '../../domains/analysedDreams/types';

export function removeNonLetters(str: string) {
  return str.replace(/^[^a-zA-Z]*/g, '');
}

export function formatDate(dateStr: string) {
  const dateObj = new Date(dateStr);
  const dayFirst3Letters = dateObj
    .toLocaleString('default', { weekday: 'long' })
    .substring(0, 3);
  const date = dateStr.slice(0, 10) + ' ' + dateStr.slice(11, 16);
  return dayFirst3Letters.toUpperCase() + ' ' + date;
}

export const sortedAnalysedDreams = (analysedDreams: AnalysedDream[]) =>
  analysedDreams.sort((a, b) => {
    if (!a.date || !b.date) {
      return 0;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

export const apiCallsLeft = (analysedDreams: AnalysedDream[], max: number) => {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).toISOString();
  return Math.max(
    0,
    max -
      analysedDreams.reduce(
        (count, dream) => count + (dream.date >= startOfToday ? 1 : 0),
        0,
      ),
  );
};

export function formatterAnalysedDream({
  query,
  analysedDream,
  session,
}: {
  query: string;
  analysedDream: string;
  session: Session | null;
}): AnalysedDream {
  return {
    id: 'UYD' + Date.now() + String(Math.floor(Math.random() * 100) + 1),
    userId: session?.user.id,
    query,
    response: analysedDream,
    date: new Date().toISOString(),
  };
}
