const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Points to http://localhost:5000/api/reports/submit
router.post('/submit', reportController.createReport);

module.exports = router;