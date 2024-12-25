// routes/auth.js
const express = require('express');
const router = express.Router();

// Placeholder route for authentication
router.post('/login', (req, res) => {
    res.send('Login route');
});

router.post('/register', (req, res) => {
    res.send('Register route');
});

module.exports = router;
