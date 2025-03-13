let becas = [];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".dropdown-menu").forEach((item) => {
  item.addEventListener("click", function () {
    setTimeout(scrollToTop, 700);
  });
});

document.querySelectorAll(".switch").forEach((item) => {
  item.addEventListener("click", function () {
    setTimeout(scrollToTop, 700);
  });
});

document.querySelectorAll(".PB-range-slider-container").forEach((item) => {
  item.addEventListener("click", function () {
    setTimeout(scrollToTop, 700);
  });
});

function estaLogueado() {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token") !== null
  );
}

const usuario =
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(sessionStorage.getItem("usuario"));

function aplicarFiltroDesdeSessionStorage() {
  const paisSeleccionado = sessionStorage.getItem("paisSeleccionado");

  if (paisSeleccionado) {
    console.log(`Aplicando filtro por país: ${paisSeleccionado}`);

    agregarBadge(
      paisSeleccionado,
      document.getElementById("selected-paises"),
      "pais"
    );

    sessionStorage.removeItem("paisSeleccionado");

    filtrarBecas();
  }
}

function calcularDuracion(duracion) {
  const unidad = duracion.duracionUnidad || "años";
  const mesesPorAnio = 12;

  const convertirAMeses = (valor, unidad) => {
    if (unidad.toLowerCase().includes("año")) {
      return valor * mesesPorAnio;
    } else if (unidad.toLowerCase().includes("mes")) {
      return valor;
    } else {
      return valor;
    }
  };

  if (duracion.duracionMinima && duracion.duracionMaxima) {
    const minMeses = convertirAMeses(duracion.duracionMinima, unidad);
    const maxMeses = convertirAMeses(duracion.duracionMaxima, unidad);
    return `${minMeses} a ${maxMeses} meses`;
  } else if (duracion.duracionMinima) {
    const minMeses = convertirAMeses(duracion.duracionMinima, unidad);
    return `${minMeses} meses`;
  } else if (duracion.duracionMaxima) {
    const maxMeses = convertirAMeses(duracion.duracionMaxima, unidad);
    return `${maxMeses} meses`;
  } else {
    return "duracion no disponible";
  }
}

