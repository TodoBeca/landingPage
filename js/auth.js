function cerrarSesion() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
}

function cerrarSesionProfile() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "index.html";
}

function actualizarUI() {
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));

  if (usuario) {
    // Si hay un usuario logueado, mostrar el menú de usuario
    const iniciales =
      usuario.personalData.firstName.charAt(0).toUpperCase() +
      usuario.personalData.lastName.charAt(0).toUpperCase();
    document.getElementById("authContainer").innerHTML = `
        <div class="dropdown d-flex">
            <button class="btn btn-auth btn-pill dropdown-toggle d-flex align-items-center justify-content-center ml-auto"
            type="button"
            id="userDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            >
                ${iniciales}
            </button>
            <div class="dropdown-menu dropdown-menu-auto" aria-labelledby="userDropdown">
                <a class="dropdown-item" href="/profile.html">Mi Perfil</a>
                <a class="dropdown-item" href="#" id="logoutButton">Cerrar Sesión</a>
            </div>
        </div>
        `;

    // Asignar evento de cerrar sesión dinámicamente
    document
      .getElementById("logoutButton")
      .addEventListener("click", cerrarSesion);
  } else {
    // Si no hay usuario, mostrar el botón de "Iniciar Sesión"
    document.getElementById("authContainer").innerHTML = `
          <button id="btn-auth" class="btn btn-auth btn-pill" onclick="window.location.href='/login.html'">
            Iniciar Sesión
          </button>
        `;
  }
}

// Verificar si el usuario está logueado en cada página
document.addEventListener("DOMContentLoaded", function () {
  actualizarUI();
});
