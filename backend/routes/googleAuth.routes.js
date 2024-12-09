import express from 'express';
import { getGoogleTokens, getGoogleUserInfo } from '../utils/googleAuth.js';
import { generateToken } from '../utils/jwt.js';
import User from '../models/user.js';

const router = express.Router();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const REDIRECT_URI = 'http://localhost:5000/auth/google/callback';

// Redirect to Google OAuth
router.get('/google', (req, res) => {
  const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=email%20profile`;

  res.redirect(redirectUri);
});

// Google OAuth Callback
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Step 1: Exchange code for tokens
    const { access_token } = await getGoogleTokens(
      code,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );

    // Step 2: Get user info
    const { id, email, name, picture } = await getGoogleUserInfo(access_token);

    // Step 3: Check or create user in MongoDB
    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = new User({
        googleId: id,
        email,
        name,
        profilePicture: picture,
      });
      await user.save();
    }

    // Step 4: Generate JWT
    const token = generateToken({ id: user._id, email: user.email });

    res.json({ token });
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

export default router;
