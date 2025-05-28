const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');      // ✅ Make sure this is correct
const authenticate = require('../middleware/auth');  // ✅ This should be your JWT middleware
const { createPost, getAllPosts, deletePost,getUserPosts } = require('../controllers/postController');


// Create a post (protected + image upload)
router.post('/add-post', authenticate, upload.single('image'), createPost);

// Get all posts
router.get('/', getAllPosts);

// Delete a post
router.delete('/:id', authenticate, deletePost);

router.get('/me/posts', authenticate, getUserPosts);


module.exports = router;
