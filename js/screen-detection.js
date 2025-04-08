// Función para detectar si es un dispositivo móvil
function isMobileDevice() {
  return window.innerWidth <= 768; // Consideramos móvil si el ancho es menor o igual a 768px
}

// Función para redirigir a la página móvil
function redirectToMobile() {
  if (isMobileDevice() && window.location.pathname.endsWith("index.html")) {
    window.location.href = "mobile.html";
  }
}

// Ejecutar la detección cuando se carga la página
window.addEventListener("load", redirectToMobile);

// También ejecutar cuando se redimensiona la ventana
window.addEventListener("resize", redirectToMobile);
