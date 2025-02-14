let becas = [];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".dropdown-menu").forEach((item) => {
  item.addEventListener("click", function () {
    setTimeout(scrollToTop, 700);
  });
});

const usuario =
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(sessionStorage.getItem("usuario"));

// Función para calcular la duración de la beca
function calcularDuracion(duracion) {
  const unidad = duracion.duracionUnidad || "años";
  const mesesPorAnio = 12;

  // Función para convertir a meses
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
    return "Duración no disponible";
  }
}

function formatearFecha(fecha) {
  if (!fecha) return "Fecha no disponible";

  const [anio, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${anio}`;
}

// Función para calcular el período de inscripción
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

// Función para agregar badges (etiquetas) de filtros seleccionados
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
    filtrarBecas(); // Vuelve a filtrar cuando se elimina un badge
  });

  container.appendChild(badge);
  filtrarBecas(); // Filtra automáticamente al agregar un badge
}

// Función para mostrar las becas filtradas
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

    const duracionCalculada = calcularDuracion(beca.duración);
    const inscripciones = calcularInscripcion(
      beca.fechaInicioAplicacion,
      beca.fechaFinAplicacion
    );

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
    <div class="course-inner-text py-4 px-4">
    <span class="course-price mt-4"><strong>Destino: </strong>${
      beca.paisOrigen || "Sin país"
    } - ${beca.regionOrigen}</span>
    <h3 class="text-primary font-weight-bold"><a>${beca.nombreBeca}</a></h3>
    <h6><a>${beca.entidadBecaria}</a></h6>

    <div class="meta">
      <h6 class="font-weight-bold">Características</h6>
      <div>
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
        <span class="icon-calendar"></span>Inscripciones: ${inscripciones}
      </div>
    </div>

    <div class="meta">
      ${
        usuario
          ? `
          <h6 class="font-weight-bold">Detalles Adicionales</h6>
          <div>
            <span class="icon-clock-o"></span>Duración: ${duracionCalculada} 
            &nbsp;
            <span>-</span>
            <span class="icon-users"></span>Cant. Cupos: ${
              beca.cantCupos || "Cupos no disponibles"
            }
          </div>
          `
          : `
          <div>
            <span class="icon-clock-o"></span>Duración: **** 
            &nbsp;
            <span>-</span>
            <span class="icon-users"></span>Cant. Cupos: ****
          </div>
          `
      }
    </div>

    <div class="meta">
      <h6 class="font-weight-bold">Requisitos</h6>
      <span class="icon-book"></span>Nivel Académico: ${
        usuario
          ? beca.requisitos.nivelAcademicoMin || "No especificado"
          : "****"
      }
      &nbsp;
      <span>-</span>
      <span class="icon-comment"></span>Idioma Requerido: ${
        usuario
          ? beca.requisitos.idiomasRequeridos
            ? beca.requisitos.idiomasRequeridos
                .map((idioma) => `${idioma.idioma} (${idioma.nivelIdioma})`)
                .join(", ")
            : "No especificado"
          : "****"
      }
      &nbsp;
      <span>-</span>
      <span class="icon-user"></span>Edad Máxima: ${
        usuario ? beca.requisitos.edadMax || "No especificado" : "****"
      } años
      &nbsp;
      <span>-</span>
      <span class="icon-bar-chart"></span> Promedio Min.: ${
        usuario ? beca.requisitos.promedioMin || "No especificado" : "****"
      }
    ${
      usuario
        ? ""
        : `
          <div>
            <span class="text-danger">Para ver más características, inicie sesión</span>
          </div>
        `
    }
  </div>
`;

    container.appendChild(card);
  });
}

const filteredBecas = becas.filter((beca) => {
  if (!filtroFecha) return true; // Si no se seleccionó ninguna fecha, no filtrar por fecha

  // Convertir las fechas de inscripción de la beca a formato YYYY-MM-DD
  const fechaInicio = beca.fechaInicioAplicacion
    ? new Date(beca.fechaInicioAplicacion).toISOString().slice(0, 10)
    : null;

  const fechaFin = beca.fechaFinAplicacion
    ? new Date(beca.fechaFinAplicacion).toISOString().slice(0, 10)
    : null;

  // Si la beca no tiene fechas de inscripción, descartarla
  if (!fechaInicio || !fechaFin) return false;

  // Verificar si la fecha seleccionada está dentro del rango de inscripción
  return filtroFecha >= fechaInicio && filtroFecha <= fechaFin;
});

