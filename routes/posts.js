const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');      
const authenticate = require('../middleware/auth');  
const { createPost, getAllPosts, deletePost,getUserPosts } = require('../controllers/postController');


// Create a post (protected + image upload)
router.post('/add-post', authenticate, upload.single('image'), createPost);

// Get all posts
router.get('/', getAllPosts);

// Delete a post
router.delete('/:id', authenticate, deletePost);

router.get('/me/posts', authenticate, getUserPosts);


module.exports = router;
