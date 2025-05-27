// public/js/authGuard.js
(function () {
  const token = localStorage.getItem('token');

  // Si le token n'existe pas, on redirige vers login.html
  if (!token) {
    window.location.href = 'public/login.html';
  }
})();
