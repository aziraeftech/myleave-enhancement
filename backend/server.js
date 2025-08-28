
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required by Neon
  },
});

pool.connect()
  .then(client => {
    console.log("Database connected successfully!");
    client.release();
  })
  .catch(err => console.error("Database connection error:", err.stack));


// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Example: fetch leaves
app.get("/leaves", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leaves");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
