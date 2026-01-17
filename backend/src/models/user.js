const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    select: false,
  },

  name: {
    type: String,
    trim: true,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  keywordProfile: {
    type: Map,
    of: Number,
    default: {}
  },

  // 🔹 Telegram fields
  telegramId: {
    type: String,
    unique: true,
    sparse: true,
  },

  telegramChatId: {
    type: String,
    unique: true,
    sparse: true,
  },

  telegramLinkToken: {
    type: String,
    default: null,
    index: true,
  },

  telegramTokenExpiresAt: {
    type: Date,
    default: null,
  },

  telegramConnected: {
    type: Boolean,
    default: false,
  },

  // 🔹 Auth helpers
  otp: {
    type: String,
    select: false,
  },

  otpExpires: {
    type: Date,
    select: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
