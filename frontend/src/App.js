import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
    setOutput("");
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".yaml")) {
      setFile(droppedFile);
      setOutput("");
      setError("");
    } else {
      setError("Please drop a valid .yaml file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select or drop a YAML file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("/convert", formData);
      setOutput(res.data.sexp);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.sexp";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>YAML ➝ S-expression</h1>

        {/* Drop zone */}
        <div
          style={styles.dropzone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
        >
          <p>{file ? `📄 ${file.name}` : "📂 Drop YAML here or click to upload"}</p>
        </div>

        {/* Hidden input */}
        <input
          type="file"
          accept=".yaml,.yml"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <button style={styles.button} onClick={handleConvert} disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>

        {output && (
          <div>
            <h3 style={styles.label}>✅ Output:</h3>
            <pre style={styles.output}>{output}</pre>
            <button style={styles.download} onClick={handleDownload}>📥 Download .sexp</button>
          </div>
        )}

        {error && (
          <div>
            <h3 style={{ ...styles.label, color: "#ff0033" }}>❌ Error:</h3>
            <pre style={styles.error}>{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fdfaf6",
    padding: "3rem",
    fontFamily: `'Courier New', monospace`,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    background: "#fff",
    border: "2px solid #000",
    boxShadow: "6px 6px 0px #000",
    padding: "2rem",
    maxWidth: "720px",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#000",
  },
  dropzone: {
    border: "2px dashed #000",
    padding: "2rem",
    marginBottom: "1rem",
    textAlign: "center",
    cursor: "pointer",
    background: "#e0f7ff",
    color: "#000",
    fontWeight: "bold",
  },
  button: {
    border: "2px solid #000",
    background: "#ffe600",
    padding: "0.8rem 1.2rem",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #000",
    textTransform: "uppercase",
    marginBottom: "2rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },
  output: {
    background: "#f1f1f1",
    border: "2px solid #000",
    padding: "1rem",
    fontSize: "0.95rem",
    whiteSpace: "pre-wrap",
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "1rem",
  },
  error: {
    background: "#ffe6e6",
    border: "2px solid #ff0033",
    color: "#b30000",
    padding: "1rem",
    whiteSpace: "pre-wrap",
  },
  download: {
    background: "#00ffa6",
    border: "2px solid #000",
    boxShadow: "3px 3px 0px #000",
    padding: "0.6rem 1rem",
    fontWeight: "bold",
    cursor: "pointer",
    textTransform: "uppercase",
  },
};

export default App;
