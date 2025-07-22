import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setOutput('');
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });      
      const data = await res.json();

      if (res.ok) {
        setOutput(data.output);
      } else {
        setError(data.error || 'Conversion failed');
      }
    } catch (err) {
      setError(err.message || 'Unknown error');
    }
  };

  return (
    <div className="container">
      <h1>YAML → <span className="highlight">S-EXPRESSION</span></h1>
      <div className="upload-box">
        <input type="file" accept=".yaml,.yml" onChange={handleFileChange} />
        <button onClick={handleSubmit}>CONVERT</button>
      </div>

      {error && (
        <div className="error-box">
          <p><b>❌ Error:</b></p>
          <pre>{error}</pre>
        </div>
      )}

      {output && (
        <div className="output-box">
          <p><b>✅ Output:</b></p>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
