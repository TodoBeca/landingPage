const usuario =
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(sessionStorage.getItem("usuario"));

if (usuario) {
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
        console.error("Error al obtener el usuario:", response.statusText);
        return null;
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error al conectar con la API de usuario:", error);
      return null;
    }
  }

  // Obtener el usuario por email
  obtenerUsuarioPorEmail(usuario.email).then((userData) => {
    if (userData) {
      // Rellenar los campos del formulario con los datos del usuario
      document.querySelector('input[name="personalData.firstName"]').value =
        userData.personalData.firstName || "";
      document.querySelector('input[name="personalData.lastName"]').value =
        userData.personalData.lastName || "";
      document.querySelector('input[name="personalData.birthDate"]').value =
        userData.personalData.birthDate
          ? new Date(userData.personalData.birthDate)
              .toISOString()
              .split("T")[0]
          : "";
      document.querySelector('input[name="personalData.gender"]').value =
        userData.personalData.gender || "";
      document.querySelector('input[name="personalData.phone"]').value =
        userData.personalData.phone || "";
      document.querySelector('input[name="personalData.currentCity"]').value =
        userData.personalData.currentCity || "";
      document.querySelector('input[name="personalData.nationality"]').value =
        userData.personalData.nationality || "";
      document.querySelector(
        'input[name="personalData.additionalCitizenship"]'
      ).value = userData.personalData.additionalCitizenship || "";

      // Rellenar los campos de educación (si existen)
      const educacionDiv = document.getElementById("educacion");
      if (userData.academicData && userData.academicData.length > 0) {
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
    }
  });
}
