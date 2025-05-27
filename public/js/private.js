document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  logoutBtn.addEventListener('click', async () => {
    // Optional: send a request to backend if you want
    // await fetch('http://localhost:3000/api/users/logout', { method: 'POST' });

    // Remove token from localStorage
    localStorage.removeItem('token');

    // Optionally redirect to login or home page
    window.location.href = './index.html'; // adjust path as needed
  });
});