function actualizarDropdownPaises(paises) {
  const dropdownPaises = document.getElementById("dropdownPaises");
  dropdownPaises.innerHTML = ""; // Limpiar el dropdown antes de agregar nuevos países

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

// Función para filtrar las becas
function filtrarBecas() {
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

  // Obtener la fecha seleccionada en el input
  const filtroFecha = document.getElementById("filtroFecha").value;

  const paisesDisponibles = new Set();
  becas.forEach((beca) => {
    if (
      selectedRegion.length === 0 ||
      selectedRegion.includes(beca.regionOrigen)
    ) {
      paisesDisponibles.add(beca.paisOrigen);
    }
  });

  actualizarDropdownPaises([...paisesDisponibles]);

  const filteredBecas = becas.filter((beca) => {
    // Filtro por idioma
    if (
      selectedIdiomas.length > 0 &&
      !selectedIdiomas.some((idioma) =>
        beca.requisitos.idiomasRequeridos.some((req) => req.idioma === idioma)
      )
    ) {
      return false;
    }

    // Filtro por región
    if (
      selectedRegion.length > 0 &&
      !selectedRegion.includes(beca.regionOrigen)
    ) {
      return false;
    }

    // Filtro por país
    if (
      selectedPaises.length > 0 &&
      !selectedPaises.includes(beca.paisOrigen)
    ) {
      return false;
    }

    // Filtro por nacionalidad del postulante
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

    // Filtro por area de estudio
    if (selectedArea.length > 0 && !selectedArea.includes(beca.areaEstudio)) {
      return false;
    }

    // Filtro por tipo de beca
    if (
      selectedTiposBeca.length > 0 &&
      !selectedTiposBeca.includes(beca.tipoBeca)
    ) {
      return false;
    }

    // Filtrar por fecha de inscripción
    if (filtroFecha) {
      const fechaInicio = beca.fechaInicioAplicacion
        ? new Date(beca.fechaInicioAplicacion).toISOString().split("T")[0]
        : null;
      const fechaFin = beca.fechaFinAplicacion
        ? new Date(beca.fechaFinAplicacion).toISOString().split("T")[0]
        : null;

      if (!fechaInicio || !fechaFin) return false;

      // Convertir la fecha de filtro a formato YYYY-MM-DD
      const fechaFiltro = new Date(filtroFecha).toISOString().split("T")[0];

      // Verificar si la fecha de filtro está dentro del rango de inscripción
      if (fechaFiltro < fechaInicio || fechaFiltro > fechaFin) {
        return false;
      }
    }

    // Filtro por edad máxima
    if (beca.requisitos?.edadMax && beca.requisitos.edadMax > edadValue) {
      return false;
    }

    // Filtro por duración máxima
    if (beca.duración?.duracionMaxima) {
      // Convertir duración máxima de la beca a meses si está en años
      const duracionMaxBeca = beca.duración.duracionUnidad
        ?.toLowerCase()
        .includes("año")
        ? beca.duración.duracionMaxima * 12 // Convertir años a meses
        : beca.duración.duracionMaxima; // Ya está en meses

      if (duracionMaxBeca > duracionValue) {
        return false;
      }
    }

    return true;
  });

  mostrarBecasFiltradas(filteredBecas);
}

// Función principal para obtener y mostrar las becas
async function fetchBecas() {
  try {
    const response = await fetch(CONFIG.API_URL_GET_BECAS);

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    // Asignar los datos de las becas a la variable global `becas`
    rawBecas = await response.json();

    // Obtener la fecha actual en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split("T")[0];

    // Filtrar las becas vigentes
    becas = rawBecas.filter((beca) => {
      const fechaFinInscripcion = beca.fechaFinAplicacion
        ? new Date(beca.fechaFinAplicacion).toISOString().split("T")[0]
        : null;

      // Si no hay fecha final de inscripción, se considera vigente
      if (!fechaFinInscripcion) return true;

      // Mantener solo las becas cuya fecha final de inscripción sea mayor o igual a la fecha actual
      return fechaFinInscripcion >= fechaActual;
    });

    // Asignar las becas filtradas a la variable global `becas`
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

    // Obtener idiomas únicos
    const idiomas = [
      ...new Set(
        becas
          .flatMap((beca) =>
            beca.requisitos.idiomasRequeridos.map((req) => req.idioma)
          )
          .filter(Boolean)
      ),
    ];

    // Obtener regiones únicos
    const regiones = [
      ...new Set(becas.map((beca) => beca.regionOrigen).filter(Boolean)),
    ];

    // Obtener países únicos
    const paises = [
      ...new Set(becas.map((beca) => beca.paisOrigen).filter(Boolean)),
    ];

    // Obtener nacionalidades únicas sin repetir
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

    // Obtener areas de estudio únicos
    const Areas = [
      ...new Set(becas.map((beca) => beca.areaEstudio).filter(Boolean)),
    ];

    // Obtener tipos de beca únicos
    const tiposBeca = [
      ...new Set(becas.map((beca) => beca.tipoBeca).filter(Boolean)),
    ];

    // Generar dropdown de idiomas
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

    // Generar dropdown de regiones
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

    // Generar dropdown de países
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

    // Generar dropdown de nacionalidades
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

    // Generar dropdown de areas de estudio
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

    // Generar dropdown de tipo de beca
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

    // Configurar los sliders
    // Configurar los sliders para que muestren valores en meses
    const configSliders = [
      { id: "rEdad", prop: "requisitos.edadMax", default: 100 },
      {
        id: "rDuracion",
        prop: "duración.duracionMaxima",
        default: 10,
        toMonths: true,
      }, // Convierte a meses
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
        .map((v) => (toMonths ? v * 12 : v)); // Si es duración, convertir a meses

      const minValue = values.length > 0 ? Math.min(...values) : 0;
      const maxValue =
        values.length > 0
          ? Math.max(...values)
          : defaultValue * (toMonths ? 12 : 1); // Convertir el default a meses si es necesario

      if (slider && range) {
        slider.min = minValue;
        slider.max = maxValue;
        slider.value = maxValue;
        range.textContent = `${maxValue} `;

        slider.oninput = function () {
          range.textContent = `${this.value}`; // Mostrar siempre en meses
          filtrarBecas();
        };
      }
    });

    // Mostrar todas las becas al cargar la página
    mostrarBecasFiltradas(becas);
  } catch (error) {
    console.error("Error al obtener becas:", error);
    document.getElementById("becas-container").innerHTML =
      "<p>Error al cargar las becas.</p>";
  }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", fetchBecas);
