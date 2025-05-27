const pool = require('../config/db');

const createUser = async ({ id, username, email, password, phone, dob, createdAt }) => {
  const query = `
    INSERT INTO users (id, username, email, password, phone, dob, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [id, username, email, password, phone, dob, createdAt];

  await pool.query(query, values);
};

const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail
};
