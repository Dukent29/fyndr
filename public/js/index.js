document.getElementById('usernameForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const errorDiv = document.getElementById('error');

    if (username.length < 2) {
        errorDiv.textContent = 'Le nom doit contenir au moins 2 caractères';
        return;
    }

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('username', username);
            window.location.href = 'users.html';
        } else {
            errorDiv.textContent = data.error || 'Erreur de connexion';
        }
    } catch (error) {
        errorDiv.textContent = 'Erreur de connexion';
        console.error('Erreur:', error);
    }
});