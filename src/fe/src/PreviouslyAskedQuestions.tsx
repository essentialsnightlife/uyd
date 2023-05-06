import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { AnsweredQuery } from './types';

interface PreviouslyAskedQuestionsProps {
  previousAnsweredQuestions: AnsweredQuery[];
  title: string;
}

function formatDate (dateStr: string)  {
    const dateObj = new Date(dateStr);
    const dayFirst3Letters = dateObj.toLocaleString('default', { weekday: 'long' }).substring(0, 3);
    const date = dateStr.slice(0, 10) + ' ' + dateStr.slice(11, 16)
    return dayFirst3Letters.toUpperCase() + ' ' + date;
}

export function PreviouslyAskedQuestions({
  previousAnsweredQuestions,
  title,
}: PreviouslyAskedQuestionsProps) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mr: 2,
          mt: 6,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mr: 2,
          fontFamily: 'monospace',
          textDecoration: 'none',
        }}
      >
        {previousAnsweredQuestions.map((question, i) => (
          <div key={i}>
            <p>
              {formatDate(String(question?.date))}
            </p>
            <p>Question: {question.query}</p>
            <p>Response: {question.response}</p>
          </div>
        ))}
      </Typography>
    </Box>
  );
}
