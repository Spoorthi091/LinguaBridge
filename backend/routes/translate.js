/**
 * =========================================================
 * routes/translate.js
 * ---------------------------------------------------------
 * Defines the URL paths related to translation and wires
 * each one to its controller function. Routes stay thin —
 * all logic lives in the controller.
 * =========================================================
 */

const express = require("express");
const router = express.Router();
const { translate } = require("../controllers/translateController");

// POST /translate  →  translates the given text
router.post("/translate", translate);

module.exports = router;
