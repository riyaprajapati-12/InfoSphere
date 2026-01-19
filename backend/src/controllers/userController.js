const User = require('../models/user');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail'); // Assuming you have this utility
const crypto = require('crypto');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Feed = require('../models/feed');
const Article = require('../models/article');

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ message: 'User already exists and is verified' });
            } else {
                // Resend OTP for an unverified user
                const otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

                user.otp = otp;
                user.otpExpires = otpExpires;
                await user.save();

                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'OTP Verification',
                        message: `Your new OTP for registration is ${otp}`,
                    });
                    return res.status(200).json({ message: 'An unverified user with this email already exists. A new OTP has been sent.' });
                } catch (error) {
                    console.error('Error resending OTP:', error);
                    return res.status(500).json({ message: 'Error sending OTP' });
                }
            }
        }

        // Create new user if they don't exist
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user = new User({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'OTP Verification',
                message: `Your OTP for registration is ${otp}`,
            });
            res.status(201).json({ message: 'User registered successfully. Please check your email for OTP.' });
        } catch (error) {
            console.error('Error sending OTP during signup:', error);
            // Optional: delete the user if email fails to send
            // await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: 'User created, but failed to send OTP. Please try signing up again.' });
        }
    } catch (error) {
        console.error('Server error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Include password explicitly
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Account not verified. Please check your email for the OTP.' });
    }

    // Check if user has password set (for Google signup, password may be undefined)
    if (!user.password) {
      return res.status(400).json({ message: 'No password set. Please login using Google or reset your password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
  if (err) throw err;

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      
    }
  });
});


  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Authenticate user with Google
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = async (req, res) => {
    const { credential } = req.body; // The ID token from the frontend

    try {
        // 1. Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, sub: googleId } = ticket.getPayload();

        // 2. Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, ensure their googleId is stored if they previously signed up with email
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // 3. If user doesn't exist, create a new one
            user = new User({
                name,
                email,
                googleId,
                isVerified: true, // Google verifies email, so we can set this to true
            });
            await user.save();
        }

        // 4. Create JWT and send it back
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
  token,
  user,
});

            }
        );
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Server error during Google login' });
    }
};


// controllers/authController.js

// ... (signup, login, googleLogin functions ke baad isse add karein)

// @desc    Verify user's email with OTP
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Fetch user including OTP fields
    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    // Check OTP validity
    const isOtpValid =
      user.otp &&
      user.otp.toString() === otp.toString() &&
      user.otpExpires.getTime() > Date.now();

    if (!isOtpValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          success: true,
          token,
          message: "Account verified successfully!",
        });
      }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Resend OTP for email verification
// @route   POST /api/users/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // If already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified. Please login.",
      });
    }

    // Generate new OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send email
    await sendEmail({
      email: user.email,
      subject: "OTP Verification",
      message: `Your OTP for email verification is ${otp}`,
    });

    res.status(200).json({
      success: true,
      message: "OTP has been resent successfully.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again.",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    
    // User ke specific counts nikaalein
    const feedCount = await Feed.countDocuments({ userId: req.user.id });
    const aiSummaryCount = await Article.countDocuments({ 
      userId: req.user.id, 
      summary: { $ne: null } // Sirf wo articles jinme summary exist karti hai
    });

    res.json({
      ...user._doc,
      feedCount,
      aiSummaryCount
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const generateTelegramToken = async (req, res) => {
  try {
    // ✅ Already connected
    if (req.user.telegramConnected) {
      return res.json({
        connected: true,
        message: "Telegram already connected",
      });
    }

    // ✅ Reuse existing token if still valid
    if (
      req.user.telegramLinkToken &&
      req.user.telegramTokenExpiresAt &&
      req.user.telegramTokenExpiresAt > Date.now()
    ) {
      return res.json({
        token: req.user.telegramLinkToken,
        expiresAt: req.user.telegramTokenExpiresAt,
      });
    }

    // ✅ Generate new token
    const token = crypto.randomBytes(16).toString("hex");

    req.user.telegramLinkToken = token;
    req.user.telegramTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    req.user.telegramConnected = false;

    await req.user.save();

    res.json({
      token,
      expiresAt: req.user.telegramTokenExpiresAt,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to generate token" });
  }
};

const connectTelegram = async (req, res) => {
  const { token, telegramId, chatId } = req.body;

  const user = await User.findOne({
    telegramLinkToken: token,
    telegramTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.telegramId = telegramId;
  user.telegramChatId = chatId;
  user.telegramConnected = true;

  // 🔥 delete token after success
  user.telegramLinkToken = null;
  user.telegramTokenExpiresAt = null;

  await user.save();

  res.json({ message: "Telegram connected successfully" });
};

module.exports = {
    signup,
    login,
    googleLogin,
    verifyOtp, 
   resendOtp,
   getMe,
   generateTelegramToken,
   connectTelegram
};