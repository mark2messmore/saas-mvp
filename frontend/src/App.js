import React from "react";
import UploadForm from "./UploadForm";
import './App.css'; // Keep this if you want to retain the styling.

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Uploader</h1>
        <p>Upload your photos or voice recordings below:</p>
        <UploadForm />
      </header>
    </div>
  );
}

export default App;
