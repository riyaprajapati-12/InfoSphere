const express = require('express');
const router = express.Router();
const { getArticles, markAsRead, getSingleArticle,triggerManualSummary } = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getArticles);
router.patch('/:id/read', protect, markAsRead);
router.get('/:id', protect, getSingleArticle);
router.post('/:id/summarize', protect, triggerManualSummary);
module.exports = router;