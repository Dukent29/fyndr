document.addEventListener('DOMContentLoaded', async () => {
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const messageList = document.getElementById('message-list');

  const token = localStorage.getItem('token');
  const urlParams = new URLSearchParams(window.location.search);
  const receiverId = urlParams.get('userId');

  if (!receiverId) {
    alert("Aucun destinataire fourni !");
    return;
  }

  messageForm.dataset.receiverId = receiverId;

  
  try {
    const res = await fetch(`http://localhost:3000/api/messages/conversation/${receiverId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const messages = await res.json();

    messageList.innerHTML = '';

    messages.forEach(msg => {
  const div = document.createElement('div');
  div.classList.add('message');

  const currentUser = parseJwt(token).userId;
  const isSender = msg.sender_id === currentUser;

  div.classList.add(isSender ? 'sender' : 'receiver');

  div.innerHTML = `
    <div>${msg.content}</div>
    <div style="font-size: 10px; color: gray; margin-top: 4px; ">${msg.sender_username}</div>
  `;

  messageList.appendChild(div);
});

   
    messageList.scrollTop = messageList.scrollHeight;

  } catch (err) {
    console.error("Erreur de chargement :", err);
    messageList.innerHTML = '<p>Erreur lors du chargement des messages.</p>';
  }

  
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
      location.reload(); 
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      alert("Erreur lors de l'envoi");
    }
  });


  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  }
});
