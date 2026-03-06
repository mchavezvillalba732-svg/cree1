/**
 * login.js
 * Lógica del formulario de login en admin/login.html
 */

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const ghToken  = document.getElementById('gh-token').value.trim();
  const ghUser   = document.getElementById('gh-user').value.trim();
  const ghRepo   = document.getElementById('gh-repo').value.trim();

  const ok = Auth.login(username, password, ghToken, ghUser, ghRepo);

  if (ok) {
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
});
