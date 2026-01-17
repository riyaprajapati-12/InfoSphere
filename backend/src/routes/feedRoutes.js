const express = require('express');
const router = express.Router();
const { addFeed, getUserFeeds, deleteFeed, getPersonalizedFeed } = require('../controllers/feedController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addFeed)
    .get(protect, getUserFeeds);

router.route('/:id')
    .delete(protect, deleteFeed);

    router.get("/personalized", protect, getPersonalizedFeed);

module.exports = router;