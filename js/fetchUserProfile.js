document.addEventListener("DOMContentLoaded", async function () {
  const usuario =
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario || !usuario.email) {
    console.error("Usuario no autenticado o email no disponible.");
    return;
  }

  async function obtenerUsuarioPorEmail(email) {
    try {
      const response = await fetch(
        `${CONFIG.API_URL_GET_USER}?userEmail=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener el usuario: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al conectar con la API de usuario:", error);
      return null;
    }
  }

  try {
    const userData = await obtenerUsuarioPorEmail(usuario.email);

    if (!userData) {
      console.error("No se encontraron datos del usuario.");
      return;
    }

    // Actualizar el perfil del usuario
    const userFullNameElement = document.getElementById("userFullName");
    const userEmailElement = document.getElementById("userEmail");

    if (userFullNameElement && userEmailElement) {
      // Concatenar el nombre y el apellido
      const fullName = `${userData.personalData.firstName} ${userData.personalData.lastName}`;
      userFullNameElement.textContent = fullName; // Actualizar el nombre completo
      userEmailElement.textContent = userData.email; // Actualizar el correo electrónico
    } else {
      console.error(
        "No se encontraron los elementos para actualizar el perfil."
      );
    }

    // Rellenar los campos del formulario con los datos del usuario
    const fields = {
      firstName: document.querySelector('input[name="personalData.firstName"]'),
      lastName: document.querySelector('input[name="personalData.lastName"]'),
      birthDate: document.querySelector('input[name="personalData.birthDate"]'),
      gender: document.querySelector('select[name="personalData.gender"]'),
      phone: document.querySelector('input[name="personalData.phone"]'),
      currentCity: document.querySelector(
        'input[name="personalData.currentCity"]'
      ),
      nationality: document.querySelector(
        'input[name="personalData.nationality"]'
      ),
      additionalCitizenship: document.querySelector(
        'input[name="personalData.additionalCitizenship"]'
      ),
    };

    // Asignar valores a los campos
    if (fields.firstName)
      fields.firstName.value = userData.personalData.firstName || "";
    if (fields.lastName)
      fields.lastName.value = userData.personalData.lastName || "";
    if (fields.birthDate) {
      fields.birthDate.value = userData.personalData.birthDate
        ? new Date(userData.personalData.birthDate).toISOString().split("T")[0]
        : "";
    }
    if (fields.gender) fields.gender.value = userData.personalData.gender || "";
    if (fields.phone) fields.phone.value = userData.personalData.phone || "";
    if (fields.currentCity)
      fields.currentCity.value = userData.personalData.currentCity || "";
    if (fields.nationality)
      fields.nationality.value = userData.personalData.nationality || "";
    if (fields.additionalCitizenship) {
      fields.additionalCitizenship.value =
        userData.personalData.additionalCitizenship || "";
    }

    // Rellenar los campos de educación (si existen)
    const educacionDiv = document.getElementById("educacion");
    if (educacionDiv) {
      educacionDiv.innerHTML = ""; // Limpiar el contenedor antes de renderizar las tarjetas nuevas

      if (userData.academicData && userData.academicData.length > 0) {
        userData.academicData.forEach((academicRecord, index) => {
          // Formatear las fechas (si es necesario)
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

          // Crear la tarjeta de educación
          const academicHTML = `
      <div class="card mt-2">
        <div class="card-body">
        
        <div class="row align-items-center justify-content-between px-2">
        <div>
          <h5 class="text-primary">${
            academicRecord.institution || "Institución no especificada"
          }</h5>
          <span class="text-secunday">
             Título de <strong>${
               academicRecord.degree || "Disciplina no especificada"
             }</strong> en <strong>${
            academicRecord.discipline || "Disciplina no especificada"
          }</strong><br>
            ${startDateFormatted} - ${endDateFormatted}<br>
          </span></div>
          <div class="">
            <span class="icon-edit" onclick="editEducation(${index})"></span>
            <span class="icon-delete" onclick="deleteEducation(${index})"></span>
          </div></div>
        </div>
      </div>
      `;

          // Insertar la tarjeta en el contenedor
          educacionDiv.insertAdjacentHTML("beforeend", academicHTML);
        });
      }
    }

    // Rellenar los campos de idiomas (si existen)

    const idiomaMap = {
      es: "Español",
      zh: "Chino Mandarín",
      en: "Inglés",
      hi: "Hindi",
      bn: "Bengalí",
      pt: "Portugués",
      ru: "Ruso",
      ja: "Japonés",
      de: "Alemán",
      fr: "Francés",
      it: "Italiano",
      tr: "Turco",
      ar: "Árabe",
      ur: "Urdu",
      pa: "Panyabí",
      nl: "Neerlandés",
      ko: "Coreano",
      vi: "Vietnamita",
      ta: "Tamil",
      fa: "Persa (Farsi)",
    };

    const languageDiv = document.getElementById("language");

    if (languageDiv) {
      languageDiv.innerHTML = ""; // Limpiar el contenedor antes de renderizar las tarjetas nuevas

      if (userData.languages && userData.languages.length > 0) {
        userData.languages.forEach((languageRecord) => {
          // Obtener el nombre del idioma en español
          const languageName =
            idiomaMap[languageRecord.language] ||
            languageRecord.language ||
            "Idioma no especificado";

          // Crear la tarjeta de idioma
          const languageHTML = `
            <div class="card mt-2">
              <div class="card-body row align-items-center">
                <h5 class="text-primary m-0 ml-2">${languageName}</h5>
                <span class="text-secondary">
                  &nbsp;- (${languageRecord.level || "Nivel no especificado"})
                </span>
              </div>
            </div>
          `;

          // Agregar la tarjeta al contenedor
          languageDiv.insertAdjacentHTML("beforeend", languageHTML);
        });
      }
    }
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
    alert("Hubo un error al cargar los datos del usuario.");
  }
});
