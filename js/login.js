AOS.init({
  duration: 800,
  easing: "slide",
  once: false,
});

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginFormOne");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      try {
        // Enviar solicitud de inicio de sesión
        const response = await fetch(CONFIG.API_URL_POST_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
            userPassword: password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Obtener datos del usuario desde la API
          const userData = await obtenerUsuarioPorEmail(email);

          if (!userData) {
            alert("Error al obtener la información del usuario.");
            return;
          }

          // Guardar los datos en localStorage o sessionStorage
          const usuarioData = {
            id: userData._id,
            email: userData.email,
            emailVerified: userData.emailVerified,
            role: userData.role,
            personalData: userData.personalData,
            scholarshipProfile: userData.scholarshipProfile,
            languages: userData.languages,
          };

          const rememberMe = document.getElementById("rememberMe");
          if (rememberMe && rememberMe.checked) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(usuarioData));
          } else {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("usuario", JSON.stringify(usuarioData));
          }

          // Redirigir a la página anterior o a index si no hay referencia
          const paginaAnterior =
            document.referrer && document.referrer !== window.location.href
              ? document.referrer
              : "/index.html";

          window.location.href = paginaAnterior;
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
      }
    });
  }
});

/**
 * Función para obtener los datos del usuario desde el backend.
 * @param {string} email - Email del usuario
 * @returns {Object|null} - Datos del usuario o null en caso de error
 */
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
