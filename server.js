const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts'); // ✅ Make sure this is valid
const db = require('./config/db');
const path = require('path');
const commentRoutes = require('./routes/comments');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Test DB connection
db.getConnection()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => console.error('❌ MySQL connection failed:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); // ✅ This is your posts route
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve images
app.use('/api/comments', commentRoutes);

// Protected test
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
