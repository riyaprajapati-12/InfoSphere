const Article = require('../models/article');
const User = require('../models/user');
const { generateSummaryAndKeywords } = require('../services/aiService');

// ✅ Secure fetching of articles
const getArticles = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const isRead = req.query.isRead;
    const query = { userId: req.user.id };

    if (isRead !== undefined) query.isRead = isRead === 'true';

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Article.countDocuments(query);
    res.status(200).json({ articles, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Improved Interest Tracking Logic
const markAsRead = async (req, res) => {
    try {
        // Security Check: Ensure article belongs to user
        const article = await Article.findOne({ _id: req.params.id, userId: req.user.id });
        if (!article) return res.status(404).json({ message: 'Article not found' });

        // Only track interest if not already read
        if (!article.isRead) {
            article.isRead = true;
            await article.save();

            const user = await User.findById(req.user.id);
            if (article.keywords && article.keywords.length > 0) {
                article.keywords.forEach(keyword => {
                    const currentScore = user.keywordProfile.get(keyword) || 0;
                    user.keywordProfile.set(keyword, currentScore + 1);
                });
                await user.save();
            }
        }
        res.status(200).json({ message: "Article read and interest tracked" });
    } catch (error) {
        res.status(500).json({ message: 'Tracking failed' });
    }
};

// ✅ Secure Manual Summary
// controllers/articleController.js

const triggerManualSummary = async (req, res) => {
  try {
    // 1. Article aur User dono ka data fetch karein
    const article = await Article.findOne({ _id: req.params.id, userId: req.user.id });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Agar summary pehle se hai, toh wahi bhej do (Optional: agar aap translation har baar chahte hain toh ise hata dein)
    if (article.summary) {
      return res.json({ summary: article.summary, keywords: article.keywords });
    }

    const user = await User.findById(req.user.id);
    const targetLanguage = user.preferredLanguage || 'English'; // Default to English if not set

    // 2. AI Service ko target language ke saath call karein
    const aiData = await generateSummaryAndKeywords(article.content, targetLanguage);

    if (aiData) {
      // 3. Translated summary aur keywords ko database mein save karein
      article.summary = aiData.summary;
      article.keywords = aiData.keywords;
      await article.save();

      return res.json(aiData);
    }

    res.status(500).json({ message: "AI generation failed" });
  } catch (err) {
    console.error("Manual Summary Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article || article.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Article not found or unauthorized" });
    }

    // 🔥 User ka interest track karein (Recommendation Logic)
    const user = await User.findById(req.user.id);
    if (article.keywords && article.keywords.length > 0) {
      article.keywords.forEach(keyword => {
        const currentScore = user.keywordProfile.get(keyword) || 0;
        user.keywordProfile.set(keyword, currentScore + 1);
      });
      await user.save();
    }

    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = { getArticles, markAsRead, getSingleArticle,triggerManualSummary };