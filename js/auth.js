/**
 * auth.js
 * Manejo de autenticación del panel admin.
 * 
 * IMPORTANTE: Estas credenciales son locales (no de GitHub).
 * Para cambiarlas, editá ADMIN_USER y ADMIN_PASS acá abajo.
 */

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'cree2026';

const Auth = {

  // Verificar credenciales y guardar sesión
  login(username, password, ghToken, ghUser, ghRepo) {
    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return false;
    }
    // Guardar en sessionStorage (se borra al cerrar el navegador)
    sessionStorage.setItem('cree_logged', '1');
    sessionStorage.setItem('cree_token', ghToken);
    sessionStorage.setItem('cree_gh_user', ghUser);
    sessionStorage.setItem('cree_gh_repo', ghRepo);
    return true;
  },

  logout() {
    sessionStorage.clear();
    window.location.href = '../admin/login.html';
  },

  isLogged() {
    return sessionStorage.getItem('cree_logged') === '1';
  },

  getToken() {
    return sessionStorage.getItem('cree_token');
  },

  getGhUser() {
    return sessionStorage.getItem('cree_gh_user');
  },

  getGhRepo() {
    return sessionStorage.getItem('cree_gh_repo');
  },

  // Redirigir si no está logueado (usar en dashboard.html)
  requireLogin() {
    if (!this.isLogged()) {
      window.location.href = 'login.html';
    }
  }

};

// Función global para el botón "Cerrar sesión"
function logout() {
  Auth.logout();
}
