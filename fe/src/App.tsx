import './App.css';
import { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <p className="header">Dream Analyser</p>
      </header>
      <div className="body">
        <div className="question-box">
          <textarea
            placeholder="Ask a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button>Ask</button>
        </div>

        <div className="response-box">
            {response ? (<p>Response 🧠: {response}</p>) : <p>Waiting 🧠</p>}
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
