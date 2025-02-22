document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.querySelector("#profile-button");

  if (saveButton) {
    saveButton.addEventListener("click", async function (event) {
      event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

      const loadingSpinner = document.getElementById("loadingSpinner");

      // Mostrar el spinner y el mensaje
      if (loadingSpinner) {
        loadingSpinner.style.display = "block";
      }

      // Deshabilitar el botón para evitar múltiples clics
      saveButton.disabled = true;
      saveButton.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> Guardando cambios...';

      // Obtener el usuario actual desde localStorage o sessionStorage
      const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(sessionStorage.getItem("usuario"));

      if (!usuario || !usuario._id) {
        alert("Usuario no autenticado o ID no disponible");
        if (loadingSpinner) loadingSpinner.style.display = "none"; // Ocultar el spinner
        saveButton.disabled = false; // Habilitar el botón
        return;
      }

      // Capturar los datos del formulario
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
        academicData: window.getEducationData(), // Obtener los datos de educación desde modal.js
        languages: window.getlanguageData(), // Obtener los datos de idiomas desde modal.js
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

      try {
        // Construir la URL con el ID del usuario
        const userId = usuario._id; // Obtén el ID del usuario
        const url = `${CONFIG.API_URL_UPDATE_USER}/${userId}`; // Incluye el ID en la URL

        // Enviar los datos actualizados al backend
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.token}`, // Asegúrate de incluir el token si es necesario
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Captura el mensaje de error del backend
          throw new Error(
            errorData.message || "Error al actualizar el usuario"
          );
        }

        const updatedUser = await response.json();

        // Actualizar el usuario en localStorage o sessionStorage
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
        sessionStorage.setItem("usuario", JSON.stringify(updatedUser));

        alert("Perfil actualizado correctamente");

        // Recargar la página después de guardar los cambios
        window.location.reload();
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        alert(error.message || "Hubo un error al actualizar el perfil");
      } finally {
        // Ocultar el spinner y habilitar el botón
        if (loadingSpinner) loadingSpinner.style.display = "none";
        saveButton.disabled = false;
      }
    });
  }
});
