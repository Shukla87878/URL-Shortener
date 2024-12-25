// routes/analytics.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Analytics model (for tracking clicks)
const Analytics = mongoose.model('Analytics', new mongoose.Schema({
  shortUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
}));

/**
 * @swagger
 * /api/analytics/{shortUrl}:
 *   get:
 *     description: Get analytics data (clicks) for a short URL
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         description: Short URL to get analytics for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: abc123
 *                 clicks:
 *                   type: number
 *                   example: 42
 *                 lastAccessed:
 *                   type: string
 *                   example: '2024-12-21T10:00:00.000Z'
 */
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  // Find analytics for the given short URL
  let analytics = await Analytics.findOne({ shortUrl });

  if (!analytics) {
    // If no analytics exist, create an entry
    analytics = new Analytics({ shortUrl });
    await analytics.save();
  }

  res.json({
    shortUrl,
    clicks: analytics.clicks,
    lastAccessed: analytics.lastAccessed
  });
});

/**
 * @swagger
 * /api/analytics/{shortUrl}/track:
 *   post:
 *     description: Track a click on the short URL
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         description: Short URL to track clicks
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Click tracked
 */
router.post('/:shortUrl/track', async (req, res) => {
  const { shortUrl } = req.params;

  // Find the analytics entry
  let analytics = await Analytics.findOne({ shortUrl });

  if (!analytics) {
    // If no analytics exist, create an entry
    analytics = new Analytics({ shortUrl });
  }

  // Increment the click count
  analytics.clicks += 1;
  analytics.lastAccessed = new Date();

  // Save the updated analytics
  await analytics.save();

  res.json({ message: 'Click tracked', clicks: analytics.clicks });
});

module.exports = router;
