const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { addComment, getCommentsByPost } = require('../controllers/commentController');

// Add comment to a post (protected)
router.post('/post/:postId/add', authenticate, addComment);

// Get comments of a post (public or protected based on your app needs)
router.get('/post/:postId', getCommentsByPost);

module.exports = router;
