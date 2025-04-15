// Función global para actualizar el usuario en el servidor
async function updateUser(updatedData) {
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario._id) {
    throw new Error("Usuario no autenticado o ID no disponible");
  }

  try {
    const response = await fetch(
      `${CONFIG.API_URL_UPDATE_USER}/${usuario._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar el usuario");
    }

    const updatedUser = await response.json();

    // Guardar solo en el almacenamiento original
    if (localStorage.getItem("usuario")) {
      localStorage.setItem("usuario", JSON.stringify(updatedUser));
    } else if (sessionStorage.getItem("usuario")) {
      sessionStorage.setItem("usuario", JSON.stringify(updatedUser));
    }

    return updatedUser;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
}

// Función para obtener el usuario por email
async function obtenerUsuarioPorEmail(email) {
  try {
    const response = await fetch(
      `${CONFIG.API_URL_GET_USER}?userEmail=${encodeURIComponent(
        email
      )}&timestamp=${Date.now()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok)
      throw new Error(`Error al obtener el usuario: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error al conectar con la API de usuario:", error);
    return null;
  }
}

// Función para renderizar las tarjetas de educación
function renderAllEducationCards(usuario) {
  const educacionDiv = document.getElementById("educacion");
  if (educacionDiv) {
    educacionDiv.innerHTML = "";

    if (usuario.academicData && usuario.academicData.length > 0) {
      usuario.academicData.forEach((academicRecord, index) => {
        const startDateFormatted = academicRecord.startYear
          ? `${academicRecord.startMonth.toString().padStart(2, "0")}/${
              academicRecord.startYear
            }`
          : "Fecha no especificada";

        const endDateFormatted = academicRecord.endYear
          ? `${academicRecord.endMonth.toString().padStart(2, "0")}/${
              academicRecord.endYear
            }`
          : "Fecha no especificada";

        const academicHTML = `
          <div class="card mt-2">
            <div class="card-body">
              <div class="row align-items-center justify-content-between px-2">
                <div>
                  <h5 class="text-primary">${
                    academicRecord.institution || "Institución no especificada"
                  }</h5>
                  <span class="text-secondary">
                    Título de <strong>${
                      academicRecord.degree || "No especificado"
                    }</strong> en <strong>${
          academicRecord.discipline || "Disciplina no especificada"
        }</strong><br>
                    ${startDateFormatted} - ${endDateFormatted}<br>
                  </span>
                </div>
                <div>
                  <span class="icon-pencil fs-3 ms-3" onclick="editEducation(${index})"></span>
                  <span class="icon-close fs-3 ms-3" onclick="deleteEducation(${index})"></span>
                </div>
              </div>
            </div>
          </div>
        `;
        educacionDiv.insertAdjacentHTML("beforeend", academicHTML);
      });
    }
  }
}

// Función para eliminar un registro de educación
window.deleteEducation = async function (index) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(sessionStorage.getItem("usuario"));
      usuario.academicData.splice(index, 1);

      const updatedUser = await updateUser({
        academicData: usuario.academicData,
      });

      // Guardar solo en el almacenamiento original
      if (localStorage.getItem("usuario")) {
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem("usuario")) {
        sessionStorage.setItem("usuario", JSON.stringify(updatedUser));
      }

      renderAllEducationCards(updatedUser);
      Swal.fire(
        "¡Eliminado!",
        "El registro de educación ha sido eliminado.",
        "success"
      );
    } catch (error) {
      console.error("Error al eliminar el registro de educación:", error);
      Swal.fire(
        "Error",
        "Hubo un error al eliminar el registro de educación.",
        "error"
      );
    }
  }
};

// Función para editar un registro de educación
window.editEducation = function (index) {
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));
  const selectedRecord = usuario.academicData[index];

  document.getElementById("institution").value =
    selectedRecord.institution || "";
  document.getElementById("degree").value = selectedRecord.degree || "";
  document.getElementById("discipline").value = selectedRecord.discipline || "";
  document.getElementById("start-month").value =
    selectedRecord.startMonth || "";
  document.getElementById("start-year").value = selectedRecord.startYear || "";
  document.getElementById("end-month").value = selectedRecord.endMonth || "";
  document.getElementById("end-year").value = selectedRecord.endYear || "";

  const educationModal = document.getElementById("educationModal");
  educationModal.setAttribute("data-edit-index", index);
  educationModal.style.display = "block";
};

// Función para llenar los selectores de año
function fillYearSelectors() {
  const startYearSelect = document.getElementById("start-year");
  const endYearSelect = document.getElementById("end-year");
  const currentYear = new Date().getFullYear();

  startYearSelect.innerHTML = '<option value="">Año de inicio</option>';
  endYearSelect.innerHTML = '<option value="">Año de fin</option>';

  for (let year = currentYear; year >= 1900; year--) {
    const optionStart = document.createElement("option");
    optionStart.value = year;
    optionStart.textContent = year;
    startYearSelect.appendChild(optionStart);

    const optionEnd = document.createElement("option");
    optionEnd.value = year;
    optionEnd.textContent = year;
    endYearSelect.appendChild(optionEnd);
  }
}

// Función para renderizar las tarjetas de idiomas
function renderAllLanguageCards(usuario) {
  const languageSection = document.getElementById("language");
  if (languageSection) {
    languageSection.innerHTML = "";

    if (usuario.languages && usuario.languages.length > 0) {
      usuario.languages.forEach((languageRecord, index) => {
        const languageHTML = `
          <div class="card mt-2">
            <div class="card-body">
              <div class="row align-items-center justify-content-between px-2">
                <div>
                  <h5 class="text-primary">${
                    languageRecord.language || "Idioma no especificado"
                  }</h5>
                  <span class="text-secondary">
                    Nivel: <strong>${
                      languageRecord.level || "No especificado"
                    }</strong>
                  </span>
                </div>
                <div>
                  <span class="icon-pencil fs-3 ms-3" onclick="editLanguage(${index})"></span>
                  <span class="icon-close fs-3 ms-3" onclick="deleteLanguage(${index})"></span>
                </div>
              </div>
            </div>
          </div>
        `;
        languageSection.insertAdjacentHTML("beforeend", languageHTML);
      });
    }
  }
}

// Función para eliminar un registro de idioma
window.deleteLanguage = async function (index) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(sessionStorage.getItem("usuario"));
      usuario.languages.splice(index, 1);

      const updatedUser = await updateUser({
        languages: usuario.languages,
      });

      // Guardar solo en el almacenamiento original
      if (localStorage.getItem("usuario")) {
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem("usuario")) {
        sessionStorage.setItem("usuario", JSON.stringify(updatedUser));
      }

      renderAllLanguageCards(updatedUser);
      Swal.fire(
        "¡Eliminado!",
        "El registro de idioma ha sido eliminado.",
        "success"
      );
    } catch (error) {
      console.error("Error al eliminar el registro de idioma:", error);
      Swal.fire(
        "Error",
        "Hubo un error al eliminar el registro de idioma.",
        "error"
      );
    }
  }
};

// Función para editar un registro de idioma
window.editLanguage = function (index) {
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));
  const selectedRecord = usuario.languages[index];

  document.getElementById("languageValue").value =
    selectedRecord.language || "";
  document.getElementById("level").value = selectedRecord.level || "";

  const languageModal = document.getElementById("languageModal");
  languageModal.setAttribute("data-edit-index", index);
  languageModal.style.display = "block";
};

// Evento para cargar la página
document.addEventListener("DOMContentLoaded", async function () {
  let usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.email) {
    console.error("Usuario no autenticado o email no disponible.");
    return;
  }

  try {
    const userData = await obtenerUsuarioPorEmail(usuario.email);
    if (!userData) {
      console.error("No se encontraron datos del usuario.");
      return;
    }

    usuario = { ...usuario, ...userData };

    // Guardar solo en el almacenamiento original
    if (localStorage.getItem("usuario")) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else if (sessionStorage.getItem("usuario")) {
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
    }

    renderAllEducationCards(usuario);
    renderAllLanguageCards(usuario);

    // Actualizar el perfil del usuario
    const userFullNameElement = document.getElementById("userFullName");
    const userEmailElement = document.getElementById("userEmail");

    if (userFullNameElement && userEmailElement) {
      userFullNameElement.textContent = `${usuario.personalData.firstName} ${usuario.personalData.lastName}`;
      userEmailElement.textContent = usuario.email;
    }

    // Rellenar los campos del formulario
    const fields = {
      firstName: document.querySelector('input[name="personalData.firstName"]'),
      lastName: document.querySelector('input[name="personalData.lastName"]'),
      birthDate: document.querySelector('input[name="personalData.birthDate"]'),
      gender: document.querySelector('select[name="personalData.gender"]'),
      paisCode: document.querySelector('select[name="personalData.paisCode"]'),
      phone: document.querySelector('input[name="personalData.phone"]'),
      currentCity: document.querySelector(
        'input[name="personalData.currentCity"]'
      ),
      nationality: document.querySelector(
        'select[name="personalData.nationality"]'
      ),
      additionalCitizenship: document.querySelector(
        'select[name="personalData.additionalCitizenship"]'
      ),
      instagram: document.querySelector('input[name="socialMedia.instagram"]'),
      twitter: document.querySelector('input[name="socialMedia.twitter"]'),
      linkedin: document.querySelector('input[name="socialMedia.linkedin"]'),
    };

    if (fields.firstName)
      fields.firstName.value = usuario.personalData.firstName || "";
    if (fields.lastName)
      fields.lastName.value = usuario.personalData.lastName || "";
    if (fields.birthDate)
      fields.birthDate.value = usuario.personalData.birthDate
        ? new Date(usuario.personalData.birthDate).toISOString().split("T")[0]
        : "";
    if (fields.gender) fields.gender.value = usuario.personalData.gender || "";
    if (fields.phone) fields.phone.value = usuario.personalData.phone || "";
    if (fields.paisCode)
      fields.paisCode.value = usuario.personalData.paisCode || "+0";
    if (fields.currentCity)
      fields.currentCity.value = usuario.personalData.currentCity || "";
    if (fields.nationality)
      fields.nationality.value = usuario.personalData.nationality || "";
    if (fields.additionalCitizenship)
      fields.additionalCitizenship.value =
        usuario.personalData.additionalCitizenship || "";
    if (fields.instagram)
      fields.instagram.value = usuario.socialMedia.instagram || "";
    if (fields.twitter)
      fields.twitter.value = usuario.socialMedia.twitter || "";
    if (fields.linkedin)
      fields.linkedin.value = usuario.socialMedia.linkedin || "";
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
    alert("Hubo un error al cargar los datos del usuario.");
  }
});

// Evento para guardar el perfil
document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.querySelector("#profile-button");

  if (saveButton) {
    saveButton.addEventListener("click", async function (event) {
      event.preventDefault();

      const loadingSpinner = document.getElementById("loadingSpinner");
      if (loadingSpinner) loadingSpinner.style.display = "block";
      saveButton.disabled = true;
      saveButton.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> Guardando cambios...';

      const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(sessionStorage.getItem("usuario"));

      if (!usuario || !usuario._id) {
        alert("Usuario no autenticado o ID no disponible");
        if (loadingSpinner) loadingSpinner.style.display = "none";
        saveButton.disabled = false;
        return;
      }

      const updatedData = {
        personalData: {
          firstName: document.querySelector(
            'input[name="personalData.firstName"]'
          ).value,
          lastName: document.querySelector(
            'input[name="personalData.lastName"]'
          ).value,
          birthDate: document.querySelector(
            'input[name="personalData.birthDate"]'
          ).value,
          gender: document.querySelector('select[name="personalData.gender"]')
            .value,
          phone: document.querySelector('input[name="personalData.phone"]')
            .value,
          paisCode: document.querySelector(
            'select[name="personalData.paisCode"]'
          ).value,
          currentCity: document.querySelector(
            'input[name="personalData.currentCity"]'
          ).value,
          nationality: document.querySelector(
            'select[name="personalData.nationality"]'
          ).value,
          additionalCitizenship: document.querySelector(
            'select[name="personalData.additionalCitizenship"]'
          ).value,
        },
        socialMedia: {
          instagram: document.querySelector(
            'input[name="socialMedia.instagram"]'
          ).value,
          twitter: document.querySelector('input[name="socialMedia.twitter"]')
            .value,
          linkedin: document.querySelector('input[name="socialMedia.linkedin"]')
            .value,
        },
      };

      console.log("data", updatedData);

      try {
        const updatedUser = await updateUser(updatedData);
        await Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Perfil actualizado correctamente",
          confirmButtonText: "Aceptar",
        });
        window.location.reload();
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        alert(error.message || "Hubo un error al actualizar el perfil");
      } finally {
        if (loadingSpinner) loadingSpinner.style.display = "none";
        saveButton.disabled = false;
      }
    });
  }
});

// Evento para el modal de educación
document.addEventListener("DOMContentLoaded", function () {
  const educationModal = document.getElementById("educationModal");
  const educationForm = educationModal
    ? educationModal.querySelector("form")
    : null;

  if (educationForm) {
    educationForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const institution = document.getElementById("institution").value;
      const degree = document.getElementById("degree").value;
      const discipline = document.getElementById("discipline").value;
      const startMonth = parseInt(
        document.getElementById("start-month").value,
        10
      );
      const startYear = parseInt(
        document.getElementById("start-year").value,
        10
      );
      const endMonth = parseInt(document.getElementById("end-month").value, 10);
      const endYear = Math.min(
        parseInt(document.getElementById("end-year").value, 10),
        new Date().getFullYear() + 10
      );

      const editIndex = educationModal.getAttribute("data-edit-index");
      const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(sessionStorage.getItem("usuario"));

      if (editIndex !== null) {
        const index = parseInt(editIndex, 10);
        usuario.academicData[index] = {
          institution,
          degree,
          discipline,
          startMonth,
          startYear,
          endMonth,
          endYear,
        };
      } else {
        usuario.academicData.push({
          institution,
          degree,
          discipline,
          startMonth,
          startYear,
          endMonth,
          endYear,
        });
      }

      try {
        const updatedUser = await updateUser({
          academicData: usuario.academicData,
        });

        // Guardar solo en el almacenamiento original
        if (localStorage.getItem("usuario")) {
          localStorage.setItem("usuario", JSON.stringify(updatedUser));
        } else if (sessionStorage.getItem("usuario")) {
          sessionStorage.setItem("usuario", JSON.stringify(updatedUser));
        }

        renderAllEducationCards(updatedUser);
        educationModal.style.display = "none";
        educationForm.reset();
        clearEducationForm();
      } catch (error) {
        console.error("Error al guardar los datos de educación:", error);
        Swal.fire(
          "Error",
          "Hubo un error al guardar los datos de educación.",
          "error"
        );
      }
    });
  }

  function clearEducationForm() {
    document.getElementById("institution").value = "";
    document.getElementById("degree").value = "";
    document.getElementById("discipline").value = "";
    document.getElementById("start-month").value = "";
    document.getElementById("start-year").value = "";
    document.getElementById("end-month").value = "";
    document.getElementById("end-year").value = "";
  }

  const closeModalButton = document.getElementById("closeEducationModal");
  if (closeModalButton) {
    closeModalButton.addEventListener("click", function () {
      clearEducationForm();
      educationModal.style.display = "none";
      educationModal.removeAttribute("data-edit-index");
    });
  }

  const openModalButton = document.getElementById("openEducationModal");
  if (openModalButton) {
    openModalButton.addEventListener("click", function () {
      educationModal.style.display = "block";
    });
  }

  fillYearSelectors();
});

// Evento para el modal de idiomas
document.addEventListener("DOMContentLoaded", function () {
  const languageModal = document.getElementById("languageModal");
  const languageForm = languageModal
    ? languageModal.querySelector("form")
    : null;

  if (languageForm) {
    languageForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const language = document.getElementById("languageValue").value;
      const level = document.getElementById("level").value;

      const editIndex = languageModal.getAttribute("data-edit-index");
      const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(sessionStorage.getItem("usuario"));

      if (editIndex !== null) {
        const index = parseInt(editIndex, 10);
        usuario.languages[index] = { language, level };
      } else {
        usuario.languages.push({ language, level });
      }

      try {
        const updatedUser = await updateUser({
          languages: usuario.languages,
        });

        // Guardar solo en el almacenamiento original
        if (localStorage.getItem("usuario")) {
          localStorage.setItem("usuario", JSON.stringify(updatedUser));
        } else if (sessionStorage.getItem("usuario")) {
          sessionStorage.setItem("usuario", JSON.stringify(updatedUser));
        }

        renderAllLanguageCards(updatedUser);
        languageModal.style.display = "none";
        languageForm.reset();
        clearLanguageForm();
      } catch (error) {
        console.error("Error al guardar los datos de idioma:", error);
        Swal.fire(
          "Error",
          "Hubo un error al guardar los datos de idioma.",
          "error"
        );
      }
    });
  }

  function clearLanguageForm() {
    document.getElementById("languageValue").value = "";
    document.getElementById("level").value = "";
  }

  const closeModalButton = document.getElementById("closeLanguageModal");
  if (closeModalButton) {
    closeModalButton.addEventListener("click", function () {
      clearLanguageForm();
      languageModal.style.display = "none";
      languageModal.removeAttribute("data-edit-index");
    });
  }

  const openModalButton = document.getElementById("openLanguageModal");
  if (openModalButton) {
    openModalButton.addEventListener("click", function () {
      languageModal.style.display = "block";
    });
  }
});

// Obtener referencias a los elementos del DOM
const institutionInput = document.getElementById("institution");
const suggestionsContainer = document.getElementById("suggestionsContainer");

// Función para obtener sugerencias de universidades
async function searchUniversities(query) {
  try {
    const response = await fetch(`${CONFIG.API_URL_UNIVERSITIES}`);
    if (!response.ok) {
      throw new Error("Error al cargar los datos de universidades");
    }

    const universities = await response.json();

    const filteredUniversities = universities.filter((uni) =>
      uni.name.toLowerCase().includes(query.toLowerCase())
    );

    console.log("Universidades encontradas:", filteredUniversities);
    return filteredUniversities;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Función para mostrar sugerencias en la lista tipo dropdown
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

// Evento para capturar la entrada del usuario
institutionInput.addEventListener("input", function () {
  const query = institutionInput.value.trim();
  if (query.length < 2) {
    suggestionsContainer.style.display = "none";
    return;
  }

  searchUniversities(query)
    .then((results) => showSuggestions(results))
    .catch((error) => console.error("Error:", error));
});

// Ocultar sugerencias al hacer clic fuera del contenedor
document.addEventListener("click", function (event) {
  if (!suggestionsContainer.contains(event.target)) {
    suggestionsContainer.style.display = "none";
  }
});
