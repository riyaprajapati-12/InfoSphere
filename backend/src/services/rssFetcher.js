// const Parser = require("rss-parser");
// const Feed = require("../models/feed");
// const Article = require("../models/article");
// const { generateSummaryAndKeywords } = require("./aiService");
// const striptags = require("striptags");
// const { extractFullArticle } = require("./scraper");
// const { sendTelegramMessage } = require("./telegramService");
// const parser = new Parser();

// const MAX_AI_CALLS = 10;
// let aiCount = 0;

// // 🧠 Local fallback summary
// function localSummary(text) {
//   return text.split(". ").slice(0, 3).join(". ") + ".";
// }

// const fetchAndStoreArticles = async () => {
//   console.log("🚀 Fetcher Started");

//   const allFeeds = await Feed.find();

//   for (const feed of allFeeds) {
//     try {
//       const feedData = await parser.parseURL(feed.feedUrl);

//       for (const item of feedData.items) {
//         if (await Article.findOne({ link: item.link })) continue;

//         const fullArticle = await extractFullArticle(item.link);
//         const rssText = striptags(item.content || item.contentSnippet || "").trim();

//         const cleanContent =
//           fullArticle && fullArticle.length > rssText.length
//             ? fullArticle
//             : rssText;

//         let finalSummary = "Summary not available.";
//         let finalKeywords = [];

//         if (cleanContent.length < 800) {
//           finalSummary = localSummary(cleanContent);
//         } 
//         else if (aiCount < MAX_AI_CALLS) {
//           console.log(`🤖 Gemini summarizing: ${item.title.substring(0, 50)}...`);

//           const aiData = await generateSummaryAndKeywords(cleanContent);

//           if (aiData?.summary) {
//             finalSummary = aiData.summary.trim();
//             finalKeywords = aiData.keywords || [];
//             aiCount++;
//             console.log("✅ Gemini summary saved");
//           } else {
//             finalSummary = localSummary(cleanContent);
//           }
//         } 
//         else {
//           finalSummary = localSummary(cleanContent);
//         }

//         await new Article({
//           feedId: feed._id,
//           userId: feed.userId,
//           title: item.title,
//           link: item.link,
//           content: cleanContent,
//           summary: finalSummary,
//           keywords: finalKeywords,
//           publishedAt: new Date()
//         }).save();

//         const user = await User.findById(feed.userId);
// if (user && user.telegramChatId) {
//     const message = `<b>New Article:</b> ${item.title}\n\n${finalSummary}\n\n<a href="${item.link}">Read More</a>`;
//     await sendTelegramMessage(user.telegramChatId, message);
// }

//         // 🛑 Stop after 1 AI test (FREE tier safety)
//        if (aiCount >= MAX_AI_CALLS) {
//   console.log("🧪 Gemini limit reached. Remaining articles will use fallback.");
// }
//       }

//       feed.lastFetched = new Date();
//       await feed.save();

//     } catch (err) {
//       console.error("❌ Feed error:", feed.feedUrl);
//     }
//   }
// };

// module.exports = { fetchAndStoreArticles };

const Parser = require("rss-parser");
const Feed = require("../models/feed");
const Article = require("../models/article");
const User = require("../models/user");
const normalizeUrl = require("../utils/normalizeUrl");
const { extractFullArticle } = require("./scraper");
const bot = require("../telegram/bot");

const parser = new Parser();

const fetchAndStoreArticles = async () => {
  console.log("🚀 Neural Fetcher Started");
  const feeds = await Feed.find();

  for (const feed of feeds) {
    try {
      const feedData = await parser.parseURL(feed.feedUrl);
      const user = await User.findById(feed.userId);

      for (const item of feedData.items) {
        const link = normalizeUrl(item.link);

        // ✅ Per-user Duplicate Check
        const exists = await Article.findOne({ userId: feed.userId, link });
        if (exists) continue;

        console.log("🆕 Indexing:", item.title);
        const fullContent = await extractFullArticle(link);
        
        // Save without mandatory AI summary (user can trigger later)
        const savedArticle = await Article.create({
            feedId: feed._id,
            userId: feed.userId,
            title: item.title,
            link,
            content: fullContent || item.contentSnippet || item.content || "",
            publishedAt: new Date(),
            isRead: false
        });

        // ✅ Instant Telegram Notification
        if (user && user.telegramConnected && user.notificationPreference === 'instant') {
            const message = `<b>🔔 New:</b> ${item.title}\n\n<a href="${link}">Read More</a>`;
            bot.sendMessage(user.telegramChatId, message, { parse_mode: 'HTML' })
               .catch(err => console.error("Telegram Error:", err.message));
        }
      }
      feed.lastFetched = new Date();
      await feed.save();
    } catch (err) {
      console.error("❌ Feed error:", feed.feedUrl);
    }
  }
  console.log("✅ Fetch cycle complete");
};

module.exports = { fetchAndStoreArticles };