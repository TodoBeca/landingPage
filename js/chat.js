document.addEventListener("DOMContentLoaded", () => {
  const chatIcon = document.getElementById("chat-icon");
  const chatContainer = document.getElementById("chat-container");
  const chatMessages = document.getElementById("chat-messages");
  let chatAbierto = false;

  chatIcon.addEventListener("click", () => {
    chatContainer.classList.toggle("visible");

    // Mostrar mensaje de bienvenida solo la primera vez que se abre
    if (!chatAbierto) {
      chatMessages.innerHTML += `
          <div class="message bot">
            <strong>TodoBeca:</strong> ¡Hola! Soy tu asistente virtual personal. ¿En qué puedo ayudarte hoy?
          </div>`;
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
    const response = await fetch(`${CONFIG.API_URL_CHAT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: mensaje }),
    });

    const data = await response.json();
    chatBox.innerHTML += `<div class="message bot"><strong>Bot:</strong> ${data.response}</div>`;
  } catch (error) {
    chatBox.innerHTML += `<div class="message bot"><strong>Error:</strong> No se pudo conectar con el asistente.</div>`;
    console.error("Error:", error);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
