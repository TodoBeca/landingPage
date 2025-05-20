function isMobileDevice() {
  const screenWidth = window.screen.width;
  return screenWidth <= 992;
}

function showMobilePopup() {
  // Evitar duplicación del popup
  if (document.getElementById("popupOverlay")) return;

  // Crear overlay
  const overlay = document.createElement("div");
  overlay.id = "popupOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.padding = "20px";
  overlay.style.overflowY = "auto";

  // Crear popup HTML
  overlay.innerHTML = `
    <div class="row align-items-center justify-content-center register-card" style="width: 100%;">
      <div class="col-md-8 mx-auto" data-aos="fade-up" data-aos-delay="500">
        <div class="card p-5 shadow-lg bg-white rounded text-center">
          <h2 class="mb-3">Bienvenido a TodoBeca.com</h2>
          <p class="text-primary mb-4">
            Para una mejor experiencia, por favor, abre nuestra página web en una computadora o tablet.
          </p>
          <p class="text-primary font-weight-bold mb-4" style="cursor: pointer;" onclick="document.getElementById('popupOverlay').remove();">
            ¡Seguir de todos modos!
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function handleMobileBehavior() {
  const currentPath = window.location.pathname;
  const isMobile = isMobileDevice();

  console.log("Redirect check:", {
    currentPath,
    isMobile,
    screenWidth: window.screen.width,
    innerWidth: window.innerWidth,
  });

  if (
    isMobile &&
    (currentPath === "/" ||
      currentPath === "" ||
      currentPath.endsWith("index.html") ||
      currentPath === "/index")
  ) {
    showMobilePopup();
  }
}

window.addEventListener("load", handleMobileBehavior);
window.addEventListener("resize", handleMobileBehavior);

console.log("Device detection:", {
  isMobile: isMobileDevice(),
  path: window.location.pathname,
  userAgent: navigator.userAgent,
  windowWidth: window.innerWidth,
});
