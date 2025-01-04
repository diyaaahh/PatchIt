const router = require("express").Router();
const userModel = require("../Models/user")

const handleUserLogin = async (req, res) => {
    try {
        const { userId, email, name } = req.body; // Expecting data from Auth0 in the request body


        // Find or create the user in the database
        let user = await userModel.findOne({ userId });
        if (!user) {
            user = await userModel.create({ userId });
        }
        req.session.user = {
            userId: user.userId,
            isAdmin: user.isAdmin,
        };

        res.cookie("session_user", req.session.user, {
            httpOnly: true, 
            secure: false, // Set to true in production (requires HTTPS)
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiry (24 hours)
            sameSite: 'None', // This ensures the cookie is sent with cross-site requests
        });
        

        res.status(200).json({
            message: 'User logged in successfully!',
            user,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
const checkSession = async (req, res) => {
    console.log("Session data:", req.session); // Debug log
    if (req.session && req.session.user) {
        res.status(200).json({ isActive: true, user: req.session.user });
    } else {
        res.status(200).json({ isActive: false });
    }
};

module.exports = { handleUserLogin , checkSession};