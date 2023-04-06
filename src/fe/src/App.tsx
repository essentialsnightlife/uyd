import './App.css';

import TextareaAutosize from '@mui/base/TextareaAutosize';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { FormEvent, useState } from 'react';

import Layout from './Layout';

type AnsweredQuestion = {
  id?: string;
  userId?: string;
  query: string;
  response: string;
};

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [previousAnsweredQuestions, setPreviousAnsweredQuestions] = useState<
    AnsweredQuestion[]
  >([]);

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

  return (
    <Layout>
      <>
        <Box sx={{ my: 4 }}>
          <form className="question-box" onSubmit={(e) => handleSubmit(e, question)}>
            <TextareaAutosize
              minRows={3}
              placeholder="Describe your dream here..."
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
        <Box>
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              textDecoration: 'none',
            }}
          >
            {response ? `Response 🧠: ${response}` : 'filler text'}
            {response}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              mt: 6,
            }}
          >
            Previously Asked Questions 📝
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
      </>
    </Layout>
  );
}

export default App;
