const express = require("express");
const router = express.Router();
const { addPhoto , getAllPhotos} = require("../Controllers/photoController");

// Route to add a photo
router.post("/add", addPhoto);
router.get('/findall', getAllPhotos)

module.exports = router;
