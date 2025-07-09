const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Rotas para chats
router.get('/users/:userId/type/:userType/chats', chatController.getChats);
router.get('/chats/:chatId', chatController.getChatById);
router.post('/chats', chatController.createChat);

// Rotas para mensagens
router.get('/chats/:chatId/messages', chatController.getMessages);
router.post('/chats/:chatId/messages', chatController.sendMessage);
router.post('/chats/:chatId/read', chatController.markMessagesAsRead);

module.exports = router;