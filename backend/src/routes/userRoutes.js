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
   connectTelegram

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

module.exports = router;
