const currentUsername = localStorage.getItem('username');
let allUsers = [];

if (!currentUsername) {
    window.location.href = 'index.html';
}

document.getElementById('currentUsername').textContent = currentUsername;
document.getElementById('userInitial').textContent = currentUsername.charAt(0).toUpperCase();

document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
});

loadUsers();
setInterval(loadUsers, 5000);

async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        allUsers = users.filter(u => u.username !== currentUsername);

        document.getElementById('contactCount').textContent = `${allUsers.length} contact${allUsers.length > 1 ? 's' : ''} disponible${allUsers.length > 1 ? 's' : ''}`;

        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredUsers = searchTerm
            ? allUsers.filter(user => user.username.toLowerCase().includes(searchTerm))
            : allUsers;

        displayUsers(filteredUsers);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersList');

    if (users.length === 0) {
        container.innerHTML = '<div class="no-users">Aucun contact disponible pour le moment</div>';
        return;
    }

    container.innerHTML = users.map(user => {
        const initial = user.username.charAt(0).toUpperCase();
        const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR');

        return `
            <div class="user-item" onclick="startChat('${user.username}', ${user.id})">
                <div class="user-avatar">${initial}</div>
                <div class="user-info">
                    <div class="user-name">${escapeHtml(user.username)}</div>
                    <div class="user-status">Membre depuis ${joinDate}</div>
                </div>
                <div class="user-arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        `;
    }).join('');
}

function startChat(username, userId) {
    localStorage.setItem('chatWith', username);
    localStorage.setItem('chatWithId', userId);
    window.location.href = 'chat.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}