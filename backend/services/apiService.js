/**
 * =========================================================
 * apiService.js
 * ---------------------------------------------------------
 * This is the ONLY file in the backend that talks to the
 * outside world (the LibreTranslate API). Keeping the raw
 * HTTP/axios logic in one "service" file, separate from the
 * Express routes/controllers, makes it easy to:
 *   1. Swap translation providers later (just edit this file)
 *   2. Unit-test translation logic without spinning up Express
 *   3. Reuse the same function from multiple controllers
 * =========================================================
 */

const axios = require("axios");

// Read configuration from environment variables (see .env.example)
const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || "https://libretranslate.de/translate";
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY || "";

/**
 * Calls the LibreTranslate API to translate a piece of text.
 *
 * @param {string} text   - The text to translate.
 * @param {string} source - Source language code (e.g. "en"). Use "auto" to auto-detect.
 * @param {string} target - Target language code (e.g. "hi").
 * @returns {Promise<string>} The translated text.
 * @throws {Error} A descriptive error if the request fails, annotated
 *                 with a `.statusCode` property so the controller can
 *                 map it to the correct HTTP response.
 */
async function fetchTranslation(text, source, target) {
  // Build the request body expected by LibreTranslate's /translate endpoint
  const requestBody = {
    q: text,
    source: source || "auto",
    target,
    format: "text",
  };

  // Only attach an API key if one was configured — many free
  // public LibreTranslate instances don't require it at all.
  if (LIBRETRANSLATE_API_KEY) {
    requestBody.api_key = LIBRETRANSLATE_API_KEY;
  }

  try {
    const response = await axios.post(LIBRETRANSLATE_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // 10-second timeout so a hung API never hangs our server
    });

    const translatedText = response.data && response.data.translatedText;

    if (!translatedText) {
      const err = new Error("Translation provider returned an empty result.");
      err.statusCode = 502; // Bad Gateway — upstream problem
      throw err;
    }

    return translatedText;
  } catch (error) {
    // Case 1: The translation provider responded, but with an error
    // (e.g. invalid language code, missing API key, rate limit hit).
    if (error.response) {
      const providerMessage =
        (error.response.data && error.response.data.error) ||
        "The translation provider rejected the request.";
      const err = new Error(providerMessage);
      err.statusCode = error.response.status >= 400 && error.response.status < 500 ? 400 : 502;
      throw err;
    }

    // Case 2: The request never got a response (timeout, DNS failure,
    // provider is down, no internet connection from the server, etc.)
    if (error.request) {
      const err = new Error(
        "Could not reach the translation provider. Please try again shortly."
      );
      err.statusCode = 504; // Gateway Timeout
      throw err;
    }

    // Case 3: Something else went wrong while building/sending the request,
    // or an error we threw ourselves above (like the empty-result case).
    if (error.statusCode) {
      throw error;
    }

    const err = new Error("Unexpected error while contacting the translation provider.");
    err.statusCode = 500;
    throw err;
  }
}

module.exports = { fetchTranslation };
