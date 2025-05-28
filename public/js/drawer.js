function attachCommentListeners() {
  const drawer = document.getElementById('commentDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const commentsContainer = document.getElementById('commentsContainer');

  document.querySelectorAll('.openCommentBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const postId = btn.getAttribute('data-post-id');
      currentPostId = postId;
      // Affiche le drawer
      drawer.classList.remove('translate-y-full');

      try {
        const res = await fetch(`http://localhost:3000/api/comments/post/${postId}`);
        const comments = await res.json();

        if (comments.length === 0) {
          commentsContainer.innerHTML = `<p class="text-gray-500">Pas encore de commentaires.</p>`;
          return;
        }

        commentsContainer.innerHTML = comments.map(comment => `
          <div class="bg-trasparent p-3 rounded shadow-sm">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold">@${comment.username}</span>
              <span class="text-xs text-gray-400">${new Date(comment.created_at).toLocaleString()}</span>
            </div>
            <p class="text-white-400 text-sm">${comment.text}</p>
          </div>
        `).join('');
      } catch (err) {
        commentsContainer.innerHTML = `<p class="text-red-500">Erreur lors du chargement des commentaires.</p>`;
        console.error(err);
      }
    });
  });

  closeDrawerBtn.addEventListener('click', () => {
    drawer.classList.add('translate-y-full');
  });
}
