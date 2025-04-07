document
  .getElementById("simpleRegisterForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = this;
    const email = document.getElementById("email").value;
    const confirmEmail = document.getElementById("confirmEmail").value;
    const emailError = document.getElementById("emailError");
    const submitButton = form.querySelector("button[type='submit']");

    if (email !== confirmEmail) {
      emailError.style.display = "block";
      return;
    } else {
      emailError.style.display = "none";
    }

    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Enviando...';

    try {
      const response = await fetch(CONFIG.API_URL_POST_PASSRECOVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.msg); // o mostrar mensaje en el DOM
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al enviar el email de recuperación");
    }
  });
