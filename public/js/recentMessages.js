document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('recent-messages-container');
  const token = localStorage.getItem('token');

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

        const avatarUrl = msg.avatar_url || `https://api.dicebear.com/6.x/personas/svg?seed=${msg.other_username}`;

        messageCard.innerHTML = `
          <div class="message-left">
            <img class="avatar" src="${avatarUrl}" alt="Avatar of ${msg.other_username}">
          </div>
          <div class="message-right">
            <strong>${msg.other_username}</strong>
            <span>${msg.content || 'Message indisponible'}</span>
            <small>${new Date(msg.created_at).toLocaleString()}</small>
          </div>
        `;

        messageCard.addEventListener('click', () => {
          window.location.href = `conversation.html?userId=${msg.other_user_id}`;
        });

        container.appendChild(messageCard);
      });

      lucide.createIcons(); // Refresh icons if any injected dynamically
    })
    .catch(err => {
      console.error('Erreur complète :', err);
      container.innerHTML = '<p>⚠️ Erreur lors du chargement.</p>';
    });

  // Drawer logic
  const userDrawer = document.getElementById('user-drawer');
  const userList = document.getElementById('user-list');
  const openDrawerBtn = document.querySelector('i[data-lucide="user-plus"]');
  const closeDrawerBtn = document.getElementById('close-user-drawer');

  openDrawerBtn.addEventListener('click', () => {
    userDrawer.style.transform = 'translateX(0)';
    userList.innerHTML = '<p>Chargement...</p>';

    fetch('http://localhost:3000/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(users => {
        if (!Array.isArray(users) || users.length === 0) {
          userList.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
          return;
        }

        userList.innerHTML = '';
        users.forEach(user => {
          const avatarUrl = user.avatar_url || `https://api.dicebear.com/6.x/personas/svg?seed=${user.username}`;
          const div = document.createElement('div');
          div.className = 'message-card';
          div.innerHTML = `
            <div class="message-left">
              <img class="avatar" src="${avatarUrl}" alt="${user.username}">
            </div>
            <div class="message-right">
              <strong>${user.username}</strong>
              <span>${user.email || 'Email non disponible'}</span>
            </div>
          `;
          div.addEventListener('click', () => {
            window.location.href = `conversation.html?userId=${user.id}`;
          });
          userList.appendChild(div);
        });

        lucide.createIcons();
      })
      .catch(err => {
        console.error(err);
        userList.innerHTML = '<p>Erreur de chargement.</p>';
      });
  });

  closeDrawerBtn.addEventListener('click', () => {
    userDrawer.style.transform = 'translateX(-100%)';
  });
});
