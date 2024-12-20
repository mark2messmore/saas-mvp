const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // For environment variables

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL, // Use environment variables
  process.env.SUPABASE_ANON_KEY
);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Upload file to Supabase Storage
async function uploadFile(file) {
  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(`public/${file.originalname}`, file.buffer, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

// API endpoint to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Upload file to Supabase
    const fileData = await uploadFile(req.file);

    res.status(200).json({
      message: "File uploaded successfully!",
      fileName: req.file.originalname,
      filePath: fileData.path,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "File upload failed." });
  }
});

// Export the app for Google Cloud Functions
exports.uploadFile = app; // This makes the app object the entry point for the function
