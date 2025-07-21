const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, diaryController.getAllDiaryEntries);
router.patch('/:id', authenticate, diaryController.updateDiaryNote);

module.exports = router;