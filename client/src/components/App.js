import React, { useEffect, useState } from 'react';
import { UnControlled as CodeMirror } from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/markdown/markdown';
import '../styles/App.css';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAIListening, setIsAIListening] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
      if (response.data.length > 0) {
        setCurrentQuestion(response.data[0]);
      }
    }
    fetchQuestions();
  }, []);

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
  };

  const handleSend = async () => {
    setIsAIListening(true);
    const response = await axios.post('/api/chat', { message: transcript });
    setTranscript((prev) => prev + '\nAI: ' + response.data.choices[0].text);
    setIsAIListening(false);
  };

  const handleRunCode = async () => {
    const response = await axios.post('/api/chat', { message: code });
    setResult(response.data.choices[0].text);
  };

  const handleResetCode = () => {
    setCode('');
    setResult('');
  };

  return (
    <div className="container">
      <header>
        <h1>MakeIT</h1>
        <button className="back-button">Back to Dashboard</button>
      </header>
      <main>
        <div className="screen">
          <div className="code-section">
            <div className="question-section">
              {currentQuestion ? (
                <>
                  <h2>{currentQuestion.title}</h2>
                  <p>{currentQuestion.description}</p>
                  <p><strong>Example:</strong> {currentQuestion.example}</p>
                </>
              ) : (
                <p>Loading question...</p>
              )}
            </div>
            <select id="language-selector">
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
            <CodeMirror
              value={code}
              options={{
                mode: 'javascript',
                theme: 'dracula',
                lineNumbers: true
              }}
              onChange={handleCodeChange}
            />
            <div className="code-controls">
              <button className="run-button" onClick={handleRunCode}>Run</button>
              <button className="reset-button" onClick={handleResetCode}>Reset</button>
              <button className="submit-button" onClick={handleSend}>Submit</button>
            </div>
            <div className="output-section">
              <h3>Output:</h3>
              <pre id="output">{result}</pre>
            </div>
          </div>
          <div className="chat-section">
            <div className="interviewer">
              <img src="assets/interviewer.jpg" alt="Interviewer" />
            </div>
            <canvas className="voice-wave" id="voice-wave"></canvas>
            <div className="transcript-section">
              <div className="chat-window" id="chat-window">{transcript}</div>
            </div>
            <div className="chat-input">
              <button id="listen-button" onClick={handleSend} disabled={isAIListening}>Listen</button>
              <button id="send-button" onClick={handleSend} disabled={isAIListening}>Send</button>
            </div>
            <button className="analysis-button">Analysis</button>
          </div>
        </div>
        <div className="screen" id="screen-2" style={{ display: 'none' }}>
          <div className="review-section">
            <h2>Mock Interview Review</h2>
            <div className="score-section">
              <div className="score-circle">65%</div>
              <div className="details">
                <p><strong>Attempts:</strong> 3</p>
                <p><strong>Mastery:</strong> Partial Mastery</p>
              </div>
            </div>
            <div className="detailed-feedback">
              <h3>Detailed Feedback</h3>
              <p>Overall performance was good, but there are a few areas for improvement. The main issue was with code optimization and efficiency. Try to focus on these areas in the future.</p>
            </div>
            <button className="back-button" onClick={() => document.getElementById('screen-2').style.display = 'none'}>Back to Interview</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
