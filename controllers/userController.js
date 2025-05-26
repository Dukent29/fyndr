// controllers/userController.js
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');

const register = async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const id = uuidv4();
    const createdAt = new Date();

    await User.createUser({ id, username, email, createdAt });

    res.status(201).json({ message: 'User registered!', user: { id, username, email, createdAt } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register
};
