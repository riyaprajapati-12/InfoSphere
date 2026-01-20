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

bot.onText(/\/summary\s*(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const articleUrl = match[1]?.trim(); // User jo link bhejega

  try {
    // 1. Check karein ki link provide kiya hai ya nahi
    if (!articleUrl) {
      return bot.sendMessage(chatId, "⚠️ <b>Usage:</b> <code>/summary [article_link]</code>\n\nExample:\n<code>/summary https://example.com/news</code>", { parse_mode: "HTML" });
    }

    // 2. User ko dhoondho aur security check
    const user = await User.findOne({ telegramChatId: chatId.toString() });
    if (!user) {
      return bot.sendMessage(chatId, "❌ Account not linked. Connect via Dashboard first.");
    }

    bot.sendMessage(chatId, "🤖 <b>Processing Intelligence...</b>\nFetching content and generating neural summary.", { parse_mode: "HTML" });

    // 3. Database mein article dhoondho
    // Hum normalizeUrl use karenge taaki link match ho jaye
    const normalized = articleUrl.toLowerCase().split('?')[0]; 
    const article = await Article.findOne({ 
      userId: user._id, 
      link: { $regex: normalized, $options: 'i' } 
    });

    if (!article) {
      return bot.sendMessage(chatId, "❌ <b>Article Not Found.</b>\nMake sure the article exists in your feed.", { parse_mode: "HTML" });
    }

    // 4. Summary check karein (agar pehle se ho toh wahi bhej do)
    if (article.summary) {
      return bot.sendMessage(chatId, `✨ <b>Neural Summary:</b>\n\n${article.summary}`, { parse_mode: "HTML" });
    }

    // 5. AI call karein agar summary nahi hai
    const aiData = await generateSummaryAndKeywords(article.content);

    if (aiData?.summary) {
      // Database update karein taaki website par bhi dikhe
      article.summary = aiData.summary;
      article.keywords = aiData.keywords || [];
      await article.save();

      bot.sendMessage(chatId, `✨ <b>Neural Summary:</b>\n\n${aiData.summary}`, { parse_mode: "HTML" });
    } else {
      bot.sendMessage(chatId, "⚠️ AI engine is busy. Could not generate summary at this moment.");
    }

  } catch (err) {
    console.error("Telegram /summary error:", err.message);
    bot.sendMessage(chatId, "❌ <b>Error:</b> Failed to process summary request.");
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
