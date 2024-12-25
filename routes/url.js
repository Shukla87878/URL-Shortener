// routes/url.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// URL model (assuming a simple model with short and long URL)
const Url = mongoose.model('Url', new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
}));

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     description: Shorten a URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: http://example.com
 *     responses:
 *       200:
 *         description: URL successfully shortened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: http://localhost:3000/abc123
 */
router.post('/', async (req, res) => {
  const { longUrl } = req.body;

  // Check if the URL already exists
  let url = await Url.findOne({ longUrl });
  if (url) {
    return res.json({ shortUrl: `http://localhost:3000/${url.shortUrl}` });
  }

  // Create a new shortened URL (you can use a more sophisticated method here)
  const shortUrl = Math.random().toString(36).substring(2, 8);  // Simple random string

  // Save the URL
  url = new Url({ longUrl, shortUrl });
  await url.save();

  res.json({ shortUrl: `http://localhost:3000/${shortUrl}` });
});

/**
 * @swagger
 * /api/shorten/{shortUrl}:
 *   get:
 *     description: Redirect to the long URL from the short URL
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         description: Short URL to redirect
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the long URL
 */
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (!url) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.redirect(url.longUrl);
});

module.exports = router;
