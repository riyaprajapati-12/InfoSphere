const Feed = require('../models/feed');
const Parser = require('rss-parser');
const parser = new Parser();

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

module.exports = { addFeed, getUserFeeds, deleteFeed };