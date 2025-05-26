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

      const postDate = new Date(post.created_at).toLocaleString();

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
    <span>❤️ 152</span>
    <button class="openCommentBtn" data-post-id="${post.id}">💬 Commenter</button>
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
}
// ← pour activer les boutons 💬 après l’injection des posts

