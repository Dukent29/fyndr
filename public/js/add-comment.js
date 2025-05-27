commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!currentPostId) {
    alert("Erreur : aucun post sélectionné.");
    return;
  }

  const text = commentInput.value.trim();
  if (!text) return;

  try {
    const res = await fetch(`http://localhost:3000/api/comments/post/${currentPostId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ text })
    });

    if (!res.ok) throw new Error("Erreur lors de l'envoi du commentaire");

    const newComment = await res.json();

    // Ajouter le commentaire directement à l'interface
    const commentElement = document.createElement('div');
    commentElement.className = 'bg-transparent p-3 rounded shadow-sm';
    commentElement.innerHTML = `
      <div class="flex items-center gap-2 mb-1">
        <span class="font-semibold">@${newComment.username}</span>
        <span class="text-xs text-gray-400">${new Date(newComment.created_at).toLocaleString()}</span>
      </div>
      <p class="text-white-400 text-sm">${newComment.text}</p>
    `;
    commentsContainer.appendChild(commentElement);

    commentInput.value = '';

  } catch (err) {
    console.error(err);
    alert("Impossible d’ajouter le commentaire.");
  }
});