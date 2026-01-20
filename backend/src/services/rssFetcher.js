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
const { generateSummaryAndKeywords } = require("./aiService");
const striptags = require("striptags");
const { extractFullArticle } = require("./scraper");
const bot = require("../telegram/bot");
const normalizeUrl = require("../utils/normalizeUrl");

const parser = new Parser();
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const MAX_AI_CALLS = 20;

const fetchAndStoreArticles = async () => {
  console.log("🚀 Neural Fetcher Started");

  let aiCount = 0;
  const feeds = await Feed.find(); //

  for (const feed of feeds) {
    try {
      const feedData = await parser.parseURL(feed.feedUrl); //

      for (const item of feedData.items) {
        const link = normalizeUrl(item.link); //

        // ✅ DUPLICATE CHECK
        const exists = await Article.findOne({ link }); //
        if (exists) continue;

        console.log("\n🆕 Indexing New Intel:", item.title);

        // ✅ SCRAPE FULL CONTENT
        const fullArticle = await extractFullArticle(link); //
        const rssText = striptags(item.content || item.contentSnippet || "").trim();
        const cleanContent = fullArticle && fullArticle.length > rssText.length ? fullArticle : rssText; //

        // ✅ AI SUMMARY (Sirf agar cleanContent 800 chars se bada ho)
        let summary = null; // Default null rakhenge manually trigger karne ke liye
        let keywords = [];

        // Note: Aapne kaha tha ki website par button se summary ho, 
        // isliye fetcher mein hum sirf data store kar rahe hain. 
        // Agar aap auto-summarize chahti hain toh niche ka logic enable karein:
        /*
        if (cleanContent.length > 800 && aiCount < MAX_AI_CALLS) {
          const aiData = await generateSummaryAndKeywords(cleanContent);
          if (aiData?.summary) {
            summary = aiData.summary;
            keywords = aiData.keywords || [];
            aiCount++;
            await sleep(4000); 
          }
        }
        */

        // ✅ SAVE TO DATABASE
        try {
          const savedArticle = await Article.create({
            feedId: feed._id,
            userId: feed.userId,
            title: item.title,
            link,
            content: cleanContent,
            summary, 
            keywords,
            publishedAt: new Date()
          });

          // ✅ TELEGRAM NOTIFICATION LOGIC
          const user = await User.findById(feed.userId);
          
          if (
            user && 
            user.telegramConnected && 
            user.telegramChatId && 
            user.notificationPreference === 'instant' // Sirf instant par hi bhejein
          ) {
            const message = `<b>🔔 New Article:</b> ${item.title}\n\n<i>Source: ${feed.title}</i>\n\n<a href="${link}">Read Full Article</a>`;
            
            bot.sendMessage(user.telegramChatId, message, { parse_mode: 'HTML' })
               .then(() => console.log(`📢 Instant alert sent to ${user.name}`))
               .catch((err) => console.error("❌ Telegram Send Error:", err.message));
          }

        } catch (err) {
          if (err.code === 11000) {
            console.log("⚠️ Duplicate blocked by Mongo unique index");
          } else {
            console.error("❌ Save failed:", err.message);
          }
        }
      }

      feed.lastFetched = new Date();
      await feed.save();

    } catch (err) {
      console.error("❌ Feed error:", feed.feedUrl, err.message);
    }
  }

  console.log("✅ Fetch cycle complete");
};

module.exports = { fetchAndStoreArticles };