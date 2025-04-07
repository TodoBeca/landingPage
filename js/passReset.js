document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = this;
    const newPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const resetError = document.getElementById("resetError");
    const resetButton = form.querySelector("button[type='submit']");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // Validación inicial del token
    if (!token) {
      alert("Token inválido o expirado.");
      window.location.href = "/recover.html";
      return;
    }

    // Validación de contraseñas
    if (newPassword !== confirmPassword) {
      resetError.style.display = "block";
      return;
    } else {
      resetError.style.display = "none";
    }

    resetButton.disabled = true;
    resetButton.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Actualizando...';

    try {
      const response = await fetch(CONFIG.API_URL_POST_PASSRESET, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.msg);
        window.location.href = "/login.html";
      } else {
        alert(result.msg);
        resetButton.disabled = false;
        resetButton.innerHTML = "Actualizar contraseña";
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      alert("Error al restablecer la contraseña.");
      resetButton.disabled = false;
      resetButton.innerHTML = "Actualizar contraseña";
    }
  });
