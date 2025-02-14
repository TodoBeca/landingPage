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

    console.log("Elemento del nombre completo:", userFullNameElement);
    console.log("Elemento del correo electrónico:", userEmailElement);

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
    if (
      educacionDiv &&
      userData.academicData &&
      userData.academicData.length > 0
    ) {
      userData.academicData.forEach((academicRecord, index) => {
        const academicHTML = `
          <div class="row mt-3">
            <div class="col-md-6">
              <label class="labels">Institución</label>
              <input
                type="text"
                class="form-control"
                placeholder="Institución"
                name="academicData[${index}].institution"
                value="${academicRecord.institution || ""}"
              />
            </div>
            <div class="col-md-6">
              <label class="labels">Título</label>
              <input
                type="text"
                class="form-control"
                placeholder="Título"
                name="academicData[${index}].degree"
                value="${academicRecord.degree || ""}"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-6">
              <label class="labels">Disciplina</label>
              <input
                type="text"
                class="form-control"
                placeholder="Disciplina"
                name="academicData[${index}].discipline"
                value="${academicRecord.discipline || ""}"
              />
            </div>
            <div class="col-md-6">
              <label class="labels">Fecha de Inicio</label>
              <input
                type="date"
                class="form-control"
                name="academicData[${index}].startDate"
                value="${
                  academicRecord.startDate
                    ? new Date(academicRecord.startDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-6">
              <label class="labels">Fecha de Fin</label>
              <input
                type="date"
                class="form-control"
                name="academicData[${index}].endDate"
                value="${
                  academicRecord.endDate
                    ? new Date(academicRecord.endDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }"
              />
            </div>
            <div class="col-md-6">
              <label class="labels">Promedio</label>
              <input
                type="number"
                class="form-control"
                placeholder="Promedio"
                name="academicData[${index}].gpa"
                value="${academicRecord.gpa || ""}"
              />
            </div>
          </div>
          <hr class="filter-divider w-100" />
        `;
        educacionDiv.insertAdjacentHTML("beforeend", academicHTML);
      });
    }
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
    alert("Hubo un error al cargar los datos del usuario.");
  }
});
