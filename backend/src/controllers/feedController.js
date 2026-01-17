const Feed = require('../models/feed');
const Parser = require('rss-parser');
const parser = new Parser();
const User = require("../models/user");
const Article = require('../models/article');
const addFeed = async (req, res) => {
    const { feedUrl } = req.body;
    const userId = req.user.id;

    if (!feedUrl) {
        return res.status(400).json({ message: 'Please provide a feed URL' });
    }
    try {
        const existingFeed = await Feed.findOne({ userId, feedUrl });
        if (existingFeed) {
            return res.status(400).json({ message: 'You have already added this feed' });
        }
        const feedData = await parser.parseURL(feedUrl);
        const newFeed = new Feed({
            userId,
            feedUrl,
            title: feedData.title,
            description: feedData.description,
            link: feedData.link,
        });
        await newFeed.save();
        res.status(201).json(newFeed);
    } catch (error) {
        console.error('Error adding feed:', error);
        res.status(500).json({ message: 'Failed to add feed. The URL might be invalid.' });
    }
};

const getUserFeeds = async (req, res) => {
    try {
        const feeds = await Feed.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(feeds);
    } catch (error) {
        console.error('Error fetching user feeds:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteFeed = async (req, res) => {
    try {
        const feed = await Feed.findById(req.params.id);
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found' });
        }
        if (feed.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await feed.deleteOne();
        res.status(200).json({ message: 'Feed removed successfully' });
    } catch (error) {
        console.error('Error deleting feed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



const getPersonalizedFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // User ke top interest keywords nikalo
    const sortedKeywords = [...user.keywordProfile.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 5);

    // Agar user naya hai aur koi history nahi hai
    if (sortedKeywords.length === 0) {
      const trending = await Article.find({ userId: req.user.id }) // Article model use karein
        .sort({ publishedAt: -1 })
        .limit(20);
      return res.json(trending);
    }

    // Personalized articles dikhao jo user ke interests se match karein
    const feed = await Article.find({
      userId: req.user.id,
      keywords: { $in: sortedKeywords }
    }).sort({ publishedAt: -1 });

    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: "Error fetching personalized feed" });
  }
};

module.exports = { addFeed, getUserFeeds, deleteFeed, getPersonalizedFeed  };