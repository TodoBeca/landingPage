document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const becaId = urlParams.get("id");

  if (becaId) {
    fetchBecaDetails(becaId);
  } else {
    document.getElementById("beca-details-section").innerHTML =
      "<p>Beca no encontrada.</p>";
  }
});

function obtenerDescripcionDificultad(dificultad) {
  if (!dificultad || dificultad < 1 || dificultad > 5) {
    return {
      texto: "No especificado",
      iconos: "",
      clase: "difficulty-unknown",
    };
  }

  const niveles = [
    { texto: "Muy baja", iconos: "🟢", clase: "difficulty-very-easy" },
    { texto: "Baja", iconos: "🟢🟢", clase: "difficulty-easy" },
    { texto: "Media", iconos: "🟡🟡🟡", clase: "difficulty-medium" },
    { texto: "Alta", iconos: "🔴🔴🔴🔴", clase: "difficulty-hard" },
    { texto: "Muy alta", iconos: "🔴🔴🔴🔴🔴", clase: "difficulty-very-hard" },
  ];

  return niveles[dificultad - 1];
}

function estaLogueado() {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token") !== null
  );
}

const leyendaResumen = document.getElementById("leyenda-resumen");
const resumenDiv = document.getElementById("resumen");
if (estaLogueado()) {
  resumenDiv.classList.remove("fuera-de-foco");
  resumenDiv.classList.add("normal");
  leyendaResumen.style.display = "none";
} else {
  resumenDiv.classList.remove("normal");
  resumenDiv.classList.add("fuera-de-foco");
  leyendaResumen.style.display = "block";
}

const leyendaDescripcion = document.getElementById("leyenda-descripcion");
const descripcionDiv = document.getElementById("descripcion");
if (estaLogueado()) {
  descripcionDiv.classList.remove("fuera-de-foco");
  descripcionDiv.classList.add("normal");
  leyendaDescripcion.style.display = "none";
} else {
  descripcionDiv.classList.remove("normal");
  descripcionDiv.classList.add("fuera-de-foco");
  leyendaDescripcion.style.display = "block";
}

const leyendaRequisitos = document.getElementById("leyenda-requisitos");
const requisitosDiv = document.getElementById("requisitos");
if (estaLogueado()) {
  requisitosDiv.classList.remove("fuera-de-foco");
  requisitosDiv.classList.add("normal");
  leyendaRequisitos.style.display = "none";
} else {
  requisitosDiv.classList.remove("normal");
  requisitosDiv.classList.add("fuera-de-foco");
  leyendaRequisitos.style.display = "block";
}

const leyendaCobertura = document.getElementById("leyenda-cobertura");
const coberturaDiv = document.getElementById("cobertura");
if (estaLogueado()) {
  coberturaDiv.classList.remove("fuera-de-foco");
  coberturaDiv.classList.add("normal");
  leyendaCobertura.style.display = "none";
} else {
  coberturaDiv.classList.remove("normal");
  coberturaDiv.classList.add("fuera-de-foco");
  leyendaCobertura.style.display = "block";
}

