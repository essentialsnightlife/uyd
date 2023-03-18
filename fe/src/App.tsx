import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="header">Dream Analyser</p>
      </header>
      <div className="body">

        <div className="question-box">
          <textarea placeholder="Ask a question" />
          <button>Ask</button>
        </div>

          <div className="response-box">
              <p>Response 🧠</p>
          </div>

          <p> Placeholder: used your daily quota of queries</p>
      </div>

      <div className="footer">
        <p>
          <a
            className="App-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leave Feedback
          </a>
          {' | '}
          <a
            className="App-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Peng Devs
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
