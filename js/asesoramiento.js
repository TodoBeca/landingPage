// asesoramiento.js - Maneja el flujo de asesoramiento entre páginas

document.addEventListener("DOMContentLoaded", function () {
  // Si estamos en la página de detalle de beca
  if (document.getElementById("btn-asesoramiento")) {
    configurarBotonAsesoramiento();
  }

  // Si estamos en la página principal (index.html)
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    cargarDatosBecaEnFormulario();
  }
});

function configurarBotonAsesoramiento() {
  const asesoramientoBtn = document.getElementById("btn-asesoramiento");

  if (asesoramientoBtn) {
    asesoramientoBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Obtener datos completos de la beca
      const becaData = obtenerDatosBeca();

      // Guardar datos en sessionStorage
      sessionStorage.setItem(
        "datosBecaAsesoramiento",
        JSON.stringify(becaData)
      );

      // Redirigir a la página de contacto
      window.location.href = "index.html#contact-section";
    });
  }
}

// Resto del código permanece igual...
function obtenerDatosBeca() {
  return {
    nombre:
      document.getElementById("beca-nombre")?.textContent ||
      "Beca no especificada",
    paisDestino:
      document.getElementById("beca-pais-destino")?.textContent ||
      "País no especificado",
    regionDestino:
      document.getElementById("beca-region-destino")?.textContent || "",
    fechaLimite:
      document.getElementById("beca-fecha-limite")?.textContent ||
      "Fecha no especificada",
    tipo:
      document.getElementById("beca-tipo")?.textContent ||
      "Tipo no especificado",
    areaEstudio:
      document.getElementById("beca-area-estudio")?.textContent ||
      "Área no especificada",
    entidad: document.getElementById("beca-entidad")?.textContent || "",
    duracion: document.getElementById("beca-duracion")?.textContent || "",
  };
}

function cargarDatosBecaEnFormulario() {
  // Verificar si estamos en la sección de contacto
  if (window.location.hash === "#contact-section") {
    const becaDataStr = sessionStorage.getItem("datosBecaAsesoramiento");

    if (becaDataStr) {
      const becaData = JSON.parse(becaDataStr);
      const messageTextarea = document.getElementById("message");

      if (messageTextarea) {
        // Crear mensaje estructurado
        const mensaje =
          `Solicito asesoramiento sobre la siguiente beca:\n\n` +
          `* Nombre: ${becaData.nombre}\n` +
          `* Entidad: ${becaData.entidad}\n` +
          `* Destino: ${becaData.paisDestino}${
            becaData.regionDestino ? ` (${becaData.regionDestino})` : ""
          }\n` +
          `* Fecha límite: ${becaData.fechaLimite}\n` +
          `* Tipo: ${becaData.tipo}\n` +
          `* Área de estudio: ${becaData.areaEstudio}\n` +
          `* Duración: ${becaData.duracion}\n\n` +
          `Por favor contáctenme para brindarme más información sobre los requisitos y el proceso de aplicación.`;

        messageTextarea.value = mensaje;

        // Limpiar los datos después de usarlos
        sessionStorage.removeItem("datosBecaAsesoramiento");

        // Scroll suave al formulario
        setTimeout(() => {
          const contactSection = document.getElementById("contact-section");
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    }
  }
}
