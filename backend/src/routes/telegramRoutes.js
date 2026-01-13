const express = require("express");
const router = express.Router();
const { telegramWebhook } = require("../controllers/telegramWebhookController");

router.post("/webhook", telegramWebhook);

module.exports = router;
