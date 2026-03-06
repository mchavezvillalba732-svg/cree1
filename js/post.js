/**
 * post.js
 * Carga y muestra un artículo individual en post.html
 * Lee el ID del post desde la URL: post.html?id=1234567890
 */

// Mismo usuario y repo que en blog.js — editá si cambia
const GH_USER = 'TU_USUARIO_GITHUB';
const GH_REPO = 'TU_REPO_GITHUB';

async function loadPost() {
  const container = document.getElementById('post-content');

  // Leer ID desde la URL
  const params = new URLSearchParams(window.location.search);
  const postId = parseInt(params.get('id'));

  if (!postId) {
    container.innerHTML = '<p>Artículo no encontrado. <a href="index.html">Volver al inicio</a></p>';
    return;
  }

  try {
    const { posts } = await GitHubAPI.getPosts(GH_USER, GH_REPO);
    const post = posts.find(p => p.id === postId);

    if (!post) {
      container.innerHTML = '<p>Artículo no encontrado. <a href="index.html">Volver al inicio</a></p>';
      return;
    }

    // Actualizar el título de la pestaña
    document.title = `${post.title} - Blog CREE`;

    container.innerHTML = `
      <h2>${escapeHtml(post.title)}</h2>
      <div class="post-meta">
        ${post.category} 
        ${post.author ? '· ' + escapeHtml(post.author) : ''} 
        · ${post.date}
      </div>
      <div class="post-body">${escapeHtml(post.body)}</div>
      <br/>
      <a href="index.html">← Volver al inicio</a>
    `;

  } catch (err) {
    container.innerHTML = `<p style="color:red">Error al cargar el artículo: ${err.message}</p>`;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

loadPost();
