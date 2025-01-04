const express = require("express");
const router = express.Router();

const { addPhoto , getAllPhotos,getPriorityScore,calculatePriorityScoreInternal, getPendingReports, getResolvedReports, updateToInProgress, updateToResolved, getPlaceName, getAddress, getInProgressReports} = require("../Controllers/photoController");


const multer = require("multer");
const path = require('path');
const fs = require('fs');
const photoModel = require("../Models/photo");
const {calculateDistance} = require('../Utils/helper.js');


router.get('/findall', getAllPhotos);

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/');
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const fileName =`${Date.now()}${fileExtension}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

router.post('/upload-photo', upload.single('image'), async (req, res) => {
    try {
        const { userId, comment, latitude, longitude } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        if (!userId || !latitude || !longitude) {
            return res.status(400).json({ error: 'userId, latitude, and longitude are required.' });
        }

        // Get absolute path of the uploaded image
        const imagePath = path.join(process.cwd(), 'assets', req.file.filename);

        // Send image path to Python server for pothole detection
        try {
            console.log("trying detecting");
            const response = await fetch('http://127.0.0.1:5000/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_path: imagePath
                })
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`Python server responded with status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            // If no pothole detected, delete the uploaded image and return early
            if (!data.pothole_detected) {
                fs.unlinkSync(imagePath);
                return res.status(400).json({
                    message: 'No pothole detected in the image.',
                    pothole_detected: false
                });
            }

            const severityScore = await calculatePriorityScoreInternal(
                parseFloat(latitude), 
                parseFloat(longitude)
            );
    
            console.log(`severity ${severityScore}`);
    

            const photoUrl = `/assets/${req.file.filename}`;
            console.log("pooothole")
            const newLatitude = parseFloat(latitude);
            const newLongitude = parseFloat(longitude);

            // Check for nearby existing potholes
            const existingPhotos = await photoModel.find();
            
            for (const photo of existingPhotos) {
                const distance = calculateDistance(
                    newLatitude,
                    newLongitude,
                    parseFloat(photo.latitude),
                    parseFloat(photo.longitude)
                );

                if (distance <= -1) {
                    if (photo.status === 'reported') {
                        photo.no_of_reports += 1;
                        photo.timeStamp.push(new Date());
                        await photo.save();
                        
                        // Since we're incrementing an existing pothole, we can keep the new image
                        return res.status(200).json({
                            message: 'Nearby reported pothole found. Number of reports incremented.',
                            photo,
                            pothole_detected: true
                        });
                    } else if (photo.status === 'in-progress' || photo.status === 'resolved') {
                        // Delete the new image since we don't need it
                        fs.unlinkSync(imagePath);
                        return res.status(200).json({
                            message: 'Pothole in this area is already being addressed.',
                            photo,
                            pothole_detected: true
                        });
                    }
                }
            }

            // If we get here, we need to create a new pothole entry
            const newPhoto = new photoModel({
                userId,
                photoUrl,
                comment: comment || '',
                latitude: latitude || '',
                longitude: longitude || '',
                timeStamp: [new Date()],
                no_of_reports: 1,
                status: 'reported',
                severity: severityScore|| 0
            });

            // Save the photo document to the database
            const savedPhoto = await newPhoto.save();

            res.status(201).json({
                message: 'Pothole detected and reported successfully.',
                photo: savedPhoto,
                pothole_detected: true
            });

        } catch (fetchError) {
            // Clean up the uploaded file in case of error
            fs.unlinkSync(imagePath);
            throw new Error(`Error detecting pothole: ${fetchError.message}`);
        }

    } catch (error) {
        console.error('Error uploading photo:', error);
        
        // If there was an error and the file exists, try to delete it
        if (req.file) {
            const imagePath = path.join(process.cwd(), 'assets', req.file.filename);
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        
        res.status(500).json({
            error: 'Internal server error.',
            details: error.message,
        });
    }
});

router.post('/priority-score', getPriorityScore);
router.get('/reported', getPendingReports);
router.get('/resolved', getResolvedReports);
router.get('/getInProgress', getInProgressReports);
router.post('/in-progress', updateToInProgress);
router.post('/updatetoresolved', updateToResolved);
router.get('/getAddress', getAddress);
module.exports = router;
