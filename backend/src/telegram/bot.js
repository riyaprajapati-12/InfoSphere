const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome!\n\nUse:\n/connect <token>"
  );
});

// /connect <token>
bot.onText(/\/connect (.+)/, async (msg, match) => {
  const token = match[1];
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  try {
    await axios.post(
      `${process.env.BACKEND_URL}/api/users/telegram/connect`,
      {
        token,
        telegramId,
        chatId,
      }
    );

    bot.sendMessage(chatId, "✅ Telegram connected successfully!");
  } catch (err) {
    bot.sendMessage(
      chatId,
      "❌ Invalid or expired token. Generate a new one from dashboard."
    );
  }
});

module.exports = bot;
