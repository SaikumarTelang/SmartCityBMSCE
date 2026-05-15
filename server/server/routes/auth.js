const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Points to http://localhost:5000/api/auth/register
router.post('/register', userController.registerUser);

module.exports = router;