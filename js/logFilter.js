document.addEventListener("DOMContentLoaded", function () {
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));

  // Elementos a mostrar/ocultar
  const filtrosSoloLogueados = ["logedUser"];

  // Mostrar u ocultar los filtros según el estado del usuario
  filtrosSoloLogueados.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.style.display = usuario ? "block" : "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Verificar si el usuario está autenticado
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));

  // Obtener el div que contiene el contenido para usuarios no autenticados
  const contenidoNoLogueado = document.getElementById("unloged");

  // Mostrar u ocultar el contenido según el estado del usuario
  if (contenidoNoLogueado) {
    contenidoNoLogueado.style.display = usuario ? "none" : "block";
  }
});
