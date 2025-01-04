const router = require("express").Router();
const userModel = require("../Models/user")

const handleUserLogin = async (req, res) => {
    try {
        console.log("Received login data:", req.body);
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

        

        res.status(200).json({
            message: 'User logged in successfully!',
            user,
        });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


module.exports = { handleUserLogin};