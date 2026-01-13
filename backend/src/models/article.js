const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    feedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true,
        index: true

    },
    summary: {
        type: String
    },
    keywords: {
        type: [String],
        default: []
    },
    content: {
        type: String
    },
    publishedAt: {
        type: Date,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isSaved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);