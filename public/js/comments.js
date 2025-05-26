// Pour le bouton de fermeture du drawer
document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('commentDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  closeDrawerBtn.addEventListener('click', () => {
    drawer.classList.add('translate-y-full');
  });
});
