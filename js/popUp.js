// Simulación: obtener usuario desde localStorage (podés reemplazar esto por tu lógica real)
function estaLogueado() {
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));
  return usuario || null;
}

// Verifica si el usuario tiene la información completa
function informacionCompleta(usuario) {
  if (
    !usuario ||
    !usuario.personalData ||
    !usuario.personalData.birthDate ||
    !usuario.personalData.nationality ||
    !Array.isArray(usuario.academicData) ||
    usuario.academicData.length === 0 ||
    !Array.isArray(usuario.languages) ||
    usuario.languages.length === 0
  ) {
    return false;
  }

  const academicoInvalido = usuario.academicData.some((item) => !item.degree);
  return !academicoInvalido;
}

// Crea y muestra el popup dinámicamente
function mostrarPopupPerfilIncompleto() {
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.id = "popupOverlay";
  overlay.className = "popup-overlay";
  overlay.onclick = () => {
    document.getElementById("popupOverlay")?.remove();
    document.getElementById("popupPerfilIncompleto")?.remove();
  };

  // Crear popup
  const popup = document.createElement("div");
  popup.id = "popupPerfilIncompleto";
  popup.className = "popup-container";

  popup.innerHTML = `
      <div class="popup-close" onclick="document.getElementById('popupOverlay').remove(); document.getElementById('popupPerfilIncompleto').remove()">✖</div>
      <h4 class="popup-title">¡Completá tu perfil y aprovechá al máximo TodoBeca! 📋</h4>
      <p class="popup-text">
        Al completar tu perfil, vas a poder ver fácilmente en qué becas cumplís con los requisitos y en cuáles no.
      </p>
      <img src="images/popUp.png" alt="Perfil" class="popup-image">
      <p class="popup-text">
        También vas a acceder a filtros avanzados y recomendaciones personalizadas que se ajustan a tus estudios, idioma y objetivos.
        Cuanto más completo esté tu perfil, más precisa será la experiencia. 🎯
      </p>
      <a href="/profile.html" class="btn btn-primary btn-pill">Ir a mi perfil</a>
    `;

  // Agregar al DOM
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Activar animación con un pequeño delay
  setTimeout(() => {
    popup.classList.add("visible");
    overlay.classList.add("visible");
  }, 50);
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const usuario = estaLogueado();
  if (usuario && !informacionCompleta(usuario)) {
    mostrarPopupPerfilIncompleto();
  }
});
