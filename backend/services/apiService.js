const axios = require("axios");

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

async function fetchTranslation(text, source, target) {
  try {
    const response = await axios.get(MYMEMORY_URL, {
      params: {
        q: text,
        langpair: `${source}|${target}`,
      },
      timeout: 10000,
    });

    const data = response.data;

    if (!data || !data.responseData || !data.responseData.translatedText) {
      const err = new Error("Translation provider returned an empty result.");
      err.statusCode = 502;
      throw err;
    }

    if (data.responseData.translatedText === "INVALID LANGUAGE PAIR") {
      const err = new Error("Invalid language pair.");
      err.statusCode = 400;
      throw err;
    }

    return data.responseData.translatedText;
  } catch (error) {
    if (error.statusCode) throw error;
    const err = new Error("Could not reach the translation provider.");
    err.statusCode = 504;
    throw err;
  }
}

module.exports = { fetchTranslation };
