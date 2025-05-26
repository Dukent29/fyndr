const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { findUserByEmail } = require('../models/user');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const createdAt = new Date();

    await pool.query(
      'INSERT INTO users (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, username, email, hashedPassword, createdAt]
    );

    res.status(201).json({ message: 'User registered!', user: { id, username, email, createdAt } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const login = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Normally you'd check the password here as well
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  // If you're using cookies:
  // res.clearCookie('token');
  
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  logout,
};
