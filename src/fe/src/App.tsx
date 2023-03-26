import * as React from 'react';
import { FormEvent, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import './App.css';
import Footer from './Footer';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);

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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dream Analyser
        </Typography>
        <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
          ☁️ Start here | 🧠 Use your dreams
        </Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <form className="question-box" onSubmit={(e) => handleSubmit(e, question)}>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            placeholder="Describe your dream here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </form>
        <Button variant="text" size="large" style={{ color: 'black' }} sx={{
            ':hover': {
                bgcolor: 'grey',
            },
        }}>
          Go
        </Button>
      </Box>
      <Box>
        <Typography variant="h6">
          {response ? `Response 🧠: ${response}` : null}
        </Typography>
      </Box>
      <Footer />
    </Container>
  );
}

export default App;
