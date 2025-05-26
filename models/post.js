const pool = require('../config/db');

const createPost = async (post) => {
  const { id, userId, caption, imageUrl, createdAt } = post;
  await pool.query(
    'INSERT INTO posts (id, user_id, caption, image_url, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, userId, caption, imageUrl, createdAt]
  );
};

const getAllPosts = async () => {
  const [rows] = await pool.query(
    'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC'
  );
  return rows;
};

const deletePost = async (postId) => {
  await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
};

module.exports = {
  createPost,
  getAllPosts,
  deletePost,
};
