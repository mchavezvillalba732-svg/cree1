// =====================================================
//  GITHUB API - Leer y escribir posts.json
// =====================================================

// Lee todos los posts desde GitHub
async function leerPosts() {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_USUARIO}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.POSTS_ARCHIVO}`;

  const respuesta = await fetch(url, {
    headers: { "Accept": "application/vnd.github+json" }
  });

  if (respuesta.status === 404) {
    // El archivo no existe todavía, devolvemos lista vacía
    return { posts: [], sha: null };
  }

  if (!respuesta.ok) {
    throw new Error("No se pudo leer los posts desde GitHub. Status: " + respuesta.status);
  }

  const datos = await respuesta.json();

  // El contenido viene en base64, lo decodificamos
  const contenidoTexto = atob(datos.content.replace(/\n/g, ""));
  const posts = JSON.parse(contenidoTexto);

  return { posts, sha: datos.sha };
}

// Guarda los posts en GitHub (crea o actualiza el archivo)
async function guardarPosts(posts, sha, token) {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_USUARIO}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.POSTS_ARCHIVO}`;

  const contenidoBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(posts, null, 2))));

  const cuerpo = {
    message: "Actualizar posts del blog",
    content: contenidoBase64,
    branch: CONFIG.GITHUB_RAMA
  };

  // Si el archivo ya existe, hay que incluir el sha para poder actualizarlo
  if (sha) {
    cuerpo.sha = sha;
  }

  const respuesta = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify(cuerpo)
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error("Error al guardar en GitHub: " + (error.message || respuesta.status));
  }

  return await respuesta.json();
}
