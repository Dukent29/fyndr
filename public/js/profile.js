document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return alert("Utilisateur non connecté");

  try {
    // 1. Récupérer les infos du user
    const userRes = await fetch('http://localhost:3000/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!userRes.ok) throw new Error("Impossible de récupérer l'utilisateur");

    const user = await userRes.json();

    document.getElementById('profile-pic').src = user.photo || 'https://via.placeholder.com/100';
    document.getElementById('username').textContent = `@${user.username}`;
    document.getElementById('bio').textContent = user.bio || '';
    document.getElementById('followers').textContent = user.followers || 0;
    document.getElementById('following').textContent = user.following || 0;

    // 2. Récupérer les posts du user
    const postRes = await fetch('http://localhost:3000/api/posts/me/posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!postRes.ok) throw new Error("Impossible de récupérer les posts");

    const posts = await postRes.json();
    const grid = document.getElementById('posts-grid');

    document.getElementById('post-count').textContent = posts.length;

    posts.forEach(post => {
  const img = document.createElement('img');
  img.src = post.image_url ? `http://localhost:3000/uploads/${post.image_url}` : 'https://via.placeholder.com/300';
  img.alt = 'post';
  grid.appendChild(img);
});

  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement du profil");
  }
});
