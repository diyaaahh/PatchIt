const express = require("express");
const router = express.Router();
const { addPhoto , getAllPhotos,getPriorityScore} = require("../Controllers/photoController");

// Route to add a photo
router.post("/add", addPhoto);
router.get('/findall', getAllPhotos)
router.post('/priority-score', getPriorityScore);

module.exports = router;
