const express = require('express');
const router = express.Router();
const controller = require('../controllers/chat.controller');

// POST /api/chat
router.post('/chat', controller.chatWithOpenAI);

module.exports = router;
