const { Translator } = require("google-translate-api-x");

const translator = new Translator();

async function fetchTranslation(text, source, target) {
  try {
    const result = await translator.translate(text, {
      from: source || "auto",
      to: target,
    });

    return result.text;
  } catch (error) {
    console.error(error);

    const err = new Error("Translation failed. Please try again.");
    err.statusCode = 500;
    throw err;
  }
}

module.exports = { fetchTranslation };