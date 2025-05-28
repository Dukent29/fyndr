const pool = require('../config/db');

// ➕ Envoyer un message privé
const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.params;  // ✅ From URL
  const { content } = req.body;          // ✅ From body

  if (!receiverId || !content) {
    return res.status(400).json({ message: 'Receiver and content are required' });
  }

  try {
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [senderId, receiverId, content]
    );
    res.status(201).json({ message: 'Message sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// 📥 Obtenir la conversation avec un utilisateur
const getConversation = async (req, res) => {
  const user1 = req.user.id;
  const user2 = req.params.userId;

  try {
    const [messages] = await pool.query(
      `SELECT m.id, m.content, m.created_at,
              m.sender_id, m.receiver_id,
              u1.username AS sender_username,
              u2.username AS receiver_username
       FROM messages m
       JOIN users u1 ON m.sender_id = u1.id
       JOIN users u2 ON m.receiver_id = u2.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?)
          OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at ASC`,
      [user1, user2, user2, user1]
    );

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// 🔁 Liste des conversations récentes
const getRecentConversations = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const [rows] = await pool.query(`
      SELECT 
        m.id AS message_id,
        m.content,
        m.created_at,
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END AS other_user_id,
        u.username AS other_username
      FROM messages m
      JOIN (
        SELECT 
          CASE 
            WHEN sender_id = ? THEN receiver_id
            ELSE sender_id
          END AS other_id,
          MAX(created_at) AS last_message_time
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        GROUP BY other_id
      ) latest ON (
        (m.sender_id = ? AND m.receiver_id = latest.other_id OR 
         m.sender_id = latest.other_id AND m.receiver_id = ?) 
        AND m.created_at = latest.last_message_time
      )
      JOIN users u ON u.id = (
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END
      )
      ORDER BY m.created_at DESC
    `, [
      currentUserId,
      currentUserId,
      currentUserId,
      currentUserId,
      currentUserId,
      currentUserId,
      currentUserId
    ]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { sendMessage, getConversation, getRecentConversations };
