const router = require("express").Router();

const photoModel = require("../Models/photo");

// Controller to add a photo
const addPhoto = async (req, res) => {
    try {
        const { userId, photoUrl, comment, longitude, latitude } = req.body;

        // Validate required fields
        if (!userId || !photoUrl) {
            return res.status(400).json({ error: "userId and photoUrl are required." });
        }

        // Create a new photo document
        const newPhoto = new photoModel({
            userId,
            photoUrl,
            comment: comment || "", // Optional field
            longitude: longitude || "", // Optional field
            latitude: latitude || "", // Optional field
        });

        // Save to database
        const savedPhoto = await newPhoto.save();

        // Respond with success
        res.status(201).json({
            message: "Photo added successfully.",
            photo: savedPhoto,
        });
    } catch (error) {
        console.error("Error adding photo:", error);
        res.status(500).json({
            error: "Internal server error.",
            details: error.message,
        });
    }
};

const getAllPhotos = async (req, res) => {
    try {
        const { userId } = req.query; // Optional filter by userId

        // Build query object
        const query = userId ? { userId } : {};

        // Fetch photos
        const photos = await photoModel.find(query);

        res.status(200).json({
            message: "Photos retrieved successfully.",
            photos,
        });
    } catch (error) {
        console.error("Error fetching photos:", error);
        res.status(500).json({
            error: "Internal server error.",
            details: error.message,
        });
    }
};

module.exports = { addPhoto , getAllPhotos};
