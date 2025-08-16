const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/SummaryController');

router.post('/generate', summaryController.generateSummary);
router.put('/edit/:id', summaryController.editSummary);
router.post('/share/:id', summaryController.shareSummary);
router.get('/summaries',summaryController.getSummaries);
router.delete('/deleteSummaries/:id',summaryController.deleteSummaries);

module.exports = router;