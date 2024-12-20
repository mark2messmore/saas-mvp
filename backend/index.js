const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

const app = express();

// Allow CORS for your Vercel app
app.use(
  cors({
    origin: "https://saas-mvp-beta.vercel.app", // Replace with your Vercel domain
  })
);

// Initialize Google Cloud Storage
const storage = new Storage();
const bucketName = "my-app-uploads-5bf8d"; // Replace with your bucket name

const upload = multer({ storage: multer.memoryStorage() });

// Upload file to Google Cloud Storage
async function uploadFileToGCS(file) {
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream();

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () =>
      resolve(`https://storage.googleapis.com/${bucketName}/${file.originalname}`)
    );
    blobStream.end(file.buffer);
  });
}

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const publicUrl = await uploadFileToGCS(req.file);
    res.status(200).json({
      message: "File uploaded successfully!",
      fileUrl: publicUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "File upload failed." });
  }
});

// Export the app as the entry point for Google Cloud Functions
exports.uploadFile = app;
