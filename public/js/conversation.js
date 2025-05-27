document.addEventListener('DOMContentLoaded', async () => {
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const messageList = document.getElementById('message-list'); // Ajoute un <div id="message-list">

  const token = localStorage.getItem('token');
  const urlParams = new URLSearchParams(window.location.search);
  const receiverId = urlParams.get('userId'); // ✅ Lis depuis URL

  if (!receiverId) {
    alert("Aucun destinataire fourni !");
    return;
  }

  // Injecte dynamiquement dans le form
  messageForm.dataset.receiverId = receiverId;

  // Charger les messages de la conversation
  try {
    const res = await fetch(`http://localhost:3000/api/messages/conversation/${receiverId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const messages = await res.json();

    messageList.innerHTML = '';
    messages.forEach(msg => {
      const div = document.createElement('div');
      div.classList.add('message');
      div.dataset.timestamp = msg.created_at;
      div.dataset.avatar = '/images/default-avatar.png';
      div.innerHTML = `<strong>${msg.sender_username}:</strong> ${msg.content}`;
      messageList.appendChild(div);
    });
  } catch (err) {
    console.error("Erreur de chargement :", err);
    messageList.innerHTML = '<p>Erreur lors du chargement des messages.</p>';
  }

  // Form submission
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = messageInput.value.trim();
    if (!content) return;

    try {
      const res = await fetch(`http://localhost:3000/api/messages/${receiverId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (!res.ok) throw new Error('Erreur d’envoi');

      messageInput.value = '';
      location.reload(); // Recharge la conversation
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      alert("Erreur lors de l'envoi");
    }
  });
});
