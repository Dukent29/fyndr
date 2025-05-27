// js/auth.js

// REGISTER
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      username: document.getElementById('regUsername').value,
      email: document.getElementById('regEmail').value,
      password: document.getElementById('regPassword').value,
      phone: document.getElementById('regPhone').value,
      dob: document.getElementById('regDob').value
    };

    try {
      const res = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Erreur inscription');
      alert("Inscription réussie ! Connecte-toi maintenant.");
      window.location.href = "login.html";
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    };

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Email ou mot de passe incorrect');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      alert("Connecté !");
      window.location.href = "index.html";
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  });
}
