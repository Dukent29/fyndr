// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');
const userRoutes = require('./routes/users');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Test DB connection
db.getConnection()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => console.error('❌ MySQL connection failed:', err));

// Routes
app.use('/api/users', userRoutes);

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
