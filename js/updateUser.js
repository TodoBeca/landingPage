document
  .querySelector(".profile-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtener el usuario actual desde localStorage o sessionStorage
    const usuario =
      JSON.parse(localStorage.getItem("usuario")) ||
      JSON.parse(sessionStorage.getItem("usuario"));

    if (!usuario || !usuario._id) {
      alert("Usuario no autenticado o ID no disponible");
      return;
    }

    // Capturar los datos del formulario
    const updatedData = {
      personalData: {
        firstName: document.querySelector(
          'input[name="personalData.firstName"]'
        ).value,
        lastName: document.querySelector('input[name="personalData.lastName"]')
          .value,
        birthDate: document.querySelector(
          'input[name="personalData.birthDate"]'
        ).value,
        gender: document.querySelector('input[name="personalData.gender"]')
          .value,
        phone: document.querySelector('input[name="personalData.phone"]').value,
        currentCity: document.querySelector(
          'input[name="personalData.currentCity"]'
        ).value,
        nationality: document.querySelector(
          'input[name="personalData.nationality"]'
        ).value,
        additionalCitizenship: document.querySelector(
          'input[name="personalData.additionalCitizenship"]'
        ).value,
      },
      academicData: [], // Inicializar como array vacío
    };

    // Capturar los datos de educación (academicData)
    const academicRecords = document.querySelectorAll(
      'input[name^="academicData"]'
    );
    for (let i = 0; i < academicRecords.length; i += 5) {
      const academicRecord = {
        institution: academicRecords[i].value,
        degree: academicRecords[i + 1].value,
        discipline: academicRecords[i + 2].value,
        startDate: academicRecords[i + 3].value,
        endDate: academicRecords[i + 4].value,
        gpa: academicRecords[i + 5]?.value || null,
      };
      updatedData.academicData.push(academicRecord);
    }

    try {
      // Construir la URL con el ID del usuario
      const userId = usuario._id; // Obtén el ID del usuario
      const url = `${CONFIG.API_URL_UPDATE_USER}/${userId}`; // Incluye el ID en la URL

      // Enviar los datos actualizados al backend
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      const updatedUser = await response.json();

      // Actualizar el usuario en localStorage o sessionStorage
      localStorage.setItem("usuario", JSON.stringify(updatedUser));
      sessionStorage.setItem("usuario", JSON.stringify(updatedUser));

      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un error al actualizar el perfil");
    }
  });
