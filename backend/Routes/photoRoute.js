const express = require("express");
const router = express.Router();
const { addPhoto , getAllPhotos,getPriorityScore, getPendingReports, getResolvedReports} = require("../Controllers/photoController");

// Route to add a photo
router.post("/add", addPhoto);
router.get('/findall', getAllPhotos)
router.post('/priority-score', getPriorityScore);
router.get('/reported', getPendingReports);
router.get('/resolved', getResolvedReports);

module.exports = router;
