const username = localStorage.getItem('username');
const chatWith = localStorage.getItem('chatWith');
const chatWithId = localStorage.getItem('chatWithId');
const VIGENERE_KEY = 'EmoCrypt2025';
let decryptedMessages = new Set();
let currentUserUUID = null;
let chatWithUUID = null;

if (!username || !chatWith) {
    window.location.href = 'index.html';
}

document.getElementById('chatWith').textContent = chatWith;
document.getElementById('chatInitial').textContent = chatWith.charAt(0).toUpperCase();

let messages = [];

/**
 * 🧠 Utilitaires bas niveau : encodage & hash
 */
function utf8Bytes(str) {
    return new TextEncoder().encode(str);
}

function bytesToBase64(u8) {
    let s = "";
    for (const b of u8) s += String.fromCharCode(b);
    return btoa(s);
}

function base64ToBytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

/**
 * 🔐 SHA-256 (hash cryptographique)
 */
async function sha256Bytes(inputStr) {
    const data = utf8Bytes(inputStr);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(digest);
}

/**
 * 🧂 Génération du sel (UUIDs + timestamp → SHA-256 → base64)
 */
async function makeSaltB64(senderUUID, recipientUUID, timestampMs) {
    const [low, high] = [senderUUID, recipientUUID].sort();
    const material = `${low}::${high}::${timestampMs}`;
    const hash = await sha256Bytes(material);
    return bytesToBase64(hash);
}

/**
 * 🌀 Convertit le hash SHA-256 en liste d'offsets (0..999)
 */
function saltOffsetsFromB64(saltB64) {
    const b = base64ToBytes(saltB64);
    const out = [];
    for (let i = 0; i < b.length; i += 2) {
        const v = (b[i] << 8) | (b[i + 1] ?? 0);
        out.push(v % 1000);
    }
    return out;
}

/**
 * 🔐 Vigenère Unicode → Emoji avec sel
 */
function encryptVigenereEmojiSalted(text, key, saltB64) {
    const keyPoints = [...key].map(c => c.codePointAt(0));
    const saltOffsets = saltOffsetsFromB64(saltB64);
    const kLen = keyPoints.length;
    const sLen = saltOffsets.length;
    const result = [];

    [...text].forEach((char, i) => {
        const base = char.codePointAt(0);
        const shift = (keyPoints[i % kLen] + saltOffsets[i % sLen]) % 100;
        const newCode = base + shift + 128400;

        try {
            result.push(String.fromCodePoint(newCode));
        } catch {
            result.push(char);
        }
    });

    return result.join('');
}

/**
 * 🔓 Déchiffrement symétrique Vigenère avec sel
 */
function decryptVigenereEmojiSalted(cipherText, key, saltB64) {
    const keyPoints = [...key].map(c => c.codePointAt(0));
    const saltOffsets = saltOffsetsFromB64(saltB64);
    const kLen = keyPoints.length;
    const sLen = saltOffsets.length;
    const result = [];

    [...cipherText].forEach((char, i) => {
        const base = char.codePointAt(0);
        const shift = (keyPoints[i % kLen] + saltOffsets[i % sLen]) % 100;
        const newCode = base - shift - 128400;

        try {
            result.push(String.fromCodePoint(newCode));
        } catch {
            result.push(char);
        }
    });

    return result.join('');
}

function toggleMessageDecrypt(messageId) {
    if (decryptedMessages.has(messageId)) {
        decryptedMessages.delete(messageId);
    } else {
        decryptedMessages.add(messageId);
    }
    displayMessages();
}

async function loadUserUUIDs() {
    try {
        const [currentUserResponse, chatWithResponse] = await Promise.all([
            fetch(`/api/users/uuid/${encodeURIComponent(username)}`),
            fetch(`/api/users/uuid/${encodeURIComponent(chatWith)}`)
        ]);

        const currentUserData = await currentUserResponse.json();
        const chatWithData = await chatWithResponse.json();

        currentUserUUID = currentUserData.user_uuid;
        chatWithUUID = chatWithData.user_uuid;
    } catch (error) {
        console.error('Erreur chargement UUIDs:', error);
    }
}

loadUserUUIDs();
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

async function displayMessages() {
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

    if (!currentUserUUID || !chatWithUUID) {
        await loadUserUUIDs();
    }

    const messagesHTML = await Promise.all(messages.map(async msg => {
        const isOwn = msg.username === username;
        const time = new Date(msg.created_at).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const initial = msg.username.charAt(0).toUpperCase();
        const isDecrypted = decryptedMessages.has(msg.id);

        let displayMessage = msg.ciphertext_emoji;

        if (msg.salt_b64 && currentUserUUID && chatWithUUID) {
            if (isOwn || isDecrypted) {
                displayMessage = decryptVigenereEmojiSalted(msg.ciphertext_emoji, VIGENERE_KEY, msg.salt_b64);
            }
        }

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
    }));

    container.innerHTML = messagesHTML.join('');
    container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    if (!currentUserUUID || !chatWithUUID) {
        await loadUserUUIDs();
    }

    const timestampMs = Date.now();
    const saltB64 = await makeSaltB64(currentUserUUID, chatWithUUID, timestampMs);
    const encryptedMessage = encryptVigenereEmojiSalted(message, VIGENERE_KEY, saltB64);

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                ciphertextEmoji: encryptedMessage,
                saltB64: saltB64,
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