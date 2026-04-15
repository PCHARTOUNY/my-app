const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const app = express();

// ============================
// Middleware
// ============================
app.use(cors());
app.use(express.json());

// ============================
// PostgreSQL CONFIG (K8s)
// ============================
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// ============================
// DB CONNECTION RETRY
// ============================
const connectWithRetry = async () => {
  let connected = false;

  while (!connected) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Connected to PostgreSQL");
      connected = true;
    } catch (err) {
      console.log("❌ DB not ready, retrying...");
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
};

connectWithRetry();

// ============================
// ROUTES
// ============================

// Health
app.get("/api", (req, res) => {
  res.send("API is running 🚀");
});

// Signup
app.post("/api/signup", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send("Missing fields");
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password, email) VALUES ($1,$2,$3)",
      [username, hashed, email]
    );

    res.json({ message: "User created" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).send("User exists");
    }
    res.status(500).send("Error");
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  if (result.rows.length === 0) {
    return res.status(400).send("User not found");
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(400).send("Wrong password");
  }

  res.json({ message: "Login successful" });
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});