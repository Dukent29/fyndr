const pool = require('../config/db'); // your DB connection

// Add a comment to a specific post
const addComment = async (req, res) => {
  const { postId } = req.params; // get postId from URL param
  const user_id = req.user.id;    // from the authenticated user token
  const { text } = req.body;      // comment text from body

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    await pool.query(
      'INSERT INTO comments (post_id, user_id, text, created_at) VALUES (?, ?, ?, NOW())',
      [postId, user_id, text]
    );
    res.status(201).json({ message: 'Comment added!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all comments for a specific post
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const [comments] = await pool.query(
      'SELECT c.id, c.text, c.created_at, u.id AS user_id, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC',
      [postId]
    );
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addComment, getCommentsByPost };
