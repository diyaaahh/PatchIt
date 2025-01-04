const express = require("express");
const router = express.Router();
const { getAllPhotos,getPriorityScore, getPendingReports, getResolvedReports} = require("../Controllers/photoController");


const multer = require("multer");
const photoModel = require("../Models/photo");

// Route to add a photo
router.get('/findall', getAllPhotos)
const path = require('path');

// Set up multer to store images in the 'assets' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/'); // Specify the 'assets' directory
    },
    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${Date.now()}${fileExtension}`;
      cb(null, fileName); // Create a unique filename
    },
  });
  const upload = multer({ storage });


// Controller to add a photo
router.post('/upload-photo', upload.single('image'), async (req, res) => {
  try {
    const { userId, comment, latitude, longitude } = req.body;
    const photoUrl = `/assets/${req.file.filename}`; // Relative URL to the image
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
      
    // Validate required fields
    if (!userId || !photoUrl) {
      return res.status(400).json({ error: 'userId and photoUrl are required.' });
    }

    // Create a new photo document
    const newPhoto = new photoModel({
      userId,
      photoUrl,
      comment: comment || '',
      latitude: latitude || '',
      longitude: longitude || '',
    });

    // Save the photo document to the database
    const savedPhoto = await newPhoto.save();

    // Respond with success
    res.status(201).json({
      message: 'Photo uploaded and saved successfully.',
      photo: savedPhoto,
    });
  } catch (error) {
    console.error('Error adding photo:', error);
    res.status(500).json({
      error: 'Internal server error.',
      details: error.message,
    });
  }
});

router.post('/priority-score', getPriorityScore);
router.get('/reported', getPendingReports);
router.get('/resolved', getResolvedReports);

module.exports = router;