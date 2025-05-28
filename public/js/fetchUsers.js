// public/js/fetchUsers.js

document.addEventListener("DOMContentLoaded", async () => {
  const userList = document.getElementById("user-list");

  try {
    const res = await fetch("http://localhost:3000/api/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` // If token is required
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const users = await res.json();

    if (!Array.isArray(users)) {
      throw new Error("Expected an array of users but got something else.");
    }

    users.forEach(user => {
      const card = document.createElement("div");
      card.className = "user-card";
      card.style.cursor = "pointer";

      card.innerHTML = `
        <div class="user-info">
    <img src="assets/images/avatar-1.jpg" alt="${user.username}">
    <div>
      <div class="name">${user.username} <span class="status-dot" title="Online"></span></div>
      <div class="badge">Top Fan</div>
    </div>
  </div>
  <i data-lucide="message-circle" class="message-icon" data-id="${user.id}"></i>
      `;

      // Handle click on entire card (or just the icon)
      card.addEventListener("click", () => {
        window.location.href = `conversation.html?userId=${user.id}`;
      });

      userList.appendChild(card);
    });

    lucide.createIcons(); // Re-render Lucide icons
  } catch (err) {
    console.error("Failed to load users:", err);
    userList.innerHTML = "<p>Erreur de chargement des utilisateurs</p>";
  }
});
