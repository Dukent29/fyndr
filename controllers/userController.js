const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, created_at FROM users ORDER BY username ASC'
        );
        res.json(users);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createOrGetUser = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.length < 2) {
            return res.status(400).json({ error: 'Le nom doit contenir au moins 2 caractères' });
        }

        const [existing] = await db.query(
            'SELECT id, username FROM users WHERE username = ?',
            [username]
        );

        if (existing.length > 0) {
            return res.json(existing[0]);
        }

        const [result] = await db.query(
            'INSERT INTO users (username) VALUES (?)',
            [username]
        );

        res.json({ id: result.insertId, username });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getUserUUID = async (req, res) => {
    try {
        const { username } = req.params;

        const [users] = await db.query(
            'SELECT user_uuid FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json({ user_uuid: users[0].user_uuid });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};