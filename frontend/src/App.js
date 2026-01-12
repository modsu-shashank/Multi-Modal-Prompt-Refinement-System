import React, { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import RefinedPromptDisplay from "./components/RefinedPromptDisplay";
import SampleExamples from "./components/SampleExamples";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [refinedPrompt, setRefinedPrompt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRefinementComplete = (prompt) => {
    setRefinedPrompt(prompt);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">✨</div>
            <div className="logo-text">
              <h1>Multi-Modal Prompt Refinement</h1>
              <p className="tagline">
                Transform Ideas into Structured Excellence
              </p>
            </div>
          </div>
          <p className="header-description">
            Streamline your project requirements with AI-powered analysis.
            Convert text, images, and documents into professional, structured
            prompts ready for development teams.
          </p>
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <FileUpload
            onRefinementComplete={handleRefinementComplete}
            loading={loading}
            setLoading={setLoading}
          />

          {refinedPrompt && (
            <RefinedPromptDisplay refinedPrompt={refinedPrompt} />
          )}

          <SampleExamples />
        </div>
      </main>

      <footer className="App-footer">
        <p>
          © 2025 Multi-Modal Prompt Refinement System. Built for modern teams.
        </p>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
        progressClassName="toast-progress"
      />
    </div>
  );
}

export default App;