async function fetchBecaDetails(becaId) {
  try {
    const response = await fetch(`${CONFIG.API_URL_GET_BECA_ID}/${becaId}`);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const beca = await response.json();
    const dificultadInfo = obtenerDescripcionDificultad(beca.dificultad);

    // Formatear la fecha
    function formatearFecha(fecha) {
      if (!fecha) return "Fecha no disponible";

      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        return "Fecha no válida";
      }

      const opciones = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };

      return fechaObj.toLocaleDateString("es-ES", opciones);
    }

    // Mostrar los detalles de la beca siempre
    document.getElementById("beca-nombre").textContent = beca.nombreBeca;

    const imagenElement = document.getElementById("beca-imagen");
    if (beca.imagen) {
      imagenElement.innerHTML = `<img src="${beca.imagen}" alt="${beca.nombreBeca}" class="becaTemplate-image">`;
    } else {
      imagenElement.innerHTML =
        '<div class="no-image-placeholder">No hay imagen disponible</div>';
    }

    const dificultadElement = document.getElementById("beca-dificultad");
    dificultadElement.innerHTML = `
      <div class="d-flex align-items-center ${dificultadInfo.clase}">
        <span class="difficulty-text">${dificultadInfo.texto}</span>
        <span class="difficulty-icons me-2">${dificultadInfo.iconos}</span>
      </div>
    `;
    if (beca.destacada) {
      document.getElementById("beca-destacada").innerHTML = `
        <div class="d-flex align-items-center mb-3">
          <span class="badge bg-warning text-dark p-2">
           Beca Destacada
          </span>
        </div>
      `;
    }
    document.getElementById("beca-pais-destino").textContent = beca.paisDestino;
    document.getElementById("beca-region-destino").textContent =
      beca.regionDestino;
    document.getElementById("beca-area-estudio").textContent = beca.areaEstudio;
    document.getElementById("beca-fecha-limite").textContent = formatearFecha(
      beca.fechaFinAplicacion
    );
    const paisesAplicantes =
      Array.isArray(beca.paisPostulante) && beca.paisPostulante.length > 0
        ? beca.paisPostulante.join(", ")
        : "No hay países disponibles";

    document.getElementById("beca-paises-aplicantes").textContent =
      paisesAplicantes;

    // Mostrar los detalles de la beca solo logeado

    document.getElementById("beca-entidad").textContent = beca.entidadBecaria;
    document.getElementById(
      "beca-nivel-minimo"
    ).textContent = `Titulo de ${beca.requisitos.nivelAcademicoMin}`;
    document.getElementById("beca-universidad-destino").textContent =
      beca.universidadDestino;
    document.getElementById("beca-tipo").textContent = beca.tipoBeca;
    document.getElementById(
      "beca-duracion"
    ).textContent = `${beca.duracion.duracionMinima} - ${beca.duracion.duracionMaxima} ${beca.duracion.duracionUnidad}`;

    //Requerimientos
    document.getElementById(
      "beca-nivel-minimo-req"
    ).textContent = `Titulo de ${beca.requisitos.nivelAcademicoMin}`;
    document.getElementById(
      "beca-edad-req"
    ).textContent = `${beca.requisitos.edadMax} años`;
    document.getElementById("beca-carta-req").textContent = beca.requisitos
      .cartaRecomendacion
      ? "Sí"
      : "No";
    document.getElementById("beca-avalProc-req").textContent = beca.requisitos
      .avalUnivProcedencia
      ? "Sí"
      : "No";
    document.getElementById("beca-avalDest-req").textContent = beca.requisitos
      .avalUnivDestino
      ? "Sí"
      : "No";
    document.getElementById("beca-promedio-req").textContent =
      beca.requisitos.promedioMin;
    const examenesRequeridos =
      Array.isArray(beca.requisitos.examenesRequeridos) &&
      beca.requisitos.examenesRequeridos.length > 0
        ? beca.requisitos.examenesRequeridos.join(", ")
        : "No hay exámenes disponibles";
    document.getElementById("beca-examenes-req").textContent =
      examenesRequeridos;

    //Cobertura
    document.getElementById("beca-cobertura-matricula").textContent = beca
      .cobertura.matricula
      ? "Sí"
      : "No";
    document.getElementById("beca-cobertura-estipendio").textContent = beca
      .cobertura.estipendio
      ? "Sí"
      : "No";
    document.getElementById("beca-cobertura-pasajes").textContent = beca
      .cobertura.pasajes
      ? "Sí"
      : "No";
    document.getElementById("beca-cobertura-seguro").textContent = beca
      .cobertura.seguro
      ? "Sí"
      : "No";
    document.getElementById("beca-cobertura-alojamiento").textContent = beca
      .cobertura.alojamiento
      ? "Sí"
      : "No";
    document.getElementById(
      "beca-cobertura-monto"
    ).textContent = `$${beca.cobertura.montoMensualMin} - $${beca.cobertura.montoMensualMax}`;

    const descripcion = `
    La beca ofrecida por ${beca.institucionPublicadora} está dirigida a estudiantes que deseen realizar estudios en ${beca.universidadDestino}. 
    El área de estudio es ${beca.areaEstudio}, y se ofrecen ${beca.cantCupos} cupos disponibles. 
    La edad máxima para aplicar es de ${beca.requisitos.edadMax} años y se requiere un nivel académico mínimo de ${beca.requisitos.nivelAcademicoMin}.
    El monto mensual de cobertura de la beca oscila entre $${beca.cobertura.montoMensualMin} y $${beca.cobertura.montoMensualMax}, dependiendo del perfil del estudiante.
`;

    document.getElementById("beca-descripcion").textContent = descripcion;

    const idiomasRequeridos =
      Array.isArray(beca.requisitos.idiomasRequeridos) &&
      beca.requisitos.idiomasRequeridos.length > 0
        ? beca.requisitos.idiomasRequeridos
            .map((idioma) => `${idioma.idioma} (${idioma.nivelIdioma})`)
            .join(", ")
        : "No hay idiomas disponibles";

    document.getElementById("beca-idiomas-req").textContent = idiomasRequeridos;

    // Inicializar el mapa con los países aplicantes
    initMap(beca.paisPostulante, beca.paisDestino);
  } catch (error) {
    console.error("Error al obtener los detalles de la beca:", error);
    document.getElementById("beca-details-section").innerHTML =
      "<p>Error al cargar los detalles de la beca.</p>";
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

function formatearFecha(fecha) {
  if (!fecha) return "Fecha no disponible";

  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

// Función para obtener coordenadas de un país desde locations.js o OpenStreetMap
async function obtenerCoordenadas(pais) {
  // Si el país está en locations.js, usar sus coordenadas
  if (coordenadasPredefinidas[pais]) {
    return coordenadasPredefinidas[pais];
  }

  // Si no está en la base local, buscarlo en OpenStreetMap
  console.warn(
    `Coordenadas de ${pais} no encontradas en locations.js, buscando en OSM...`
  );
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        pais
      )}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error(`Error obteniendo coordenadas de ${pais} desde OSM:`, error);
  }
  return null;
}

