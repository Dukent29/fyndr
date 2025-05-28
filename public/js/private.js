document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  logoutBtn.addEventListener('click', async () => {
    

    
    localStorage.removeItem('token');

    
    window.location.href = './index.html';
  });
});