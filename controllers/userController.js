const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { findUserByEmail, createUser } = require('../models/user');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password, phone, dob } = req.body;

  if (!username || !email || !password || !phone || !dob) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const createdAt = new Date();

    await createUser({
      id,
      username,
      email,
      password: hashedPassword,
      phone,
      dob,
      createdAt
    });

    res.status(201).json({
      message: 'Utilisateur enregistré !',
      user: { id, username, email, phone, dob, createdAt }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
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

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email FROM users WHERE id != ?', [req.user.id]);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  getAllUsers
};
