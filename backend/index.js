const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
app.use(cors());
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

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const fileData = await uploadFile(req.file);
    res.status(200).json({ message: "File uploaded successfully!", fileName: req.file.originalname });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "File upload failed." });
  }
});

// Listen on PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
