const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/preview', async (req, res) => {
  const previewUrl = req.query.url;
  console.log("🎧 Incoming preview request for:", previewUrl); // 👈 Add this
  if (!previewUrl) return res.status(400).send('Missing preview URL.');

  try {
    const response = await axios.get(previewUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying preview:', error.message);
    res.status(500).send('Failed to stream preview.');
  }
});

module.exports = router;
