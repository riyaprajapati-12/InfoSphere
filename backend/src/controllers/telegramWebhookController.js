const bot = require("../telegram/bot");
const axios = require("axios");

const telegramWebhook = async (req, res) => {
  try {
    const update = req.body;

    // Let telegram-bot-api handle update
    bot.processUpdate(update);

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
};

module.exports = { telegramWebhook };
