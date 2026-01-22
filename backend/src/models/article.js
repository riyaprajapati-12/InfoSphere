const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    link: { type: String, required: true }, // unique: true yahan se hata diya
    summary: { type: String },
    keywords: { type: [String], default: [] },
    content: { type: String },
    publishedAt: { type: Date, required: true },
    isRead: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false }
}, { timestamps: true });

// ✅ Fix: Har user ke liye link unique hona chahiye, global nahi
articleSchema.index({ userId: 1, link: 1 }, { unique: true });

module.exports = mongoose.model('Article', articleSchema);