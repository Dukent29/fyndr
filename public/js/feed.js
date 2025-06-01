fetch('js/data/feed.json')
  .then(res => res.json())
  .then(videos => {
    const container = document.querySelector('.scroll-container');
    container.innerHTML = '';
    videos.forEach((video, i) => {
      const slide = document.createElement('section');
      slide.className = 'video-slide';
      slide.innerHTML = `
        <div class="video-wrapper">
          <video autoplay muted loop playsinline>
            <source src="${video.video}" type="video/mp4" />
          </video>
        </div>
        <div class="overlay">
          <div class="user">@${video.user} ${video.verified ? '<span class="verified">✔️</span>' : ''}</div>
          <p class="description">${video.caption}</p>
          <button class="discussion-btn" onclick="this.classList.toggle('active')">Démarrer la discussion →</button>
        </div>
        <div class="actions">
          <div class="like-btn" onclick="toggleLike(this)">
            <i class="bi bi-suit-heart-fill"></i>
            <span class="count">${video.likes || 0}</span>
          </div>
          <i class="bi bi-chat-dots openCommentBtn" data-index="${i}" style="cursor:pointer;"></i>
          <i class="bi bi-send"></i>
        </div>
      `;
      container.appendChild(slide);
    });

    // Gestion du drawer
    document.querySelectorAll('.openCommentBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = btn.getAttribute('data-index');
        const comments = videos[idx].comments || [];
        const commentsContainer = document.getElementById('commentsContainer');
        if (comments.length === 0) {
          commentsContainer.innerHTML = "<p style='color:#aaa'>Aucun commentaire.</p>";
        } else {
          commentsContainer.innerHTML = comments.map(c =>
            `<div style="margin-bottom:12px;"><b>@${c.user}</b> : ${c.text}</div>`
          ).join('');
        }
        document.getElementById('commentDrawer').style.transform = 'translate(-50%,0)';
      });
    });

    document.getElementById('closeDrawerBtn').onclick = () => {
      document.getElementById('commentDrawer').style.transform = 'translate(-50%,100%)';
    };
  })
  .catch(err => console.error('Erreur lors du chargement du feed:', err));