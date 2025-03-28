document.addEventListener("DOMContentLoaded", function () {
  // Verifica si el usuario está logueado
  function estaLogueado() {
    return (
      localStorage.getItem("token") !== null ||
      sessionStorage.getItem("token") !== null
    );
  }

  if (estaLogueado()) {
    // Obtiene los datos del usuario desde localStorage o sessionStorage
    const usuario =
      JSON.parse(localStorage.getItem("usuario")) ||
      JSON.parse(sessionStorage.getItem("usuario"));

    if (usuario) {
      // Rellena los campos del formulario
      document.querySelector('input[name="Nombre"]').value =
        usuario.personalData.firstName || "";
      document.querySelector('input[name="Apellido"]').value =
        usuario.personalData.lastName || "";
      document.querySelector('input[name="email"]').value = usuario.email || "";
    }
  }
});
