const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/profile', isLoggedIn, profileController.getProfile);
router.post('/profile', isLoggedIn, profileController.updateProfile);

module.exports = router;
