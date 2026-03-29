import React, { useState } from "react";
import UploadPage from "./components/UploadPage";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="app">
      {!analysis ? (
        <UploadPage onUpload={handleUpload} loading={loading} error={error} />
      ) : (
        <Dashboard analysis={analysis} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
