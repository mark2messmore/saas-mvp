const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage");

const app = express();

// Basic CORS setup
app.use(cors());

// Setup Google Cloud Storage
const storage = new Storage({
  projectId: 'localagency-5bf8d'
});
const bucketName = "my-app-uploads-5bf8d";
const bucket = storage.bucket(bucketName);

// Multer setup for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Simple upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Unable to upload file" });
    });

    blobStream.on("finish", () => {
      res.status(200).json({
        message: "Upload complete",
        fileName: req.file.originalname
      });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

exports.uploadFile = app;
