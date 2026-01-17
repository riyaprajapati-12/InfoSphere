const Article = require('../models/article');

const getArticles = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const isRead = req.query.isRead; // true / false / undefined

    const query = { userId: req.user.id };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Article.countDocuments(query);

    res.status(200).json({
      articles,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const markAsRead = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        if (article.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        article.isRead = true;
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        console.error('Error marking article as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Is logic ko articleController.js mein daalein
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


module.exports = { getArticles, markAsRead, getSingleArticle };