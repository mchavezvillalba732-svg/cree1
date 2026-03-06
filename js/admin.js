// =====================================================
//  ADMIN - Lógica del panel de administración
// =====================================================

// Token se guarda solo en memoria (no en localStorage ni cookies)
let _tokenSesion = null;

// Verificar si ya hay sesión al cargar
window.addEventListener("load", () => {
  // No hay sesión persistente intencionalmente - el admin debe loguearse cada vez
});

// Login: valida usuario/contraseña y guarda el token en memoria
function iniciarSesion() {
  const usuario = document.getElementById("input-usuario").value.trim();
  const contrasena = document.getElementById("input-contrasena").value;
  const token = document.getElementById("input-token").value.trim();

  if (usuario !== CONFIG.ADMIN_USUARIO || contrasena !== CONFIG.ADMIN_CONTRASENA) {
    document.getElementById("error-login").style.display = "block";
    return;
  }

  if (!token) {
    alert("Ingresá el token de GitHub.");
    return;
  }

  // Credenciales correctas: guardamos token en memoria y mostramos el panel
  _tokenSesion = token;
  document.getElementById("seccion-login").style.display = "none";
  document.getElementById("seccion-panel").style.display = "block";
  document.getElementById("btn-logout").style.display = "inline";

  cargarListaAdmin();
}

function cerrarSesion() {
  _tokenSesion = null;
  document.getElementById("seccion-login").style.display = "block";
  document.getElementById("seccion-panel").style.display = "none";
  document.getElementById("btn-logout").style.display = "none";
  // Limpiar campos
  document.getElementById("input-usuario").value = "";
  document.getElementById("input-contrasena").value = "";
  document.getElementById("input-token").value = "";
}

// Cargar lista de posts en el panel admin
async function cargarListaAdmin() {
  const lista = document.getElementById("admin-lista-posts");
  lista.textContent = "Cargando...";

  try {
    const { posts } = await leerPosts();
    window._adminPosts = posts; // guardamos para reusar

    if (posts.length === 0) {
      lista.innerHTML = "<p>No hay artículos publicados.</p>";
      return;
    }

    lista.innerHTML = posts.map(post => `
      <div>
        <strong>${post.titulo}</strong> — ${post.categoria} — ${post.fecha}
        <button onclick="eliminarPost(${post.id})">Eliminar</button>
      </div>
    `).join("<hr>");

  } catch (err) {
    lista.innerHTML = "<p>Error al cargar: " + err.message + "</p>";
  }
}

// Publicar un nuevo post
async function publicarPost() {
  const titulo = document.getElementById("nuevo-titulo").value.trim();
  const categoria = document.getElementById("nueva-categoria").value;
  const resumen = document.getElementById("nuevo-resumen").value.trim();
  const contenido = document.getElementById("nuevo-contenido").value.trim();
  const estado = document.getElementById("mensaje-estado");

  if (!titulo || !contenido) {
    estado.textContent = "El título y el contenido son obligatorios.";
    estado.style.color = "red";
    return;
  }

  estado.textContent = "Publicando...";
  estado.style.color = "black";

  try {
    const { posts, sha } = await leerPosts();

    const nuevoPost = {
      id: Date.now(),
      titulo,
      categoria,
      resumen: resumen || contenido.substring(0, 150) + "...",
      contenido,
      fecha: new Date().toLocaleDateString("es-PY", {
        day: "numeric", month: "long", year: "numeric"
      })
    };

    posts.unshift(nuevoPost); // agrega al inicio

    await guardarPosts(posts, sha, _tokenSesion);

    estado.textContent = "✅ Artículo publicado correctamente.";
    estado.style.color = "green";

    // Limpiar formulario
    document.getElementById("nuevo-titulo").value = "";
    document.getElementById("nuevo-resumen").value = "";
    document.getElementById("nuevo-contenido").value = "";

    cargarListaAdmin();

  } catch (err) {
    estado.textContent = "Error al publicar: " + err.message;
    estado.style.color = "red";
  }
}

// Eliminar un post por id
async function eliminarPost(id) {
  if (!confirm("¿Eliminar este artículo? Esta acción no se puede deshacer.")) return;

  const estado = document.getElementById("mensaje-estado");
  estado.textContent = "Eliminando...";
  estado.style.color = "black";

  try {
    const { posts, sha } = await leerPosts();
    const postsFiltrados = posts.filter(p => p.id !== id);
    await guardarPosts(postsFiltrados, sha, _tokenSesion);

    estado.textContent = "✅ Artículo eliminado.";
    estado.style.color = "green";
    cargarListaAdmin();

  } catch (err) {
    estado.textContent = "Error al eliminar: " + err.message;
    estado.style.color = "red";
  }
}
