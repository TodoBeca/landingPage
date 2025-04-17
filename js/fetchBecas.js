let becas = [];
let becasFiltradas = [];

// Estados para el ordenamiento
let ordenDestacadas = null; // null, "asc", "desc"
let ordenDificultad = null; // null, "asc", "desc"
let ordenVencimiento = null; // null, "asc", "desc"

// Variables para paginación
let paginaActual = 1;
const becasPorPagina = 8;

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

// Función para filtrar becas por país desde el mapa
function filtrarPorPaisDesdeMapa(pais) {
  // Limpiar filtros previos de país si es necesario
  const selectedPaises = document.getElementById("selected-paises");
  selectedPaises.innerHTML = "";

  // Agregar el país como filtro
  agregarBadge(pais, selectedPaises, "pais");

  // Desplazarse a la sección de resultados
  setTimeout(() => {
    const element = document.getElementById("contador-becas");
    const offset = 100; // Pixeles de espacio adicional
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, 100);
}

const leyendaFiltro = document.getElementById("leyenda-filtro");
const filtro = document.getElementById("filtro");
if (estaLogueado()) {
  filtro.classList.remove("fuera-de-foco-filtro");
  filtro.classList.add("normal");
  leyendaFiltro.style.display = "none";
} else {
  filtro.classList.remove("normal");
  filtro.classList.add("fuera-de-foco-filtro");
  leyendaFiltro.style.display = "block";
}

function formatearFecha(fecha) {
  if (!fecha) return "Fecha no disponible";

  const [anio, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${anio}`;
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

function mostrarBecasFiltradas() {
  const container = document.getElementById("becas-container");
  const paginationContainer = document.getElementById("pagination-container");
  container.innerHTML = "";

  if (becasFiltradas.length === 0) {
    container.innerHTML =
      "<p>No se encontraron becas con los filtros aplicados.</p>";
    paginationContainer.innerHTML = "";
    return;
  }

  // Calcular el total de páginas
  const totalPaginas = Math.ceil(becasFiltradas.length / becasPorPagina);

  // Asegurarse de que la página actual esté dentro del rango válido
  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }
  if (paginaActual < 1) {
    paginaActual = 1;
  }

  // Calcular índices de las becas a mostrar
  const inicio = (paginaActual - 1) * becasPorPagina;
  const fin = inicio + becasPorPagina;
  const becasPagina = becasFiltradas.slice(inicio, fin);

  // Mostrar las becas de la página actual
  becasPagina.forEach((beca) => {
    const card = document.createElement("div");
    const ReqMeet = usuario ? cumpleRequisitos(usuario, beca) : null;

    card.classList.add(
      "course",
      "bg-white",
      "h-100",
      "mb-4",
      "w-100",
      "rounded",
      "ml-4"
    );

    card.innerHTML = cardBeca(beca, ReqMeet);

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

  // Mostrar controles de paginación
  mostrarControlesPaginacion(totalPaginas, becasFiltradas.length);
}

function mostrarControlesPaginacion(totalPaginas, totalBecas) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  const pagination = document.createElement("div");
  pagination.classList.add("pagination");

  // Botón Anterior
  const prevButton = document.createElement("button");
  prevButton.innerHTML = "&laquo;";
  prevButton.disabled = paginaActual === 1;
  prevButton.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarBecasFiltradas();
    }
  });
  pagination.appendChild(prevButton);

  // Números de página
  const maxPaginasVisibles = 5;
  let inicioPagina = Math.max(
    1,
    paginaActual - Math.floor(maxPaginasVisibles / 2)
  );
  let finPagina = Math.min(totalPaginas, inicioPagina + maxPaginasVisibles - 1);

  // Ajustar si estamos cerca del final
  if (finPagina - inicioPagina + 1 < maxPaginasVisibles) {
    inicioPagina = Math.max(1, finPagina - maxPaginasVisibles + 1);
  }

  // Mostrar el primer número con "..." si es necesario
  if (inicioPagina > 1) {
    const firstPageButton = document.createElement("button");
    firstPageButton.textContent = "1";
    firstPageButton.addEventListener("click", () => {
      paginaActual = 1;
      mostrarBecasFiltradas();
    });
    pagination.appendChild(firstPageButton);

    if (inicioPagina > 2) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      pagination.appendChild(ellipsis);
    }
  }

  // Botones de páginas numeradas
  for (let i = inicioPagina; i <= finPagina; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.toggle("active", i === paginaActual);
    pageButton.addEventListener("click", () => {
      paginaActual = i;
      mostrarBecasFiltradas();
    });
    pagination.appendChild(pageButton);
  }

  // Mostrar el último número con "..." si es necesario
  if (finPagina < totalPaginas) {
    if (finPagina < totalPaginas - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      pagination.appendChild(ellipsis);
    }

    const lastPageButton = document.createElement("button");
    lastPageButton.textContent = totalPaginas;
    lastPageButton.addEventListener("click", () => {
      paginaActual = totalPaginas;
      mostrarBecasFiltradas();
    });
    pagination.appendChild(lastPageButton);
  }

  // Botón Siguiente
  const nextButton = document.createElement("button");
  nextButton.innerHTML = "&raquo;";
  nextButton.disabled = paginaActual === totalPaginas;
  nextButton.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarBecasFiltradas();
    }
  });
  pagination.appendChild(nextButton);

  // Contador de resultados
  const resultsCounter = document.createElement("div");
  resultsCounter.classList.add("results-counter");
  const inicioResultados = (paginaActual - 1) * becasPorPagina + 1;
  const finResultados = Math.min(paginaActual * becasPorPagina, totalBecas);
  resultsCounter.textContent = `Mostrando ${inicioResultados}-${finResultados} de ${totalBecas} becas`;

  paginationContainer.appendChild(resultsCounter);
  paginationContainer.appendChild(pagination);
}

function toggleInteraccionFiltros(habilitar) {
  const elementosFiltro = document.querySelectorAll(
    "#filtro input, #filtro select, #filtro button, #filtro .dropdown-item"
  );
  elementosFiltro.forEach((elemento) => {
    if (
      elemento.tagName === "INPUT" ||
      elemento.tagName === "SELECT" ||
      elemento.tagName === "BUTTON"
    ) {
      elemento.disabled = !habilitar;
    } else {
      elemento.style.pointerEvents = habilitar ? "auto" : "none";
    }
  });

  const badges = document.querySelectorAll(".badge-item .delete-btn");
  badges.forEach((badge) => {
    badge.disabled = !habilitar;
    badge.style.pointerEvents = habilitar ? "auto" : "none";
  });

  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.style.pointerEvents = habilitar ? "auto" : "none";
  });
}

if (estaLogueado()) {
  toggleInteraccionFiltros(true);
} else {
  toggleInteraccionFiltros(false);
}

function actualizarDropdownPaises(paises) {
  const dropdownPaises = document.getElementById("dropdownPaises");
  dropdownPaises.innerHTML = "";

  if (paises.length === 0) {
    dropdownPaises.innerHTML =
      "<p class='dropdown-item'>No hay países disponibles</p>";
    return;
  }

  // Ordenar los países alfabéticamente
  paises.sort((a, b) => a.localeCompare(b));

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
  paginaActual = 1;

  const selectedRegion = Array.from(
    document.querySelectorAll("#selected-region .badge-item")
  ).map((badge) => badge.getAttribute("data-region"));

  const selectedPaises = Array.from(
    document.querySelectorAll("#selected-paises .badge-item")
  ).map((badge) => badge.getAttribute("data-pais"));

  const selectedNacPostulante = Array.from(
    document.querySelectorAll("#selected-nacPostulante .badge-item")
  ).map((badge) => badge.getAttribute("data-nacionalidad"));

  const selectedArea = Array.from(
    document.querySelectorAll("#selected-area .badge-item")
  ).map((badge) => badge.getAttribute("data-area"));

  const selectedTipoBeca = Array.from(
    document.querySelectorAll("#selected-tipoBeca .badge-item")
  ).map((badge) => badge.getAttribute("data-tipo"));

  // const selectedNivelAcademico = Array.from(
  //   document.querySelectorAll("#selected-nivelAcademico .badge-item")
  // ).map((badge) => badge.getAttribute("data-nivel"));

  const filtroCumpleRequisitos = document.getElementById(
    "filtroCumpleRequisitos"
  ).checked;

  const paisesDisponibles = new Set();
  becas.forEach((beca) => {
    if (
      selectedRegion.length === 0 ||
      selectedRegion.some((region) =>
        Array.isArray(beca.regionDestino)
          ? beca.regionDestino.includes(region)
          : beca.regionDestino === region
      )
    ) {
      if (Array.isArray(beca.paisDestino)) {
        beca.paisDestino.forEach((pais) => paisesDisponibles.add(pais));
      } else {
        paisesDisponibles.add(beca.paisDestino);
      }
    }
  });

  actualizarDropdownPaises([...paisesDisponibles]);

  becasFiltradas = becas.filter((beca) => {
    if (
      selectedRegion.length > 0 &&
      !selectedRegion.some((region) =>
        Array.isArray(beca.regionDestino)
          ? beca.regionDestino.includes(region)
          : beca.regionDestino === region
      )
    ) {
      return false;
    }

    if (
      selectedPaises.length > 0 &&
      !selectedPaises.some((pais) =>
        Array.isArray(beca.paisDestino)
          ? beca.paisDestino.includes(pais)
          : beca.paisDestino === pais
      )
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
      selectedTipoBeca.length > 0 &&
      !selectedTipoBeca.includes(beca.tipoBeca)
    ) {
      return false;
    }

    if (
      selectedNivelAcademico.length > 0 &&
      !selectedNivelAcademico.includes(beca.nivelAcademico)
    ) {
      return false;
    }

    if (filtroCumpleRequisitos && usuario) {
      if (!cumpleRequisitos(usuario, beca)) {
        return false;
      }
    }

    return true;
  });

  // Aplicar ordenamientos
  becasFiltradas.sort((a, b) => {
    if (ordenDestacadas === "asc") {
      if (a.destacada && !b.destacada) return -1;
      if (!a.destacada && b.destacada) return 1;
    } else if (ordenDestacadas === "desc") {
      if (a.destacada && !b.destacada) return 1;
      if (!a.destacada && b.destacada) return -1;
    }

    if (ordenDificultad === "asc") {
      if (a.dificultad !== b.dificultad) return a.dificultad - b.dificultad;
    } else if (ordenDificultad === "desc") {
      if (a.dificultad !== b.dificultad) return b.dificultad - a.dificultad;
    }

    if (ordenVencimiento === "asc") {
      const fechaA = new Date(a.fechaFinAplicacion);
      const fechaB = new Date(b.fechaFinAplicacion);
      if (fechaA !== fechaB) return fechaA - fechaB;
    } else if (ordenVencimiento === "desc") {
      const fechaA = new Date(a.fechaFinAplicacion);
      const fechaB = new Date(b.fechaFinAplicacion);
      if (fechaA !== fechaB) return fechaB - fechaA;
    }

    return 0;
  });

  actualizarContadorBecas(becasFiltradas.length);
  mostrarBecasFiltradas();
}

function alternarOrden(boton, criterio) {
  const flecha = boton.querySelector(".flecha");

  if (criterio === "destacadas") {
    ordenDestacadas = ordenDestacadas === "asc" ? "desc" : "asc";
    flecha.classList.toggle("icon-arrow-down", ordenDestacadas === "desc");
    flecha.classList.toggle("icon-arrow-up", ordenDestacadas === "asc");
  } else if (criterio === "dificultad") {
    ordenDificultad = ordenDificultad === "asc" ? "desc" : "asc";
    flecha.classList.toggle("icon-arrow-down", ordenDificultad === "desc");
    flecha.classList.toggle("icon-arrow-up", ordenDificultad === "asc");
  } else if (criterio === "vencimiento") {
    ordenVencimiento = ordenVencimiento === "asc" ? "desc" : "asc";
    flecha.classList.toggle("icon-arrow-down", ordenVencimiento === "desc");
    flecha.classList.toggle("icon-arrow-up", ordenVencimiento === "asc");
  }
  filtrarBecas();
}

document.getElementById("btnOrdenDestacadas").addEventListener("click", () => {
  alternarOrden(document.getElementById("btnOrdenDestacadas"), "destacadas");
});

document.getElementById("btnOrdenDificultad").addEventListener("click", () => {
  alternarOrden(document.getElementById("btnOrdenDificultad"), "dificultad");
});

document.getElementById("btnOrdenVencimiento").addEventListener("click", () => {
  alternarOrden(document.getElementById("btnOrdenVencimiento"), "vencimiento");
});

function actualizarContadorBecas(total) {
  document.getElementById("total-becas").textContent = total;
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

    becasFiltradas = [...becas];
    actualizarContadorBecas(becasFiltradas.length);

    const container = document.getElementById("becas-container");
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
      document.getElementById("selected-tipoBeca");
    const dropdownNivelAcademico = document.getElementById(
      "dropdownNivelAcademico"
    );
    const selectedNivelAcademicoContainer = document.getElementById(
      "selected-nivelAcademico"
    );

    container.innerHTML = "";
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
    // dropdownNivelAcademico.innerHTML = "";
    // selectedNivelAcademicoContainer.innerHTML = "";

    if (becas.length === 0) {
      container.innerHTML = "<p>No se encontraron becas.</p>";
      return;
    }

    const regiones = [
      ...new Set(
        becas
          .flatMap((beca) =>
            Array.isArray(beca.regionDestino)
              ? beca.regionDestino
              : [beca.regionDestino]
          )
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));

    const paises = [
      ...new Set(
        becas
          .flatMap((beca) =>
            Array.isArray(beca.paisDestino)
              ? beca.paisDestino
              : [beca.paisDestino]
          )
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));

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
    ].sort((a, b) => a.localeCompare(b));

    const nivelesAcademicos = [
      ...new Set(becas.map((beca) => beca.nivelAcademico).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));

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
        agregarBadge(tipo, selectedTipoBecaContainer, "tipo");
      });

      dropdownTipoBeca.appendChild(dropdownItem);
    });

    // nivelesAcademicos.forEach((nivel) => {
    //   const dropdownItem = document.createElement("a");
    //   dropdownItem.classList.add("dropdown-item");
    //   dropdownItem.href = "#";
    //   dropdownItem.textContent = nivel;

    //   dropdownItem.addEventListener("click", function (e) {
    //     e.preventDefault();
    //     agregarBadge(nivel, selectedNivelAcademicoContainer, "nivel");
    //   });

    //   dropdownNivelAcademico.appendChild(dropdownItem);
    // });

    mostrarBecasFiltradas();

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
