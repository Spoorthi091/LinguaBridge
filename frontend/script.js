/* =========================================================
   LinguaBridge — Language Translation Tool
   script.js — handles languages, backend API calls, and UI logic
   ========================================================= */

/* -----------------------------------------------------------
   0. BACKEND CONFIGURATION
   The frontend never calls the translation provider directly —
   it always talks to OUR Express backend, which forwards the
   request to LibreTranslate. Change this if you deploy the
   backend somewhere other than localhost.
----------------------------------------------------------- */
const BACKEND_URL = "https://linguabridge-d34r.onrender.com/translate";

/* -----------------------------------------------------------
   1. LANGUAGE LIST
   Each language has a "name" (shown to the user) and a "code"
   Each language has a "name" (shown to the user) and a "code"
   (used by the translation API). Feel free to add more!
----------------------------------------------------------- */   
  

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
];

/* -----------------------------------------------------------
   2. DOM ELEMENT REFERENCES
----------------------------------------------------------- */
const sourceLangSelect = document.getElementById("sourceLang");
const targetLangSelect = document.getElementById("targetLang");
const sourceText = document.getElementById("sourceText");
const outputText = document.getElementById("outputText");
const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");
const charCount = document.getElementById("charCount");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");

const MAX_CHARS = 500;

/* -----------------------------------------------------------
   3. POPULATE LANGUAGE DROPDOWNS
----------------------------------------------------------- */
function populateLanguageDropdowns() {
  LANGUAGES.forEach((lang) => {
    const sourceOption = document.createElement("option");
    sourceOption.value = lang.code;
    sourceOption.textContent = lang.name;
    sourceLangSelect.appendChild(sourceOption);

    const targetOption = document.createElement("option");
    targetOption.value = lang.code;
    targetOption.textContent = lang.name;
    targetLangSelect.appendChild(targetOption);
  });

  // Sensible defaults: English -> Hindi
  sourceLangSelect.value = "en";
  targetLangSelect.value = "hi";
}

/* -----------------------------------------------------------
   4. CHARACTER COUNTER
----------------------------------------------------------- */
function updateCharCounter() {
  const length = sourceText.value.length;
  charCount.textContent = `${length} / ${MAX_CHARS}`;
}

/* -----------------------------------------------------------
   5. ERROR HANDLING HELPERS
----------------------------------------------------------- */
function showError(message) {
  errorMessage.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

/* -----------------------------------------------------------
   6. LOADING STATE HELPERS
----------------------------------------------------------- */
function setLoading(isLoading) {
  if (isLoading) {
    loader.classList.remove("hidden");
    translateBtn.disabled = true;
    translateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Translating...`;
  } else {
    loader.classList.add("hidden");
    translateBtn.disabled = false;
    translateBtn.innerHTML = `<i class="fa-solid fa-language"></i> Translate`;
  }
}

/* -----------------------------------------------------------
   7. CORE TRANSLATION FUNCTION
   Sends a POST request to OUR backend's /translate endpoint.
   The backend is responsible for talking to LibreTranslate,
   so the API key (if any) and provider URL never touch the
   browser or get exposed in client-side code.

   Expected backend request body:
   { "text": "Hello", "source": "en", "target": "hi" }

   Expected backend success response:
   { "success": true, "translatedText": "नमस्ते" }
----------------------------------------------------------- */
async function translateText(text, sourceLang, targetLang) {
  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      source: sourceLang,
      target: targetLang,
    }),
  });

  // Try to parse JSON regardless of status code, since our backend
  // always returns a JSON error body on failure.
  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    throw new Error("Unexpected response from the server. Please try again.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Translation failed. Please try again.");
  }

  return data.translatedText;
}

/* -----------------------------------------------------------
   8. HANDLE THE "TRANSLATE" BUTTON CLICK
----------------------------------------------------------- */
async function handleTranslate() {
  const text = sourceText.value.trim();
  const sourceLang = sourceLangSelect.value;
  const targetLang = targetLangSelect.value;

  hideError();

  if (!text) {
    showError("Please enter some text to translate.");
    return;
  }

  if (sourceLang === targetLang) {
    showError("Source and target languages cannot be the same.");
    return;
  }

  setLoading(true);
  outputText.innerHTML = "";

  try {
    const translated = await translateText(text, sourceLang, targetLang);
    outputText.textContent = translated;
  } catch (error) {
    // Covers both network failures (backend not running / offline)
    // and API-level errors returned by the backend.
    showError(error.message || "Something went wrong. Please check your connection and try again.");
    outputText.innerHTML = `<span class="placeholder-text">Translation will appear here...</span>`;
  } finally {
    setLoading(false);
  }
}

/* -----------------------------------------------------------
   9. SWAP LANGUAGES
----------------------------------------------------------- */
function handleSwap() {
  const tempLang = sourceLangSelect.value;
  sourceLangSelect.value = targetLangSelect.value;
  targetLangSelect.value = tempLang;

  const currentOutput = outputText.textContent.trim();
  const isPlaceholder = outputText.querySelector(".placeholder-text");

  if (currentOutput && !isPlaceholder) {
    sourceText.value = currentOutput;
    updateCharCounter();
    outputText.innerHTML = `<span class="placeholder-text">Translation will appear here...</span>`;
  }
}

/* -----------------------------------------------------------
   10. CLEAR BUTTON
----------------------------------------------------------- */
function handleClear() {
  sourceText.value = "";
  updateCharCounter();
  outputText.innerHTML = `<span class="placeholder-text">Translation will appear here...</span>`;
  hideError();
  sourceText.focus();
}

/* -----------------------------------------------------------
   11. COPY TRANSLATED TEXT
----------------------------------------------------------- */
function handleCopy() {
  const textToCopy = outputText.textContent.trim();

  if (!textToCopy || outputText.querySelector(".placeholder-text")) {
    showError("There is no translation to copy yet.");
    return;
  }

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      const originalIcon = copyBtn.innerHTML;
      copyBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
      setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
      }, 1500);
    })
    .catch(() => {
      showError("Could not copy text. Please copy it manually.");
    });
}

/* -----------------------------------------------------------
   12. TEXT-TO-SPEECH
   Uses the browser's built-in SpeechSynthesis API — no
   external service or API key required.
----------------------------------------------------------- */
function handleSpeak() {
  const textToSpeak = outputText.textContent.trim();

  if (!textToSpeak || outputText.querySelector(".placeholder-text")) {
    showError("There is no translation to read aloud yet.");
    return;
  }

  if (!("speechSynthesis" in window)) {
    showError("Text-to-speech is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = targetLangSelect.value;
  window.speechSynthesis.speak(utterance);
}

/* -----------------------------------------------------------
   13. EVENT LISTENERS
----------------------------------------------------------- */
translateBtn.addEventListener("click", handleTranslate);
swapBtn.addEventListener("click", handleSwap);
clearBtn.addEventListener("click", handleClear);
copyBtn.addEventListener("click", handleCopy);
speakBtn.addEventListener("click", handleSpeak);
sourceText.addEventListener("input", updateCharCounter);

sourceText.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleTranslate();
  }
});

/* -----------------------------------------------------------
   14. INITIALIZE APP
----------------------------------------------------------- */
populateLanguageDropdowns();
updateCharCounter();
