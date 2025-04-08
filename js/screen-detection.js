// Función para detectar si es un dispositivo móvil
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

// Función para redirigir a la página móvil
function redirectToMobile() {
  const currentPath = window.location.pathname;
  // Verificar si estamos en la página principal
  if (
    isMobileDevice() &&
    (currentPath === "/" ||
      currentPath === "" ||
      currentPath.endsWith("index.html") ||
      currentPath === "/index")
  ) {
    window.location.href = "mobile.html";
  }
}

// Ejecutar la detección cuando se carga la página
window.addEventListener("load", redirectToMobile);

// También ejecutar cuando se redimensiona la ventana
window.addEventListener("resize", redirectToMobile);

// Agregar log para debugging en producción
console.log("Device detection:", {
  isMobile: isMobileDevice(),
  path: window.location.pathname,
  userAgent: navigator.userAgent,
  windowWidth: window.innerWidth,
});
