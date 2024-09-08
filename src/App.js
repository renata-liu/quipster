import './App.css';
import bow from './assets/bow.png';
import { useState } from 'react';

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const [lockInput, setLockInput] = useState(false);

  const getMessage = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: "generate a comeback for this roast, no exclamation points, gen-z style: " + value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const rawMessage = data.choices[0].message.content;
        const trimmedMessage = rawMessage.replace(/^"|"$/g, '');
        setShowOutput(true);
        setLockInput(true);
        setMessage(trimmedMessage);
      } else {
        console.error("Unexpected response format:", data);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const resetInput = () => {
    setValue("");
    setMessage(null);
    setShowOutput(false);
    setLockInput(false);
  };

  return (
    <div className="App">

      <section className="main">

        <div className="top-section">
          <div className="logo">
            <h1>quipster</h1><img src={bow} alt="logo"/>
          </div>
          <h3>bring on the heat.</h3>
        </div>

        <div className="input-container">
          <input 
            placeholder="need a comeback? we got you"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={lockInput} />
          <div id="submit" className="arrow" onClick={getMessage}>➢</div>
        </div>

        {showOutput && 
          <div className="output-wrapper">
            <div className="output-container">
              <div id="input">{value}</div>
              <div id="output">{message}</div>
            </div>
            <div className="reset-button" onClick={resetInput}>
              RESET
            </div>
          </div>
        }

      </section>

    </div>
  );
}

export default App;
