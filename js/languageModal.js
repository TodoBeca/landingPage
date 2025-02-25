document.addEventListener("DOMContentLoaded", function () {
  sessionStorage.removeItem("languageData");
  // Cargar datos previos desde localStorage si existen
  let languageData = JSON.parse(sessionStorage.getItem("languages")) || [];

  // Elementos del DOM
  const openModalButton = document.getElementById("openLanguageModal");
  const closeModalButton = document.getElementById("closeLanguageModal");
  const languageModal = document.getElementById("languageModal");
  const languageForm = languageModal.querySelector("form");
  const languageSection = document.getElementById("language");

  // Función para renderizar todas las tarjetas al inicio
  function renderAllLanguageCards() {
    languageSection.innerHTML = ""; // Limpiar la sección antes de renderizar
    languageData.forEach(renderLanguageCard);
  }

  // Abrir el modal
  if (openModalButton) {
    openModalButton.addEventListener("click", function () {
      languageModal.style.display = "block";
    });
  }

  // Cerrar el modal
  if (closeModalButton) {
    closeModalButton.addEventListener("click", function () {
      languageModal.style.display = "none";
    });
  }

  // Cerrar el modal al hacer clic fuera de él
  window.onclick = function (event) {
    if (event.target == languageModal) {
      languageModal.style.display = "none";
    }
  };

  // Guardar los datos del modal en el estado intermedio
  if (languageForm) {
    languageForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Capturar los datos del formulario
      const language = document.getElementById("languageValue").value;
      const level = document.getElementById("level").value;

      // Crear un objeto con los datos de educación
      const languageRecord = {
        language,
        level,
      };

      // Si ya existe una entrada con la misma institución y título, se reemplaza
      const existingIndex = languageData.findIndex(
        (item) => item.language === language && item.title === title
      );

      if (existingIndex !== -1) {
        languageData[existingIndex] = languageRecord; // Sobrescribir si ya existe
      } else {
        languageData.push(languageRecord); // Agregar si no existe
      }

      // Guardar en localStorage
      sessionStorage.setItem("languageData", JSON.stringify(languageData));

      // Volver a renderizar la lista completa
      renderAllLanguageCards();

      // Cerrar el modal
      languageModal.style.display = "none";

      // Limpiar el formulario
      languageForm.reset();
    });
  }

  // Función para renderizar una tarjeta de educación
  function renderLanguageCard(record) {
    const cardHTML = `
        <div class="card mt-2">
          <div class="card-body">
            <h5 class="text-primary">${
              record.language || "Institución no especificada"
            }</h5>
            <span class="text-secondary">
              ${record.level || "Disciplina no especificada"}
            </span>
          </div>
        </div>
      `;
    languageSection.insertAdjacentHTML("beforeend", cardHTML);
  }

  // Cargar las tarjetas al inicio
  renderAllLanguageCards();

  // Exportar el estado intermedio para que pueda ser usado en updateUser.js
  window.getlanguageData = function () {
    return JSON.parse(sessionStorage.getItem("languageData")) || [];
  };
});
