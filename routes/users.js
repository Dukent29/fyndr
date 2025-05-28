// routes/users.js
const express = require('express');
const { register, login, logout, getCurrentUser } = require('../controllers/userController');
const router = express.Router();
const authenticate = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); 
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
