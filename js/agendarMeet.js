// asesoramiento.js - Maneja el flujo de asesoramiento entre páginas

document.addEventListener("DOMContentLoaded", function () {
  // Si estamos en la página de FAQ
  if (document.getElementById("btn-agendar")) {
    configurarBotonAgendar();
  }

  // Si estamos en la página principal (index.html)
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    cargarDatosBecaEnFormulario();
  }
});

function configurarBotonAgendar() {
  const agendarBtn = document.getElementById("btn-agendar");

  if (agendarBtn) {
    agendarBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Redirigir a la página de contacto
      window.location.href = "index.html#contact-section";
    });
  }
}

function cargarDatosBecaEnFormulario() {
  // Verificar si estamos en la sección de contacto
  if (window.location.hash === "#contact-section") {
    const messageTextarea = document.getElementById("message");

    if (messageTextarea) {
      // Crear mensaje estructurado
      const mensaje = `Hola, me gustaría agendar una reunión virtual gratuita de 20 minutos para conocer más sobre las oportunidades de becas disponibles.`;

      messageTextarea.value = mensaje;
      messageTextarea.focus(); // Enfocar el textarea

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
