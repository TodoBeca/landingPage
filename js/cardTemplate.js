const isLoggedIn = estaLogueado();

function obtenerDescripcionDificultad(dificultad) {
  if (!dificultad) return "No especificado";

  const niveles = {
    1: { texto: "Muy baja", iconos: "🟢" },
    2: { texto: "Baja", iconos: "🟢🟢" },
    3: { texto: "Media", iconos: "🟡🟡🟡" },
    4: { texto: "Alta", iconos: "🔴🔴🔴🔴" },
    5: { texto: "Muy alta", iconos: "🔴🔴🔴🔴🔴" },
  };

  return niveles[dificultad] || { texto: "No especificado", iconos: "" };
}

const cardBeca = (beca, ReqMeet) => {
  const dificultadInfo = obtenerDescripcionDificultad(beca.dificultad);

  return `
<a href="templateBeca.html?id=${
    beca._id
  }" class="d-block text-decoration-none text-dark">
  <div class="cardBeca">
    <div class="card-inner">
      <div class="card-front">
        <div class="card-content">
          <div class="cardBeca-image" style="background-image: url('${
            beca.imagen || "./images/becaAlemania.jpg"
          }');"></div>
          <div class="row justify-content-between align-items-end px-3">
            <span class="cardBeca-badge">Deadline: ${
              formatearFecha(beca.fechaFinAplicacion) || "No disponible"
            }</span>
            ${
              beca.destacada ? '<span class="cardBeca-destacada">⭐</span>' : ""
            }
          </div>
          <p class="card-country text-secondary font-weight-bold m-0 mt-2">${
            beca.paisDestino
          } - ${beca.regionDestino}</p>
          <h6 class="card-title text-primary m-0 mt-2">${beca.nombreBeca}</h6>
          <p class="card-type text-secondary m-0 mt-2 font-weight-bold">${
            beca.tipoBeca || "No especificado"
          }</p>
          <p class="card-difficulty m-0 mt-2"><span class="difficulty-icons">${
            dificultadInfo.iconos
          }</span>
                <span class="difficulty-text">Competencia ${
                  dificultadInfo.texto
                }</span></p>
        </div>
      </div>
      <div class="card-back">
        <div class="card-content">
          ${
            isLoggedIn
              ? ReqMeet
                ? `<div style="display: flex; align-items: center;">
                      <p class="text-success mt-2">Cumple con los requisitos</p>
                     </div>`
                : `<div style="display: flex; align-items: center;">
                      <p class="text-danger mt-2">No cumple con los requisitos</p>
                     </div>`
              : `<p class="card-info font-weight-light text-primary m-0">
                  Para saber si cumplís con los requisitos, 
                  <a class="font-weight-bold" href="login.html">inicia sesión.</a>
                 </p>`
          }
        </div>
      </div>
    </div>
  </div>
</a>
`;
};
