// Función para detectar si es un dispositivo móvil basado solo en el ancho de pantalla
function isMobileDevice() {
  // Usar window.screen.width para obtener el ancho real de la pantalla
  const screenWidth = window.screen.width;
  console.log("Screen width:", screenWidth);
  return screenWidth <= 992;
}

// Función para redirigir a la página móvil
function redirectToMobile() {
  const currentPath = window.location.pathname;
  const isMobile = isMobileDevice();

  console.log("Redirect check:", {
    currentPath,
    isMobile,
    screenWidth: window.screen.width,
    innerWidth: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
  });

  // Verificar si estamos en la página principal y el ancho es menor o igual a 768px
  if (
    isMobile &&
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
