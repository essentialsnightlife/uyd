import TextareaAutosize from '@mui/base/TextareaAutosize';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { SyntheticEvent } from 'react';
import * as React from 'react';

import { ANALYSER_INPUT_MAX_CHARS } from './constants';

interface DreamAnalyserProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: (e: SyntheticEvent, question: string) => void;
  placeholderText?: string;
}

export function DreamAnalyser({
  question,
  setQuestion,
  onSubmit,
  placeholderText,
}: DreamAnalyserProps) {
  return (
    <Box sx={{ my: 4 }}>
      <form className="question-box" onSubmit={(e) => onSubmit(e, question)}>
        <TextareaAutosize
          maxLength={ANALYSER_INPUT_MAX_CHARS}
          minRows={3}
          placeholder={placeholderText}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        />
        <Button
          variant="text"
          type="submit"
          size="large"
          style={{ color: 'black' }}
          sx={{
            ':hover': {
              bgcolor: 'grey',
            },
          }}
        >
          Go
        </Button>
      </form>
    </Box>
  );
}
