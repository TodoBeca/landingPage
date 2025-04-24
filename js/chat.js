document.addEventListener("DOMContentLoaded", () => {
  const chatIcon = document.getElementById("chat-icon");
  const chatContainer = document.getElementById("chat-container");
  const chatMessages = document.getElementById("chat-messages");
  let chatAbierto = false;

  chatIcon.addEventListener("click", () => {
    chatContainer.classList.toggle("visible");

    // Mostrar mensaje de bienvenida solo la primera vez que se abre
    if (!chatAbierto) {
      const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(sessionStorage.getItem("usuario"));

      if (usuario) {
        // Usuario logueado
        const nombre = usuario.personalData.firstName;
        chatMessages.innerHTML += `
          <div class="message bot">
            <strong>TodoBeca:</strong> ¡Hola ${nombre}! Me alegro de verte de nuevo. ¿En qué puedo ayudarte hoy? 
            Puedo buscar becas que se ajusten a tu perfil académico y personal.
          </div>`;
      } else {
        // Usuario no logueado
        chatMessages.innerHTML += `
          <div class="message bot">
            <strong>TodoBeca:</strong> ¡Hola! Soy tu asistente virtual personal. ¿En qué puedo ayudarte hoy?
            <br><br>
            <small>Para obtener recomendaciones personalizadas de becas, te sugiero <a href="/login.html">iniciar sesión</a> o <a href="/register.html">crear una cuenta</a>.</small>
          </div>`;
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatAbierto = true;
    }
  });

  // Enviar con Enter
  const input = document.getElementById("userMessage");
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      enviarMensaje();
    }
  });
});

async function enviarMensaje() {
  const input = document.getElementById("userMessage");
  const chatBox = document.getElementById("chat-messages");
  const mensaje = input.value.trim();

  if (!mensaje) return;

  chatBox.innerHTML += `<div class="message user"><strong>Vos:</strong> ${mensaje}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const usuario =
      JSON.parse(localStorage.getItem("usuario")) ||
      JSON.parse(sessionStorage.getItem("usuario"));
    const requestBody = {
      message: mensaje,
      userData: usuario
        ? {
            academicData: usuario.academicData,
            personalData: usuario.personalData,
            languages: usuario.languages,
          }
        : null,
    };

    const response = await fetch(`${CONFIG.API_URL_CHAT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    chatBox.innerHTML += `<div class="message bot"><strong>TodoBeca:</strong> ${data.response}</div>`;
  } catch (error) {
    chatBox.innerHTML += `<div class="message bot"><strong>Error:</strong> No se pudo conectar con el asistente.</div>`;
    console.error("Error:", error);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
