/**
 * =========================================================
 * server.js
 * ---------------------------------------------------------
 * Entry point for the LinguaBridge backend.
 * Sets up Express, middleware (CORS, JSON body parsing),
 * mounts the API routes, and starts the HTTP server.
 * =========================================================
 */

// Load environment variables from .env into process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const translateRoutes = require("./routes/translate");

const app = express();
const PORT = process.env.PORT || 5000;

/* -----------------------------------------------------------
   MIDDLEWARE
----------------------------------------------------------- */

// Parse incoming JSON request bodies (e.g. { "text": "...", ... })
app.use(express.json());

app.use(cors());


/* -----------------------------------------------------------
   ROUTES
----------------------------------------------------------- */

// Health check — useful for uptime monitors and deployment platforms
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "LinguaBridge Translation API is running.",
  });
});

// All translation-related routes (currently: POST /translate)
app.use("/", translateRoutes);

/* -----------------------------------------------------------
   404 HANDLER
   Catches any request to a route that doesn't exist.
----------------------------------------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

/* -----------------------------------------------------------
   GLOBAL ERROR HANDLER
   Catches any error passed to next(err), or thrown synchronously
   inside a route, and returns a consistent JSON error shape
   instead of leaking a stack trace to the client.
----------------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred. Please try again later.",
  });
});

/* -----------------------------------------------------------
   START SERVER
----------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`LinguaBridge backend running at http://localhost:${PORT}`);
});

module.exports = app; // Exported for potential testing frameworks (e.g. supertest)
