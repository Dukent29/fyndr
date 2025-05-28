document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('recent-messages-container');
  const token = localStorage.getItem('token');

  console.log("TOKEN →", token);

  fetch('http://localhost:3000/api/messages/recent', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(async res => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur API (${res.status}): ${text}`);
      }
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        container.innerHTML = '<p>❌ Erreur de récupération</p>';
        return;
      }

      if (data.length === 0) {
        container.innerHTML = '<p>Aucune conversation récente.</p>';
        return;
      }

      data.forEach(msg => {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';

        // Avatar URL fallback
        const avatarUrl = msg.avatar_url || `https://api.dicebear.com/6.x/personas/svg?seed=${msg.other_username}`;

        messageCard.innerHTML = `
          <div class="message-left">
            <img class="avatar" src="${avatarUrl}" alt="Avatar of ${msg.other_username}">
          </div>
          <div class="message-right">
            <strong>${msg.other_username}</strong>
            <span>${msg.content}</span>
            <small>${new Date(msg.created_at).toLocaleString()}</small>
          </div>
        `;

        messageCard.addEventListener('click', () => {
          window.location.href = `conversation.html?userId=${msg.other_user_id}`;
        });

        container.appendChild(messageCard);
      });
    })
    .catch(err => {
      console.error('Erreur complète :', err);
      container.innerHTML = '<p>⚠️ Erreur lors du chargement.</p>';
    });
});
