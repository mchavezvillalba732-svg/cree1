// =====================================================
//  BLOG - Muestra los posts en index.html
// =====================================================

const contenedor = document.getElementById("posts-container");

// Al cargar la página, leemos los posts
window.addEventListener("load", async () => {
  try {
    const { posts } = await leerPosts();

    if (posts.length === 0) {
      contenedor.innerHTML = "<p>No hay artículos publicados todavía.</p>";
      return;
    }

    contenedor.innerHTML = posts.map(post => `
      <article>
        <h3>${post.titulo}</h3>
        <p><strong>Categoría:</strong> ${post.categoria} &nbsp;|&nbsp; <strong>Fecha:</strong> ${post.fecha}</p>
        <p>${post.resumen}</p>
        <button onclick="abrirModal(${post.id})">Leer más</button>
        <hr>
      </article>
    `).join("");

    // Guardamos los posts en una variable global para usarlos en el modal
    window._posts = posts;

  } catch (err) {
    contenedor.innerHTML = "<p>Error al cargar los artículos: " + err.message + "</p>";
  }
});

// Abre el modal con el contenido completo del post
function abrirModal(id) {
  const post = window._posts.find(p => p.id === id);
  if (!post) return;

  document.getElementById("modal-titulo").textContent = post.titulo;
  document.getElementById("modal-fecha").textContent = "Fecha: " + post.fecha;
  document.getElementById("modal-categoria").textContent = "Categoría: " + post.categoria;
  document.getElementById("modal-contenido").textContent = post.contenido;
  document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}
