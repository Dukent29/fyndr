let currentPostId = null; // Globally track which post the drawer is open for

document.addEventListener('DOMContentLoaded', fetchAndDisplayPosts);

async function fetchAndDisplayPosts() {
  try {
    const response = await fetch('http://localhost:3000/api/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');

    const posts = await response.json();
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.reverse().forEach(post => {
      const postCard = document.createElement('div');
      postCard.className = 'post-card';

      postCard.innerHTML = `
        <div class="post-header">
          <div class="user-info">
            <img src="https://i.pravatar.cc/100?u=102" alt="Profile" class="profile-pic" />
            <div class="username-time">
              <strong>@${post.username}</strong>
              <small>${new Date(post.created_at).toLocaleString()}</small>
            </div>
          </div>
          <div class="more-options">⋮</div>
        </div>
        <img src="http://localhost:3000/uploads/${post.image_url}" alt="Post Image" class="post-image" />
        <p class="caption">${post.caption}</p>
        <div class="post-actions">
  <a href="#" class="like-btn">
    <i class="bi bi-heart-fill"></i>
    <span class="like-count">152</span>
  </a>
  <button class="openCommentBtn" data-post-id="${post.id}">
    <i class="bi bi-chat-dots"></i> Commenter
  </button>
</div>

      `;

      postList.appendChild(postCard);
    });

    attachCommentListeners();
  } catch (error) {
    console.error('Error fetching posts:', error);
    const postList = document.getElementById('postList');
    postList.innerHTML = '<p>Failed to load posts.</p>';
  }
}Z

// Attach listeners to comment buttons and drawer
function attachCommentListeners() {
  const drawer = document.getElementById('commentDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const commentsContainer = document.getElementById('commentsContainer');
  const commentForm = document.getElementById('commentForm');
  const commentInput = document.getElementById('commentInput');

  document.querySelectorAll('.openCommentBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const postId = btn.getAttribute('data-post-id');
      currentPostId = postId;

      // Show drawer
      drawer.classList.remove('translate-y-full');

      // Fetch and display comments
      try {
        const res = await fetch(`http://localhost:3000/api/comments/post/${postId}`);
        const comments = await res.json();

        if (comments.length === 0) {
          commentsContainer.innerHTML = `<p class="text-gray-500">Pas encore de commentaires.</p>`;
        } else {
          commentsContainer.innerHTML = comments.map(comment => `
            <div class="bg-transparent p-3 rounded shadow-sm">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold">@${comment.username}</span>
                <span class="text-xs text-gray-400">${new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p class="text-white-400 text-sm">${comment.text}</p>
            </div>
          `).join('');
        }
      } catch (err) {
        commentsContainer.innerHTML = `<p class="text-red-500">Erreur lors du chargement des commentaires.</p>`;
        console.error(err);
      }
    });
  });

  // Close drawer button
  closeDrawerBtn.addEventListener('click', () => {
    drawer.classList.add('translate-y-full');
    currentPostId = null;
    commentsContainer.innerHTML = '';
    commentInput.value = '';
  });

  // Submit new comment
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

      // Add comment to the top
      const commentElement = document.createElement('div');
      commentElement.className = 'bg-transparent p-3 rounded shadow-sm';
      commentElement.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold">@${newComment.username}</span>
          <span class="text-xs text-gray-400">${new Date(newComment.created_at).toLocaleString()}</span>
        </div>
        <p class="text-white-400 text-sm">${newComment.text}</p>
      `;
      commentsContainer.prepend(commentElement);

      commentInput.value = '';

    } catch (err) {
      console.error(err);
      alert("Impossible d’ajouter le commentaire.");
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const icon = btn.querySelector('i');
      const countSpan = btn.querySelector('.like-count');
      let count = parseInt(countSpan.textContent, 10);

      // Toggle liked class
      btn.classList.toggle('liked');

      const isLiked = btn.classList.contains('liked');

      // Toggle icon style
      icon.classList.toggle('bi-heart', !isLiked);
      icon.classList.toggle('bi-heart-fill', isLiked);

      // Update count
      countSpan.textContent = isLiked ? count + 1 : count - 1;
    });
  });
});


