const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

db.getConnection()
  .then(() => console.log('✓ Connected to MySQL'))
  .catch(err => console.error('✗ MySQL connection failed:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/messages', chatRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`✓ EmoCrypt running at http://localhost:${PORT}`);
});