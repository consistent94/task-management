const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login an existing user
router.post('/login', authController.login);

// Get currently authenticated user
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;