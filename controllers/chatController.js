const db = require('../config/db');

exports.getMessages = async (req, res) => {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
        return res.status(400).json({ error: 'user1 et user2 requis' });
    }

    try {
        const [messages] = await db.query(
            `SELECT * FROM messages
             WHERE (username = ? AND recipient_username = ?)
                OR (username = ? AND recipient_username = ?)
             ORDER BY created_at ASC`,
            [user1, user2, user2, user1]
        );
        res.json(messages);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.sendMessage = async (req, res) => {
    const { username, message, recipientUsername, recipientId } = req.body;

    if (!username || !message || !recipientUsername) {
        return res.status(400).json({ error: 'Données manquantes' });
    }

    try {
        let [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);

        let userId;
        if (users.length === 0) {
            const [result] = await db.query('INSERT INTO users (username) VALUES (?)', [username]);
            userId = result.insertId;
        } else {
            userId = users[0].id;
        }

        const [result] = await db.query(
            'INSERT INTO messages (user_id, username, message, recipient_id, recipient_username) VALUES (?, ?, ?, ?, ?)',
            [userId, username, message, recipientId, recipientUsername]
        );

        const [newMessage] = await db.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);

        res.status(201).json(newMessage[0]);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};