const express = require('express');
const multer = require('multer');
const router = express.Router();
const detectionController = require('../controllers/detectionController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/detect', upload.single('image'), detectionController.detectImage);

module.exports = router;
