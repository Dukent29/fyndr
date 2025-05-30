const pool = require('../config/db');  database connection 

const createPost = async (req, res) => {
  const { caption } = req.body;
  const user_id = req.user.id; //  user ID 
  const image = req.file ? req.file.filename : null;

  if (!caption || !image) {
    return res.status(400).json({ message: 'Missing caption or image' });
  }

  try {
    await pool.query(
      'INSERT INTO posts (id, caption, image_url, user_id, created_at) VALUES (UUID(), ?, ?, ?, NOW())',
      [caption, image, user_id]
    );
    res.status(201).json({ message: 'Post created!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT posts.*, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const deletePost = async (req, res) => {
  const postId = req.params.id;
  const user_id = req.user.id;

  try {
    //  user  their own posts
    const [result] = await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserPosts = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query('SELECT id, image_url FROM posts WHERE user_id = ?', [userId]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des posts' });
  }
};


module.exports = { createPost, getAllPosts, deletePost, getUserPosts };
