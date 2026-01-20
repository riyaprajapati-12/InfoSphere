const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const Article = require("../models/article");
const User = require("../models/user");
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

bot.onText(/\/latest/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // 1. User ko dhoondho jiska ye telegramChatId hai
    const user = await User.findOne({ telegramChatId: chatId.toString() });

    if (!user) {
      return bot.sendMessage(chatId, "❌ <b>Account not linked.</b>\nPlease go to your dashboard and connect Telegram first.", { parse_mode: "HTML" });
    }

    // 2. User ke latest 5 articles fetch karo (Read/Unread dono ho sakte hain)
    const articles = await Article.find({ userId: user._id })
      .sort({ publishedAt: -1 }) // Sabse naye articles upar
      .limit(5);

    if (articles.length === 0) {
      return bot.sendMessage(chatId, "📭 <b>No articles found.</b>\nTry adding some RSS feeds to your dashboard first.", { parse_mode: "HTML" });
    }

    // 3. Response Message taiyar karo
    let response = "<b>🚀 Latest Intelligence Reports</b>\n";
    response += "<i>Showing top 5 recent articles:</i>\n\n";
    response += "───────────────────\n\n";

    articles.forEach((art, index) => {
      const date = new Date(art.publishedAt).toLocaleDateString();
      response += `${index + 1}. <b>${art.title}</b>\n`;
      response += `📅 <i>${date}</i>\n`;
      response += `🔗 <a href="${art.link}">Read Full Article</a>\n\n`;
    });

    response += "───────────────────\n";
    response += "<i>Use /summary [link] to get AI insights.</i>";

    // 4. Message send karein
    bot.sendMessage(chatId, response, { 
      parse_mode: "HTML",
      disable_web_page_preview: true 
    });

  } catch (err) {
    console.error("Telegram /latest error:", err.message);
    bot.sendMessage(chatId, "⚠️ <b>System Error:</b> Failed to retrieve latest articles.", { parse_mode: "HTML" });
  }
});

module.exports = bot;
