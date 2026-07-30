/**
 * =========================================================
 * translateController.js
 * ---------------------------------------------------------
 * Controllers hold the "business logic" for a route: they
 * validate the incoming request, call the appropriate service,
 * and shape the outgoing HTTP response. They never talk to
 * external APIs directly — that's the service layer's job
 * (see services/apiService.js).
 * =========================================================
 */

const { fetchTranslation } = require("../services/apiService");

/**
 * Handles POST /translate
 *
 * Expected request body:
 *   {
 *     "text":   "Hello, how are you?",
 *     "source": "en",
 *     "target": "hi"
 *   }
 *
 * Success response (200):
 *   {
 *     "success": true,
 *     "translatedText": "नमस्ते, आप कैसे हैं?"
 *   }
 *
 * Error response (4xx/5xx):
 *   {
 *     "success": false,
 *     "message": "Human-readable explanation of what went wrong"
 *   }
 */
async function translate(req, res) {
  const { text, source, target } = req.body;

  // ---------- Input validation ----------
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: "Field 'text' is required and must be a non-empty string.",
    });
  }

  if (!target || typeof target !== "string") {
    return res.status(400).json({
      success: false,
      message: "Field 'target' (target language code) is required.",
    });
  }

  if (source && source === target) {
    return res.status(400).json({
      success: false,
      message: "Source and target languages cannot be the same.",
    });
  }

  if (text.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Text is too long. Please limit input to 5000 characters.",
    });
  }

  // ---------- Call the translation service ----------
  try {
    const translatedText = await fetchTranslation(text.trim(), source, target);

    return res.status(200).json({
      success: true,
      translatedText,
    });
  } catch (error) {
    // Errors thrown by apiService.js carry a statusCode; fall back to 500.
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Translation failed. Please try again.",
    });
  }
}

module.exports = { translate };
