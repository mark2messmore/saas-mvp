const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

const app = express();

// Allow CORS for your Vercel app
app.use(
  cors({
    origin: "*", // Temporarily allow all origins for testing
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'localagency-5bf8d',
});
const bucketName = "my-app-uploads-5bf8d"; // Replace with your bucket name

const upload = multer({ storage: multer.memoryStorage() });

// Upload file to Google Cloud Storage
async function uploadFileToGCS(file) {
  if (!file.buffer || !file.originalname) {
    throw new Error('Invalid file object');
  }

  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.error("Stream error:", err);
      reject(err);
    });
    
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.originalname}`;
      console.log("Upload finished:", publicUrl);
      resolve(publicUrl);
    });
    
    blobStream.end(file.buffer);
  });
}

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Received upload request");
    console.log("Headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ error: "No file uploaded." });
    }

    const publicUrl = await uploadFileToGCS(req.file);
    console.log("File uploaded successfully:", publicUrl);
    
    res.status(200).json({
      message: "File uploaded successfully!",
      fileUrl: publicUrl,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error("Error in upload handler:", error);
    res.status(500).json({ 
      error: "File upload failed.",
      details: error.message 
    });
  }
});

// Export the app as the entry point for Google Cloud Functions
exports.uploadFile = app;
