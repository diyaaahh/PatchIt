const express = require('express');
const { handleUserLogin, checkSession } = require('../Controllers/userController');

const router = express.Router();

router.post('/login', handleUserLogin);
router.get('/session', checkSession)


module.exports = router;
