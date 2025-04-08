AOS.init({
  duration: 800,
  easing: "slide",
  once: false,
});

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginFormOne");
  const loginButton = loginForm?.querySelector("button[type='submit']"); // Botón de login

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      // **Deshabilitar botón y mostrar loading**
      loginButton.disabled = true;
      loginButton.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> Iniciando sesión...';

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
            _id: userData._id,
            email: userData.email,
            emailVerified: userData.emailVerified,
            personalData: userData.personalData,
            academicData: userData.academicData,
            workData: userData.workData,
            hobbies: userData.hobbies,
            languages: userData.languages,
            socialMedia: userData.socialMedia,
            scholarshipProfile: userData.scholarshipProfile,
            role: userData.role,
          };

          const rememberMe = document.getElementById("rememberMe");
          if (rememberMe && rememberMe.checked) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(usuarioData));
          } else {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("usuario", JSON.stringify(usuarioData));
          }

          const referrer = document.referrer || "";
          if (referrer.includes("reset-password.html")) {
            window.location.href = "/index.html";
          } else if (referrer !== "") {
            window.location.href = referrer;
          } else {
            window.location.href = "/index.html";
          }
        } else if (response.status === 401) {
          // Mostrar modal de verificación
          const verificationModal = document.createElement("div");
          verificationModal.className = "modal fade";
          verificationModal.id = "verificationModal";
          verificationModal.style.zIndex = "1050";
          verificationModal.innerHTML = `
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Verificación de Email Requerida</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <p>Por favor, verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada y spam.</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" class="btn btn-primary" id="resendVerification">Reenviar Email de Verificación</button>
                </div>
              </div>
            </div>
          `;
          document.body.appendChild(verificationModal);

          const modal = new bootstrap.Modal(verificationModal);
          modal.show();

          // Agregar evento al botón de reenvío
          document
            .getElementById("resendVerification")
            .addEventListener("click", async () => {
              try {
                const response = await fetch(
                  CONFIG.API_URL_RESEND_VERIFICATION,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email }),
                  }
                );

                const data = await response.json();
                if (response.ok) {
                  alert("Email de verificación reenviado correctamente.");
                } else {
                  alert(
                    data.msg || "Error al reenviar el email de verificación."
                  );
                }
              } catch (error) {
                console.error("Error:", error);
                alert("Error al conectar con el servidor.");
              }
            });
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
      } finally {
        // **Restaurar botón después de la respuesta**
        loginButton.disabled = false;
        loginButton.innerHTML = "Iniciar Sesión";
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
