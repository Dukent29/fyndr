const pool = require('../db'); // your DB connection

// Add a comment to a post
const addComment = async (req, res) => {
  const { post_id, text } = req.body;
  const user_id = req.user.id;

  if (!post_id || !text) {
    return res.status(400).json({ message: 'post_id and text are required' });
  }

  try {
    await pool.query(
      'INSERT INTO comments (post_id, user_id, text, created_at) VALUES (?, ?, ?, NOW())',
      [post_id, user_id, text]
    );
    res.status(201).json({ message: 'Comment added!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all comments for a post
const getCommentsByPost = async (req, res) => {
  const post_id = req.params.postId;

  try {
    const [comments] = await pool.query(
      `SELECT comments.*, users.username 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE comments.post_id = ? 
       ORDER BY comments.created_at DESC`,
      [post_id]
    );

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addComment, getCommentsByPost };
