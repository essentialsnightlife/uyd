import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { AnalysedDream } from '../../domains/analysedDreams/types';
import { formatDate, sortedAnalysedDreams } from './helpers';

interface PreviouslyAskedQuestionsProps {
  previousAnalysedDreams: AnalysedDream[];
  title: string;
}

export function PreviouslyAnalysedDreams({
  previousAnalysedDreams,
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
        {sortedAnalysedDreams(previousAnalysedDreams).map((question, i) => (
          <div key={i}>
            <p>{formatDate(String(question?.date))}</p>
            <p>Question: {question.query}</p>
            <p>Response: {question.response}</p>
          </div>
        ))}
      </Typography>
    </Box>
  );
}
