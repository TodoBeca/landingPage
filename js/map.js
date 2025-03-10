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

async function obtenerCoordenadas(pais) {
  if (coordenadasPredefinidas[pais]) {
    return coordenadasPredefinidas[pais];
  }

  console.warn(
    `Coordenadas de ${pais} no encontradas en locations.js, buscando en OSM...`
  );
  return await obtenerCoordenadasDesdeAPI(pais);
}

async function obtenerCoordenadasDesdeAPI(pais) {
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

async function initMap() {
  console.log("Inicializando mapa...");

  const destinos = await obtenerDestinosConCoordenadas();
  console.log("Destinos obtenidos:", destinos);

  if (destinos.length === 0) {
    console.warn("No hay destinos con coordenadas disponibles.");
    return;
  }

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat: 20, lng: 0 },
    mapTypeId: "hybrid",
  });

  const bounds = new google.maps.LatLngBounds();
  const infoWindow = new google.maps.InfoWindow();

  destinos.forEach((destino) => {
    console.log(`Agregando marcador para ${destino.nombre}`, destino);

    const marker = new google.maps.Marker({
      position: { lat: destino.lat, lng: destino.lng },
      map: map,
      title: `Destino: ${destino.nombre}`,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(32, 32),
      },
    });

    bounds.extend(marker.position);

    const infoContent = `
      <div style="padding: 0px; text-align: center; font-family: Arial, sans-serif;">
        <h4 style="margin: 0; color: #333;">${destino.nombre}</h4>
        <p style="margin: 0px 0; color: #333;">🎓 Becas Disponibles: <strong>${destino.becas}</strong></p>
      </div>
    `;

    marker.addListener("mouseover", () => {
      infoWindow.setContent(infoContent);
      infoWindow.open(map, marker);

      setTimeout(() => {
        document.querySelector(".gm-style-iw button")?.remove();
      }, 0);
    });

    marker.addListener("mouseout", () => {
      infoWindow.close();
    });

    marker.addListener("click", () => {
      sessionStorage.setItem("paisSeleccionado", destino.nombre);
      window.location.href = `/becas.html`;
    });
  });

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof google !== "undefined") {
    initMap();
  } else {
    console.error("Google Maps no está cargado correctamente.");
  }
});
