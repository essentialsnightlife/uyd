import './App.css';
import { FormEvent, useState } from 'react';

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
    <div className="App">
      <header className="App-header">
        <p className="header">Dream Analyser</p>
      </header>
      <div className="body">
        <form className="question-box" onSubmit={(e) => handleSubmit(e, question)}>
          <textarea
            placeholder="Ask a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button>Ask</button>
        </form>

        <div className="response-box">
          {response ? <p>Response 🧠: {response}</p> : <p>Waiting 🧠</p>}
        </div>

        <p> Placeholder: used your daily quota of queries</p>
      </div>

      <div className="footer">
        <p>
          <a className="App-link" href="#" target="_blank" rel="noopener noreferrer">
            Leave Feedback
          </a>
          {' | '}
          <a className="App-link" href="#" target="_blank" rel="noopener noreferrer">
            Peng Devs
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
