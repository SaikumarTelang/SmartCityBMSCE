const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/', reportController.getReports);
router.post('/submit', reportController.createReport);
router.post('/:id/upvote', reportController.upvoteReport);
router.patch('/:id/status', reportController.updateStatus);
router.post('/:id/dispatch', reportController.dispatchReport);

module.exports = router;
