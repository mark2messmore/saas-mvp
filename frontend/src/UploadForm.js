import React, { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://us-central1-localagency-5bf8d.cloudfunctions.net/uploadFile/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Upload successful!");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        onChange={handleFileChange}
        disabled={loading}
      />
      <button 
        type="submit"
        disabled={loading || !file}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadForm;
