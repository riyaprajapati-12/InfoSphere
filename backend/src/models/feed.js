const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    feedUrl: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: String
    },
    userCategory: {
        type: String,
        default: 'Uncategorized'
    },
    lastFetched: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

feedSchema.index({ userId: 1, feedUrl: 1 }, { unique: true });

module.exports = mongoose.model('Feed', feedSchema);