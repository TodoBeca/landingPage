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
  iconUrl: "images/Logo.png",
  iconSize: [30, 30],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

async function obtenerCantBecas() {
  const becas = await obtenerBecas();

  const fechaActual = new Date().toISOString().split("T")[0];

  const becasVigentes = becas.filter((beca) => {
    const fechaFinInscripcion = beca.fechaFinAplicacion
      ? new Date(beca.fechaFinAplicacion).toISOString().split("T")[0]
      : null;

    if (!fechaFinInscripcion) return true;

    return fechaFinInscripcion >= fechaActual;
  });

  return becasVigentes.reduce((contador, beca) => {
    const paises = Array.isArray(beca.paisDestino)
      ? beca.paisDestino
      : [beca.paisDestino];
    paises.forEach((pais) => {
      if (pais) {
        contador[pais] = (contador[pais] || 0) + 1;
      }
    });
    return contador;
  }, {});
}

async function obtenerCoordenadas(pais) {
  if (coordenadasPredefinidas[pais]) {
    return coordenadasPredefinidas[pais];
  }

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
  const destinos = await obtenerDestinosConCoordenadas();

  if (destinos.length === 0) {
    console.warn("No hay destinos con coordenadas disponibles.");
    return;
  }

  const map = L.map("map", {
    scrollWheelZoom: false,
  }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const bounds = new L.LatLngBounds();

  destinos.forEach((destino) => {
    const marker = L.marker([destino.lat, destino.lng], {
      title: `Destino: ${destino.nombre}`,
      icon: iconoBeca,
    });

    const popupContent = `
      <div style="padding: 0px; text-align: center; font-family: Arial, sans-serif;">
        <h6 style="margin: 0; color: #333;">${destino.nombre}</h6>
        <p style="margin: 0px 0; color: #333;">🎓 Becas Disponibles: <strong>${destino.becas}</strong></p>
      </div>
    `;

    marker.bindPopup(popupContent, { closeButton: false });

    marker.on("mouseover", function () {
      marker.openPopup();
    });

    marker.on("mouseout", function () {
      marker.closePopup();
    });

    marker.on("click", function () {
      filtrarPorPaisDesdeMapa(destino.nombre);
    });

    marker.addTo(map);

    bounds.extend(marker.getLatLng());
  });

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds);
  }
}

document.addEventListener("DOMContentLoaded", initMap);
