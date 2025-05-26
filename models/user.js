// models/user.js
const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
};

const createUser = async (user) => {
  const { id, username, email, createdAt } = user;
  await pool.query(
    'INSERT INTO users (id, username, email, created_at) VALUES (?, ?, ?, ?)',
    [id, username, email, createdAt]
  );
};

module.exports = {
  findUserByEmail,
  createUser
};