// Función para inicializar el mapa con los países postulantes y el país destino
async function initMap(paisesPostulantes, paisDestino) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3, // Nivel de zoom inicial (se ajustará automáticamente)
    center: { lat: 0, lng: 0 }, // Centro inicial (se ajustará automáticamente)
  });

  const bounds = new google.maps.LatLngBounds();

  // Iconos personalizados
  const iconoPostulante = {
    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Icono rojo
    scaledSize: new google.maps.Size(32, 32),
  };

  const iconoDestino = {
    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Icono azul
    scaledSize: new google.maps.Size(32, 32),
  };

  // 📌 Agregar marcador para el país de destino (azul)
  if (paisDestino) {
    const coordenadasDestino = await obtenerCoordenadas(paisDestino);
    if (coordenadasDestino) {
      new google.maps.Marker({
        position: coordenadasDestino,
        map: map,
        title: `Destino: ${paisDestino}`,
        icon: iconoDestino,
      });

      bounds.extend(coordenadasDestino);
    }
  }

  // 📍 Agregar marcadores para los países postulantes (rojo)
  if (Array.isArray(paisesPostulantes)) {
    for (const pais of paisesPostulantes) {
      const coordenadas = await obtenerCoordenadas(pais);
      if (coordenadas) {
        new google.maps.Marker({
          position: coordenadas,
          map: map,
          title: `Postulante: ${pais}`,
          icon: iconoPostulante,
        });

        bounds.extend(coordenadas);
      }
    }
  }

  // 🔄 Ajustar el mapa para que todos los marcadores sean visibles
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds);

    // Opcional: Establecer un nivel de zoom máximo para evitar que el zoom sea demasiado alejado
    google.maps.event.addListenerOnce(map, "bounds_changed", function () {
      if (map.getZoom() > 4) {
        map.setZoom(4);
      }
    });
  }
}
