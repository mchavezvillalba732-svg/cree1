# Blog CREE

Blog del Centro Regional de Educación - Gral. Patricio Escobar, Encarnación.

## Estructura de archivos

```
blog-cree/
├── index.html        → Página principal (muestra los posts)
├── admin.html        → Panel de administración
├── css/
│   └── styles.css    → Estilos
├── js/
│   ├── config.js     → ⚙️ CONFIGURACIÓN (editá esto primero)
│   ├── github.js     → Conexión con la API de GitHub
│   ├── blog.js       → Lógica de la página principal
│   └── admin.js      → Lógica del panel admin
└── data/
    └── posts.json    → Base de datos de posts (GitHub la actualiza)
```

## Configuración inicial (IMPORTANTE)

Antes de subir, abrí `js/config.js` y reemplazá:

```js
GITHUB_USUARIO: "TU_USUARIO_AQUI",   // ← tu usuario de GitHub
GITHUB_REPO:    "TU_REPO_AQUI",      // ← nombre del repositorio
```

## Cómo generar el Token de GitHub

1. Ir a GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic) → Generate new token
3. Marcar permiso: `repo` (acceso completo al repositorio)
4. Copiar el token (empieza con `ghp_...`)
5. Guardarlo en un lugar seguro - solo se muestra una vez

## Activar GitHub Pages

1. Ir al repositorio → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Guardar → en unos minutos el blog estará en:
   `https://TU_USUARIO.github.io/TU_REPO/`

## Cómo usar el Admin

1. Ir a `TU_BLOG/admin.html`
2. Ingresar usuario y contraseña (configurados en `config.js`)
3. Pegar el token de GitHub
4. Publicar artículos - se guardan automáticamente en el repositorio
