document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postForm');
  const preview = document.getElementById('preview');

  // Optional: Preview selected image
  document.getElementById('image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const caption = document.getElementById('caption').value;
    const image = document.getElementById('image').files[0];

    if (!caption || !image) {
      alert('Please provide a caption and an image.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token'); // ⬅️ your JWT token
      const response = await fetch('http://localhost:3000/api/posts/add-post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        alert('Post created successfully!');
        form.reset();
        preview.style.display = 'none';
      } else {
        alert(result.message || 'Error creating post');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  });
});
