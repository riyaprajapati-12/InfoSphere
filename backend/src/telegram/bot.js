const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const Article = require("../models/article");
const { generateSummaryAndKeywords } = require("../services/aiService");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

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

bot.onText(/\/summary (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const articleUrl = match[1]; // User link provide karega

  try {
    const article = await Article.findOne({ link: articleUrl });
    if (!article) {
      return bot.sendMessage(chatId, "❌ Article not found in your feed.");
    }

    bot.sendMessage(chatId, "🤖 Generating summary, please wait...");

    const aiData = await generateSummaryAndKeywords(article.content);
    if (aiData) {
      bot.sendMessage(chatId, `📝 *Summary:* \n\n${aiData.summary}`, { parse_mode: "Markdown" });
    } else {
      bot.sendMessage(chatId, "⚠️ Could not generate summary at this moment.");
    }
  } catch (err) {
    bot.sendMessage(chatId, "❌ An error occurred.");
  }
});

module.exports = bot;
