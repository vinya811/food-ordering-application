const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Foodie Backend is Running 🚀");
});

// Connect to Foodie database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Foodie MongoDB Connected Successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);
  });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Foodie Backend running on http://localhost:${PORT}`);
});