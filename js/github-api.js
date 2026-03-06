/**
 * github-api.js
 * Módulo para leer y escribir datos en GitHub como base de datos.
 * 
 * Cómo funciona:
 *   - Los posts se guardan en un archivo "data/posts.json" dentro del repo.
 *   - Para LEER: se usa la API pública de GitHub (sin token).
 *   - Para ESCRIBIR: se necesita un token con permisos de "repo" o "public_repo".
 */

const GitHubAPI = {

  // ─── Leer posts.json del repo (público, sin token) ───────────────────────
  async getPosts(ghUser, ghRepo) {
    const url = `https://api.github.com/repos/${ghUser}/${ghRepo}/contents/data/posts.json`;
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (res.status === 404) {
        // El archivo no existe todavía → el blog está vacío
        return { posts: [], sha: null };
      }

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }

      const data = await res.json();
      // El contenido viene en Base64
      const decoded = atob(data.content.replace(/\n/g, ''));
      const parsed = JSON.parse(decoded);
      return { posts: parsed.posts || [], sha: data.sha };

    } catch (err) {
      console.error('Error leyendo posts:', err);
      throw err;
    }
  },

  // ─── Guardar posts.json en el repo (requiere token) ──────────────────────
  async savePosts(ghUser, ghRepo, token, posts, currentSha) {
    const url = `https://api.github.com/repos/${ghUser}/${ghRepo}/contents/data/posts.json`;

    const content = JSON.stringify({ posts }, null, 2);
    // GitHub requiere Base64
    const encoded = btoa(unescape(encodeURIComponent(content)));

    const body = {
      message: `Blog: actualizar posts.json [${new Date().toISOString()}]`,
      content: encoded,
      branch: 'main'
    };

    // Si el archivo ya existe, hay que mandar el SHA para actualizarlo
    if (currentSha) {
      body.sha = currentSha;
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `Error al guardar: ${res.status}`);
    }

    return await res.json();
  }

};
