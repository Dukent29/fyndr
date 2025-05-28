const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { sendMessage, getConversation, getRecentConversations } = require('../controllers/messageController');

//  Envoyer un message
router.post('/send', authenticate, sendMessage);

//  Obtenir une conversation
router.get('/conversation/:userId', authenticate, getConversation);

router.get('/recent', authenticate, getRecentConversations);

router.post('/:receiverId', authenticate, sendMessage);



module.exports = router;
