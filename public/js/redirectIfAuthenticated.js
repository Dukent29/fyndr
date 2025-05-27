// public/js/redirectIfAuthenticated.js
(function () {
  const token = localStorage.getItem('token');

  if (token) {
    // Redirige vers la page d'accueil si déjà connecté
    window.location.href = 'index.html';
  }
})();
