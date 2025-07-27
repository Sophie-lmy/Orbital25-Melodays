const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const authenticate = require('../middleware/authMiddleware');

router.get('/notes/all', authenticate, diaryController.getAllEntriesWithNote);
router.get('/', authenticate, diaryController.getAllDiaryEntries);
router.get('/:id', authenticate, diaryController.getDiaryEntryById);
router.patch('/:id', authenticate, diaryController.updateDiaryNote);
router.get('/diary/summary', authenticate, diaryController.getTypeFrequencies);


module.exports = router;