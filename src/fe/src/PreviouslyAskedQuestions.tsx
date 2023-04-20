import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { AnsweredQuery } from './types';

interface PreviouslyAskedQuestionsProps {
  previousAnsweredQuestions: AnsweredQuery[];
  title: string;
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
        {previousAnsweredQuestions.map((question) => (
          <div key={question.query}>
            <p>Question: {question.query}</p>
            <p>Response: {question.response}</p>
          </div>
        ))}
      </Typography>
    </Box>
  );
}
