const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  "https://otaiegzmcleaxqatfycg.supabase.co", // Replace with your Supabase project URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90YWllZ3ptY2xlYXhxYXRmeWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODI2ODEsImV4cCI6MjA1MDI1ODY4MX0.1ngNnibhPAFV1aOotoUguXwwq9uvFOqjNMTrhwtp4PI" // Replace with your Supabase anon key
);

async function uploadFile(file) {
  // Upload file to the "uploads" bucket
  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(`public/${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

module.exports = uploadFile;
