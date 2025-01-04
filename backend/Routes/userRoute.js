const express = require('express');
const { handleUserLogin} = require('../Controllers/userController');

const router = express.Router();

router.post('/login', handleUserLogin);



module.exports = router;
