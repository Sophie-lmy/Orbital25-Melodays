const express = require('express');
const router = express.Router();
const {
  recommendByMood,
  recommendByActivity
} = require('../controllers/recommendController');

router.post('/mood', recommendByMood);
router.post('/activity', recommendByActivity);

module.exports = router;