const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    googleLogin,
    verifyOtp,
    resendOtp,
   getMe,
   generateTelegramToken,
   connectTelegram,
   updateSettings

} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/verify-otp', verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/me", protect, getMe);
router.post('/telegram/token', protect, generateTelegramToken);
router.post('/telegram/connect', connectTelegram);
router.post('/settings', protect, updateSettings);
module.exports = router;
