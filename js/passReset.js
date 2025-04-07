document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const resetError = document.getElementById("resetError");
    const submitButton = form.querySelector("button[type='submit']");

    if (newPassword !== confirmPassword) {
      resetError.style.display = "block";
      return;
    } else {
      resetError.style.display = "none";
    }

    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Enviando...';

    const token = sessionStorage.getItem("resetToken");

    if (!token) {
      alert("Token no encontrado. Por favor volvé a iniciar el proceso.");
      return;
    }

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
        // Redirigir si querés:
        window.location.href = "/login.html";
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      alert("Error al restablecer la contraseña.");
    }
  });
