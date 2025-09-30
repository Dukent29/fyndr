const username = localStorage.getItem('username');
const chatWith = localStorage.getItem('chatWith');
const chatWithId = localStorage.getItem('chatWithId');
const VIGENERE_KEY = 'EmoCrypt2025';
let decryptedMessages = new Set();

if (!username || !chatWith) {
    window.location.href = 'index.html';
}

document.getElementById('chatWith').textContent = chatWith;
document.getElementById('chatInitial').textContent = chatWith.charAt(0).toUpperCase();

let messages = [];

function toggleMessageDecrypt(messageId) {
    if (decryptedMessages.has(messageId)) {
        decryptedMessages.delete(messageId);
    } else {
        decryptedMessages.add(messageId);
    }
    displayMessages();
}

function encryptVigenereEmoji(text, key) {
    const keyPoints = [...key].map(c => c.codePointAt(0));
    const keyLen = keyPoints.length;
    const result = [];

    [...text].forEach((char, i) => {
        const base = char.codePointAt(0);
        const shift = (keyPoints[i % keyLen] % 1000) + 128400;
        const newCode = base + shift;

        try {
            result.push(String.fromCodePoint(newCode));
        } catch {
            result.push(char);
        }
    });

    return result.join('');
}

function decryptVigenereEmoji(cipherText, key) {
    const keyPoints = [...key].map(c => c.codePointAt(0));
    const keyLen = keyPoints.length;
    const result = [];

    [...cipherText].forEach((char, i) => {
        const base = char.codePointAt(0);
        const shift = (keyPoints[i % keyLen] % 1000) + 128400;
        const newCode = base - shift;

        try {
            result.push(String.fromCodePoint(newCode));
        } catch {
            result.push(char);
        }
    });

    return result.join('');
}

loadMessages();
setInterval(loadMessages, 2000);

document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function loadMessages() {
    try {
        const response = await fetch(`/api/messages?user1=${encodeURIComponent(username)}&user2=${encodeURIComponent(chatWith)}`);
        const data = await response.json();

        if (JSON.stringify(data) !== JSON.stringify(messages)) {
            messages = data;
            displayMessages();
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayMessages() {
    const container = document.getElementById('messagesContainer');

    if (messages.length === 0) {
        container.innerHTML = `
            <div class="no-messages">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                    <path d="M20 28C20 22.4772 24.4772 18 30 18H34C39.5228 18 44 22.4772 44 28V38C44 43.5228 39.5228 48 34 48H30C24.4772 48 20 43.5228 20 38V28Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M28 30H36M28 36H36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>Aucun message pour le moment</p>
            </div>
        `;
        return;
    }

    container.innerHTML = messages.map(msg => {
        const isOwn = msg.username === username;
        const time = new Date(msg.created_at).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const initial = msg.username.charAt(0).toUpperCase();
        const isDecrypted = decryptedMessages.has(msg.id);
        const displayMessage = isOwn ? decryptVigenereEmoji(msg.message, VIGENERE_KEY) : (isDecrypted ? decryptVigenereEmoji(msg.message, VIGENERE_KEY) : msg.message);
        const showButton = !isOwn;
        const buttonText = isDecrypted ? 'Masquer' : 'Afficher';

        return `
            <div class="message ${isOwn ? 'own' : ''}">
                <div class="message-avatar">${initial}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-username">${msg.username}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-bubble">
                        ${escapeHtml(displayMessage)}
                        ${showButton ? `<button class="toggle-decrypt-btn" onclick="toggleMessageDecrypt(${msg.id})">${buttonText}</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    const encryptedMessage = encryptVigenereEmoji(message, VIGENERE_KEY);

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                message: encryptedMessage,
                recipientUsername: chatWith,
                recipientId: chatWithId
            })
        });

        if (response.ok) {
            input.value = '';
            loadMessages();
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function backToUsers() {
    window.location.href = 'users.html';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}