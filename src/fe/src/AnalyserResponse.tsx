import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';

interface AnalyserResponseProps {
  responseText?: string | null;
  nonResponseText: string;
}

export function AnalyserResponse({
  responseText,
  nonResponseText,
}: AnalyserResponseProps) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mr: 2,
          fontFamily: 'monospace',
          textDecoration: 'none',
        }}
      >
        {responseText ? responseText : nonResponseText}
      </Typography>
    </Box>
  );
}
