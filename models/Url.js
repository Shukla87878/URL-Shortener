
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String },
  analytics: {
    clicks: { type: Number, default: 0 },
    uniqueClicks: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);
