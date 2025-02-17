document.addEventListener("DOMContentLoaded", function () {
  // Obtener datos de educación desde sessionStorage o localStorage (lo que esté disponible)
  let academicData =
    JSON.parse(sessionStorage.getItem("academicData")) ||
    JSON.parse(localStorage.getItem("academicData")) ||
    [];

  // Elementos del DOM
  const openModalButton = document.getElementById("openEducationModal");
  const closeModalButton = document.getElementById("closeEducationModal");
  const educationModal = document.getElementById("educationModal");
  const educationForm = educationModal
    ? educationModal.querySelector("form")
    : null;
  const educationSection = document.getElementById("educacion");
  const institutionInput = document.getElementById("institution");
  const suggestionsContainer = document.getElementById("suggestionsContainer");

  // Función para obtener universidades desde la API
  async function fetchUniversities(query) {
    if (query.length < 2) {
      suggestionsContainer.style.display = "none";
      return;
    }

    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${query}`
      );
      const data = await response.json();
      showSuggestions(data);
    } catch (error) {
      console.error("Error al obtener universidades:", error);
    }
  }

  // Mostrar sugerencias en la lista tipo dropdown
  function showSuggestions(universities) {
    suggestionsContainer.innerHTML = "";
    if (universities.length === 0) {
      suggestionsContainer.style.display = "none";
      return;
    }

    universities.forEach((uni) => {
      const item = document.createElement("a");
      item.classList.add("dropdown-item");
      item.textContent = uni.name;
      item.href = "#";

      item.addEventListener("click", function (e) {
        e.preventDefault();
        institutionInput.value = uni.name;
        suggestionsContainer.style.display = "none";
      });

      suggestionsContainer.appendChild(item);
    });

    suggestionsContainer.style.display = "block";
  }

  // Evento para capturar la escritura en el input
  institutionInput.addEventListener("input", function () {
    fetchUniversities(institutionInput.value);
  });

  // Cerrar la lista si se hace clic fuera
  document.addEventListener("click", function (event) {
    if (
      !institutionInput.contains(event.target) &&
      !suggestionsContainer.contains(event.target)
    ) {
      suggestionsContainer.style.display = "none";
    }
  });

  // Ajustar ancho del dropdown si cambia la ventana
  window.addEventListener("resize", function () {
    suggestionsContainer.style.width = institutionInput.offsetWidth + "px";
  });

  // Función para renderizar tarjetas de educación
  function renderAllEducationCards() {
    educationSection.innerHTML = "";
    academicData.forEach(renderEducationCard);
  }

  function renderEducationCard(record) {
    const startDateFormatted = record.startYear
      ? `${record.startMonth.toString().padStart(2, "0")}/${record.startYear}`
      : "Fecha no especificada";

    const endDateFormatted = record.endYear
      ? `${record.endMonth.toString().padStart(2, "0")}/${record.endYear}`
      : "Fecha no especificada";

    const cardHTML = `
      <div class="card mt-2">
        <div class="card-body">
          <h5 class="text-primary">${
            record.institution || "Institución no especificada"
          }</h5>
          <span class="text-secondary">
            ${record.discipline || "Disciplina no especificada"}<br>
            ${startDateFormatted} - ${endDateFormatted}<br>
          </span>
        </div>
      </div>
    `;
    educationSection.insertAdjacentHTML("beforeend", cardHTML);
  }

  // Abrir el modal
  if (openModalButton) {
    openModalButton.addEventListener("click", function () {
      educationModal.style.display = "block";
    });
  }

  // Cerrar el modal
  if (closeModalButton) {
    closeModalButton.addEventListener("click", function () {
      educationModal.style.display = "none";
    });
  }

  // Cerrar el modal al hacer clic fuera
  window.onclick = function (event) {
    if (event.target == educationModal) {
      educationModal.style.display = "none";
    }
  };

  // Llenar los selectores de año
  const startYearSelect = document.getElementById("start-year");
  const endYearSelect = document.getElementById("end-year");
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= 1900; year--) {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    startYearSelect.appendChild(option.cloneNode(true));
    endYearSelect.appendChild(option.cloneNode(true));
  }

  // Guardar datos en sessionStorage y localStorage
  if (educationForm) {
    educationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const institution = document.getElementById("institution").value;
      const degree = document.getElementById("degree").value;
      const discipline = document.getElementById("discipline").value;
      const startMonth = document.getElementById("start-month").value;
      const startYear = document.getElementById("start-year").value;
      const endMonth = document.getElementById("end-month").value;
      const endYear = document.getElementById("end-year").value;

      const academicRecord = {
        institution,
        degree,
        discipline,
        startMonth,
        startYear,
        endMonth,
        endYear,
      };

      const existingIndex = academicData.findIndex(
        (item) => item.institution === institution && item.degree === degree
      );

      if (existingIndex !== -1) {
        academicData[existingIndex] = academicRecord;
      } else {
        academicData.push(academicRecord);
      }

      // Guardar en sessionStorage y localStorage
      sessionStorage.setItem("academicData", JSON.stringify(academicData));
      localStorage.setItem("academicData", JSON.stringify(academicData));

      renderAllEducationCards();
      educationModal.style.display = "none";
      educationForm.reset();
    });
  }

  renderAllEducationCards();

  // Función para obtener datos desde sessionStorage o localStorage
  window.getEducationData = function () {
    return (
      JSON.parse(sessionStorage.getItem("academicData")) ||
      JSON.parse(localStorage.getItem("academicData")) ||
      []
    );
  };
});
