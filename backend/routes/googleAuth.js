const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModal");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


// 1) Send Google Auth URL to frontend
router.get("/google/url", (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent"
    })}`;

    res.json({ url });
});

// 2) Google callback
router.get("/google/callback", async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange code for tokens
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code",
            }
        );

        const { id_token, access_token } = tokenResponse.data;

        // Get user info from Google
        const userInfo = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo`,
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );

        const { sub, email, name, picture } = userInfo.data;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new Google user
            user = await User.create({
                name,
                email,
                image: picture ? picture : null,
                provider: "google",
                googleId: sub
            });
        }

        // Generate JWT (same as your existing login)
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        const userObj = user.toObject();
        delete userObj.password;

        const userPayload = Buffer.from(JSON.stringify(userObj)).toString("base64");

        // URL-encode the base64 so it survives the query string safely
        const safeUserPayload = encodeURIComponent(userPayload);

        return res.redirect(
            `${process.env.FRONTEND_URL}/oauth-success?token=${token}&user=${safeUserPayload}`
        );

    } catch (err) {
        console.error(err);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=OAuthFailed`);
    }
});

module.exports = router;