function formatearFecha(fecha) {
  if (!fecha) return "Fecha no disponible";

  const [anio, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${anio}`;
}

function calcularInscripcion(fechaInicioAplicacion, fechaFinAplicacion) {
  if (fechaInicioAplicacion && fechaFinAplicacion === "Todo el año") {
    return "Todo el año";
  } else if (fechaInicioAplicacion && fechaFinAplicacion) {
    return `Del ${formatearFecha(fechaInicioAplicacion)} al ${formatearFecha(
      fechaFinAplicacion
    )}`;
  } else if (fechaInicioAplicacion) {
    return `Inicio: ${formatearFecha(fechaInicioAplicacion)}`;
  } else if (fechaFinAplicacion) {
    return `Hasta el ${formatearFecha(fechaFinAplicacion)}`;
  } else {
    return "Inscripción no disponible";
  }
}

function agregarBadge(text, container, type) {
  if (document.querySelector(`[data-${type}="${text}"]`)) return;

  const badge = document.createElement("span");
  badge.classList.add("badge-item");
  badge.setAttribute(`data-${type}`, text);
  badge.innerHTML = `
    ${text} 
    <button class="delete-btn">&times;</button>
  `;

  badge.querySelector(".delete-btn").addEventListener("click", function () {
    badge.remove();
    filtrarBecas();
  });

  container.appendChild(badge);
  filtrarBecas();
}

function mostrarBecasFiltradas(filteredBecas) {
  const container = document.getElementById("becas-container");
  container.innerHTML = "";

  if (filteredBecas.length === 0) {
    container.innerHTML =
      "<p>No se encontraron becas con los filtros aplicados.</p>";
    return;
  }

  filteredBecas.forEach((beca) => {
    const card = document.createElement("div");

    const duracionCalculada = calcularDuracion(beca.duracion);
    const inscripciones = calcularInscripcion(
      beca.fechaInicioAplicacion,
      beca.fechaFinAplicacion
    );

    const ReqMeet = usuario ? cumpleRequisitos(usuario, beca) : null;

    card.classList.add(
      "course",
      "bg-white",
      "h-100",
      "align-self-stretch",
      "mb-4",
      "w-100",
      "rounded",
      "ml-2"
    );

    card.innerHTML = `
  <a href="templateBeca.html?id=${
    beca._id
  }" class="d-block text-decoration-none text-dark">
    <div class="course-inner-text py-4 px-4">
      <span class="course-price mt-4"><strong>Destino: </strong>${
        beca.paisDestino || "Sin país"
      } - ${beca.regionDestino}</span>
      <h3 class="text-primary font-weight-bold">${beca.nombreBeca}</h3>
      <h6>${beca.entidadBecaria}</h6>

    <div class="meta">
      <h6 class="font-weight-bold">Características</h6>
      <div class="d-flex flex-wrap align-items-center">
        <span class="icon-flag"></span>Países Postulantes: ${
          Array.isArray(beca.paisPostulante) && beca.paisPostulante.length > 0
            ? beca.paisPostulante.join(", ")
            : "No especificado"
        } 
        &nbsp;
        <span>-</span>
        <span class="icon-book"></span>Área de estudio: ${
          beca.areaEstudio || "No especificado"
        }
        &nbsp;
        <span>-</span>
        <span class="icon-certificate"></span>Tipo de Beca: ${beca.tipoBeca}
        &nbsp;
        <span>-</span>
        <div>
          <span class="icon-calendar"></span>Inscripciones: ${inscripciones}</div>
      </div>
    </div>
    <div class="leyenda-card">
      <p class="text-danger">
        Para acceder a más información, por favor, inicie
        sesión
      </p>
    </div>
    <div class="adicionales">
      <div class="meta" >
        <h6 class="font-weight-bold">Detalles Adicionales</h6>
        <div id="detalles-adicionales">
          <span class="icon-clock-o"></span>Duración: ${duracionCalculada} 
          &nbsp;
          <span>-</span>
          <span class="icon-users"></span>Cant. Cupos: ${
            beca.cantCupos || "Cupos no disponibles"
          }
        </div>
      </div>

      <div class="meta">
        <h6 class="font-weight-bold">Requisitos</h6>
        <span class="icon-book"></span>Nivel Académico: ${
          beca.requisitos.nivelAcademicoMin || "No especificado"
        }
        &nbsp;
        <span>-</span>
        <span class="icon-comment"></span>Idioma Requerido: ${
          beca.requisitos.idiomasRequeridos
            ? beca.requisitos.idiomasRequeridos
                .map((idioma) => `${idioma.idioma} (${idioma.nivelIdioma})`)
                .join(", ")
            : "No especificado"
        }
        &nbsp;
        <span>-</span>
        <span class="icon-user"></span>Edad Máxima: ${
          beca.requisitos.edadMax || "No especificado"
        } años
        &nbsp;
        <span>-</span>
        <span class="icon-bar-chart"></span> Promedio Min.: ${
          beca.requisitos.promedioMin || "No especificado"
        }

        <div>
          ${
            ReqMeet
              ? `<div style="display: flex; align-items: center;"><span class="icon-check"></span><span style="color: green;">Cumple con los requisitos</span></div>`
              : `<div style="display: flex; align-items: center;"><span class="icon-times"></span><span style="color: red;">No cumple con los requisitos</span></div>`
          }
        </div>
      </div>
     </div> 
    </div>
  </a>
`;

    container.appendChild(card);

    const adicionalesDivs = card.querySelectorAll(".adicionales");
    const leyendaCard = card.querySelectorAll(".leyenda-card");

    if (estaLogueado()) {
      adicionalesDivs.forEach((div) => {
        div.classList.remove("fuera-de-foco");
        div.classList.add("normal");
      });
      leyendaCard.forEach((leyenda) => {
        leyenda.style.display = "none";
      });
    } else {
      adicionalesDivs.forEach((div) => {
        div.classList.remove("normal");
        div.classList.add("fuera-de-foco");
      });
      leyendaCard.forEach((leyenda) => {
        leyenda.style.display = "block";
      });
    }
  });
}

function actualizarDropdownPaises(paises) {
  const dropdownPaises = document.getElementById("dropdownPaises");
  dropdownPaises.innerHTML = "";

  if (paises.length === 0) {
    dropdownPaises.innerHTML =
      "<p class='dropdown-item'>No hay países disponibles</p>";
    return;
  }

  paises.forEach((pais) => {
    const dropdownItem = document.createElement("a");
    dropdownItem.classList.add("dropdown-item");
    dropdownItem.href = "#";
    dropdownItem.textContent = pais;

    dropdownItem.addEventListener("click", function (e) {
      e.preventDefault();
      agregarBadge(pais, document.getElementById("selected-paises"), "pais");
    });

    dropdownPaises.appendChild(dropdownItem);
  });
}

function filtrarBecas() {
  const paisSeleccionado = sessionStorage.getItem("paisSeleccionado");

  if (paisSeleccionado) {
    agregarBadge(
      paisSeleccionado,
      document.getElementById("selected-paises"),
      "pais"
    );
    sessionStorage.removeItem("paisSeleccionado");
  }

  const selectedRegion = Array.from(
    document.querySelectorAll("#selected-region .badge-item")
  ).map((badge) => badge.getAttribute("data-region"));

  const selectedPaises = Array.from(
    document.querySelectorAll("#selected-paises .badge-item")
  ).map((badge) => badge.getAttribute("data-pais"));

  const selectedIdiomas = Array.from(
    document.querySelectorAll("#selected-idiomas .badge-item")
  ).map((badge) => badge.getAttribute("data-idioma"));

  const selectedNacPostulante = Array.from(
    document.querySelectorAll("#selected-nacPostulante .badge-item")
  ).map((badge) => badge.getAttribute("data-nacionalidad"));

  const selectedArea = Array.from(
    document.querySelectorAll("#selected-area .badge-item")
  ).map((badge) => badge.getAttribute("data-area"));

  const selectedTiposBeca = Array.from(
    document.querySelectorAll("#selected-tipo-beca .badge-item")
  ).map((badge) => badge.getAttribute("data-tipo-beca"));

  const edadValue = parseInt(document.getElementById("rEdad").value);
  const duracionValue = parseInt(document.getElementById("rDuracion").value);

  const filtroFecha = document.getElementById("filtroFecha").value;

  const filtroCumpleRequisitos = document.getElementById(
    "filtroCumpleRequisitos"
  ).checked;

  const paisesDisponibles = new Set();
  becas.forEach((beca) => {
    if (
      selectedRegion.length === 0 ||
      selectedRegion.includes(beca.regionDestino)
    ) {
      paisesDisponibles.add(beca.paisDestino);
    }
  });

  actualizarDropdownPaises([...paisesDisponibles]);

  const filteredBecas = becas.filter((beca) => {
    if (
      selectedIdiomas.length > 0 &&
      !selectedIdiomas.some((idioma) =>
        beca.requisitos.idiomasRequeridos.some((req) => req.idioma === idioma)
      )
    ) {
      return false;
    }

    if (
      selectedRegion.length > 0 &&
      !selectedRegion.includes(beca.regionDestino)
    ) {
      return false;
    }

    if (
      selectedPaises.length > 0 &&
      !selectedPaises.includes(beca.paisDestino)
    ) {
      return false;
    }

    if (
      selectedNacPostulante.length > 0 &&
      !selectedNacPostulante.some((nac) =>
        Array.isArray(beca.paisPostulante)
          ? beca.paisPostulante.includes(nac)
          : beca.paisPostulante === nac
      )
    ) {
      return false;
    }

    if (selectedArea.length > 0 && !selectedArea.includes(beca.areaEstudio)) {
      return false;
    }

    if (
      selectedTiposBeca.length > 0 &&
      !selectedTiposBeca.includes(beca.tipoBeca)
    ) {
      return false;
    }

    if (filtroFecha) {
      const fechaInicio = beca.fechaInicioAplicacion
        ? new Date(beca.fechaInicioAplicacion).toISOString().split("T")[0]
        : null;
      const fechaFin = beca.fechaFinAplicacion
        ? new Date(beca.fechaFinAplicacion).toISOString().split("T")[0]
        : null;

      if (!fechaInicio || !fechaFin) return false;

      const fechaFiltro = new Date(filtroFecha).toISOString().split("T")[0];

      if (fechaFiltro < fechaInicio || fechaFiltro > fechaFin) {
        return false;
      }
    }

    if (beca.requisitos?.edadMax && beca.requisitos.edadMax > edadValue) {
      return false;
    }

    if (beca.duracion?.duracionMaxima) {
      const duracionMaxBeca = beca.duracion.duracionUnidad
        ?.toLowerCase()
        .includes("año")
        ? beca.duracion.duracionMaxima * 12
        : beca.duracion.duracionMaxima;

      if (duracionMaxBeca > duracionValue) {
        return false;
      }
    }

    if (filtroCumpleRequisitos && usuario) {
      if (!cumpleRequisitos(usuario, beca)) {
        return false;
      }
    }

    return true;
  });

  mostrarBecasFiltradas(filteredBecas);
}

async function fetchBecas() {
  try {
    const response = await fetch(CONFIG.API_URL_GET_BECAS);

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const rawBecas = await response.json();

    const fechaActual = new Date().toISOString().split("T")[0];

    becas = rawBecas.filter((beca) => {
      const fechaFinInscripcion = beca.fechaFinAplicacion
        ? new Date(beca.fechaFinAplicacion).toISOString().split("T")[0]
        : null;

      if (!fechaFinInscripcion) return true;

      return fechaFinInscripcion >= fechaActual;
    });

    window.becas = becas;

    const container = document.getElementById("becas-container");
    const dropdownIdiomas = document.getElementById("dropdownIdiomas");
    const selectedIdiomasContainer =
      document.getElementById("selected-idiomas");
    const dropdownRegion = document.getElementById("dropdownRegion");
    const selectedRegionContainer = document.getElementById("selected-region");
    const dropdownPaises = document.getElementById("dropdownPaises");
    const selectedPaisesContainer = document.getElementById("selected-paises");
    const dropdownNacPostulante = document.getElementById(
      "dropdownNacPostulante"
    );
    const selectedNacPostulanteContainer = document.getElementById(
      "selected-nacPostulante"
    );
    const dropdownArea = document.getElementById("dropdownArea");
    const selectedAreaContainer = document.getElementById("selected-area");

    const dropdownTipoBeca = document.getElementById("dropdownTipoBeca");
    const selectedTipoBecaContainer =
      document.getElementById("selected-tipo-beca");

    container.innerHTML = "";
    dropdownIdiomas.innerHTML = "";
    selectedIdiomasContainer.innerHTML = "";
    dropdownRegion.innerHTML = "";
    selectedRegionContainer.innerHTML = "";
    dropdownPaises.innerHTML = "";
    selectedPaisesContainer.innerHTML = "";
    dropdownNacPostulante.innerHTML = "";
    selectedNacPostulanteContainer.innerHTML = "";
    dropdownArea.innerHTML = "";
    selectedAreaContainer.innerHTML = "";
    dropdownTipoBeca.innerHTML = "";
    selectedTipoBecaContainer.innerHTML = "";

    if (becas.length === 0) {
      container.innerHTML = "<p>No se encontraron becas.</p>";
      return;
    }

    const idiomas = [
      ...new Set(
        becas
          .flatMap((beca) =>
            beca.requisitos.idiomasRequeridos.map((req) => req.idioma)
          )
          .filter(Boolean)
      ),
    ];

    const regiones = [
      ...new Set(becas.map((beca) => beca.regionDestino).filter(Boolean)),
    ];

    const paises = [
      ...new Set(becas.map((beca) => beca.paisDestino).filter(Boolean)),
    ];

    const nacionalidades = [
      ...new Set(
        becas
          .flatMap((beca) =>
            Array.isArray(beca.paisPostulante)
              ? beca.paisPostulante
              : [beca.paisPostulante]
          )
          .filter(Boolean)
      ),
    ];

    const Areas = [
      ...new Set(becas.map((beca) => beca.areaEstudio).filter(Boolean)),
    ];

    const tiposBeca = [
      ...new Set(becas.map((beca) => beca.tipoBeca).filter(Boolean)),
    ];

    idiomas.forEach((idioma) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent = idioma;

      dropdownItem.addEventListener("click", function (e) {
        e.preventDefault();
        agregarBadge(idioma, selectedIdiomasContainer, "idioma");
      });

      dropdownIdiomas.appendChild(dropdownItem);
    });

    regiones.forEach((region) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent = region;

      dropdownItem.addEventListener("click", function (e) {
        e.preventDefault();
        agregarBadge(region, selectedRegionContainer, "region");
      });

      dropdownRegion.appendChild(dropdownItem);
    });

    paises.forEach((pais) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent = pais;

      dropdownItem.addEventListener("click", function (e) {
        e.preventDefault();
        agregarBadge(pais, selectedPaisesContainer, "pais");
      });

      dropdownPaises.appendChild(dropdownItem);
    });

    nacionalidades.forEach((nacionalidad) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent = nacionalidad;

      dropdownItem.addEventListener("click", function (e) {
        e.preventDefault();
        agregarBadge(
          nacionalidad,
          selectedNacPostulanteContainer,
          "nacionalidad"
        );
      });

      dropdownNacPostulante.appendChild(dropdownItem);
    });

    Areas.forEach((area) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent = area;

      dropdownItem.addEventListener("click", function (e) {
        e.preventDefault();
        agregarBadge(area, selectedAreaContainer, "area");
      });

      dropdownArea.appendChild(dropdownItem);
    });

    tiposBeca.forEach((tipo) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent = tipo;

      dropdownItem.addEventListener("click", function (e) {
        e.preventDefault();
        agregarBadge(tipo, selectedTipoBecaContainer, "tipo-beca");
      });

      dropdownTipoBeca.appendChild(dropdownItem);
    });

    const configSliders = [
      { id: "rEdad", prop: "requisitos.edadMax", default: 100 },
      {
        id: "rDuracion",
        prop: "duracion.duracionMaxima",
        default: 10,
        toMonths: true,
      },
    ];

    configSliders.forEach(({ id, prop, default: defaultValue, toMonths }) => {
      const slider = document.getElementById(id);
      const range = document.getElementById(
        `range${id.charAt(1).toUpperCase() + id.slice(2)}`
      );

      const values = becas
        .map((beca) => {
          let value = eval(`beca.${prop}`);
          return value !== null && value !== undefined ? value : null;
        })
        .filter((v) => v !== null)
        .map((v) => (toMonths ? v * 12 : v));

      const minValue = values.length > 0 ? Math.min(...values) : 0;
      const maxValue =
        values.length > 0
          ? Math.max(...values)
          : defaultValue * (toMonths ? 12 : 1);

      if (slider && range) {
        slider.min = minValue;
        slider.max = maxValue;
        slider.value = maxValue;
        range.textContent = `${maxValue} `;

        slider.oninput = function () {
          range.textContent = `${this.value}`;
          filtrarBecas();
        };
      }
    });

    mostrarBecasFiltradas(becas);

    aplicarFiltroInicial();
  } catch (error) {
    console.error("Error al obtener becas:", error);
    document.getElementById("becas-container").innerHTML =
      "<p>Error al cargar las becas.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchBecas);

document
  .getElementById("filtroCumpleRequisitos")
  .addEventListener("change", function () {
    filtrarBecas();
  });
