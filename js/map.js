// Función para obtener las becas desde la API
async function obtenerBecas() {
  try {
    const response = await fetch(CONFIG.API_URL_GET_BECAS);
    if (!response.ok) throw new Error("Error al obtener becas");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener becas:", error);
    return [];
  }
}

const iconoBeca = L.icon({
  iconUrl: "https://storage.cloud.google.com/imagenes_becas/Logos/Logo.png", // Ruta a tu imagen
  iconSize: [55, 50], // Tamaño del ícono en píxeles
  iconAnchor: [16, 40], // Punto del ícono que se posicionará en el punto del marcador (centro inferior)
  popupAnchor: [0, -40], // Punto desde donde se abre el popup (relativo al iconAnchor)
});

// Función para contar las becas por país
async function obtenerCantBecas() {
  const becas = await obtenerBecas();

  // Obtener la fecha actual en formato YYYY-MM-DD
  const fechaActual = new Date().toISOString().split("T")[0];

  // Filtrar becas vigentes
  const becasVigentes = becas.filter((beca) => {
    const fechaFinInscripcion = beca.fechaFinAplicacion
      ? new Date(beca.fechaFinAplicacion).toISOString().split("T")[0]
      : null;

    // Si no hay fecha final de inscripción, se considera vigente
    if (!fechaFinInscripcion) return true;

    // Mantener solo las becas cuya fecha final de inscripción sea mayor o igual a la fecha actual
    return fechaFinInscripcion >= fechaActual;
  });

  // Contar becas por país
  return becasVigentes.reduce((contador, beca) => {
    const pais = beca.paisDestino;
    if (pais) {
      contador[pais] = (contador[pais] || 0) + 1;
    }
    return contador;
  }, {});
}

// Función para obtener coordenadas de un país
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

// Función para obtener destinos con coordenadas
async function obtenerDestinosConCoordenadas() {
  const becasPorPais = await obtenerCantBecas();

  const coordenadasPromises = Object.keys(becasPorPais).map(async (pais) => {
    const coordenadas = await obtenerCoordenadas(pais);
    return coordenadas
      ? { nombre: pais, becas: becasPorPais[pais], ...coordenadas }
      : null;
  });

  return (await Promise.all(coordenadasPromises)).filter(Boolean);
}

// Función para inicializar el mapa con Leaflet
async function initMap() {
  const destinos = await obtenerDestinosConCoordenadas();

  if (destinos.length === 0) {
    console.warn("No hay destinos con coordenadas disponibles.");
    return;
  }

  // Crear el mapa
  const map = L.map("map", {
    scrollWheelZoom: false,
  }).setView([20, 0], 2); // Centro inicial y nivel de zoom

  // Usar un tile layer alternativo (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Crear un objeto LatLngBounds para ajustar el mapa
  const bounds = new L.LatLngBounds();

  // Agregar marcadores para cada destino
  destinos.forEach((destino) => {
    const marker = L.marker([destino.lat, destino.lng], {
      title: `Destino: ${destino.nombre}`,
      icon: iconoBeca, // 👈 acá está la clave
    });

    // Crear el contenido del popup
    const popupContent = `
      <div style="padding: 0px; text-align: center; font-family: Arial, sans-serif;">
        <h6 style="margin: 0; color: #333;">${destino.nombre}</h6>
        <p style="margin: 0px 0; color: #333;">🎓 Becas Disponibles: <strong>${destino.becas}</strong></p>
      </div>
    `;

    // Asignar el popup al marcador
    marker.bindPopup(popupContent, { closeButton: false });

    // Mostrar el popup al pasar el cursor sobre el marcador
    marker.on("mouseover", function () {
      marker.openPopup();
    });

    // Ocultar el popup al quitar el cursor del marcador
    marker.on("mouseout", function () {
      marker.closePopup();
    });

    // Filtrar becas al hacer clic en el marcador
    marker.on("click", function () {
      filtrarPorPaisDesdeMapa(destino.nombre);
    });

    // Agregar el marcador al mapa
    marker.addTo(map);

    // Extender los límites del mapa para incluir este marcador
    bounds.extend(marker.getLatLng());
  });

  // Ajustar el mapa para que todos los marcadores sean visibles
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds);
  }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", initMap);
