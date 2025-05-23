let paisesDetalles = [];

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
    limpiarInfoPais();
  });

  container.appendChild(badge);
  mostrarInfoPais(text); // Mostrar de inmediato cuando se agrega el badge
}

function limpiarInfoPais() {
  const elementos = [
    "capital",
    "region",
    "idiomas",
    "poblacion",
    "moneda",
    "tipo-cambio",
    "residencia",
    "supermercado",
    "transporte",
    "seguro",
    "descripcion-educacion",
    "idiomas-educacion",
    "calendario",
    "universidades",
    "porcentaje-internacionales",
    "tipo-visa",
    "documentacion",
    "trabajo-visa",
    "clima",
    "seguridad",
    "oferta-cultural",
    "enchufes",
  ];

  elementos.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = "";
    }
  });
}

function mostrarInfoPais(nombrePais) {
  const info = paisesDetalles.find(
    (p) => p.nombre.toLowerCase() === nombrePais.toLowerCase()
  );

  if (!info) return console.warn("País no encontrado");

  document.getElementById("capital").textContent =
    info.ficha_general_pais.capital || "-";
  document.getElementById("region").textContent =
    info.ficha_general_pais.region || "-";
  document.getElementById("idiomas").textContent =
    info.ficha_general_pais.idiomas_oficiales?.join(", ") || "-";
  document.getElementById("poblacion").textContent =
    info.ficha_general_pais.poblacion_total || "-";

  const costo = info.costo_vida_mensual_usd || {};
  document.getElementById("moneda").textContent = costo.moneda || "-";
  document.getElementById("tipo-cambio").textContent =
    costo.tipo_cambio_usd || "-";
  document.getElementById("residencia").textContent =
    costo.residencia_universitaria_usd
      ? `${costo.residencia_universitaria_usd}`
      : "-";
  document.getElementById("supermercado").textContent =
    costo.supermercado_mensual_usd ? `${costo.supermercado_mensual_usd}` : "-";
  document.getElementById("transporte").textContent =
    costo.transporte_publico_usd ? `${costo.transporte_publico_usd}` : "-";
  document.getElementById("seguro").textContent =
    costo.seguro_medico_obligatorio || "-";

  const edu = info.sistema_educacion || {};
  document.getElementById("descripcion-educacion").textContent =
    edu.descripcion_general || "-";
  document.getElementById("idiomas-educacion").textContent =
    edu.idiomas_instruccion?.join(", ") || "-";
  document.getElementById("calendario").textContent =
    edu.calendario_academico || "-";

  document.getElementById("universidades").innerHTML =
    info.universidades_mejor_rankeadas
      ? info.universidades_mejor_rankeadas
          .sort((a, b) => {
            // Extraer números del inicio de cada string (si existen)
            const numA = parseInt(a.match(/^\d+/)?.[0] || "0");
            const numB = parseInt(b.match(/^\d+/)?.[0] || "0");

            // Si ambos tienen números, ordenar por número
            if (numA && numB) {
              return numA - numB; // Orden descendente por número
            }

            // Si solo uno tiene número, poner primero el que tiene número
            if (numA && !numB) return -1;
            if (!numA && numB) return 1;

            // Si ninguno tiene número o son iguales, ordenar alfabéticamente
            return b.localeCompare(a);
          })
          .map((uni) => `<ul class="p-0">${uni}</ul>`)
          .join("")
      : "<ul>-</ul>";
  document.getElementById("porcentaje-internacionales").textContent = info
    .comunidad_estudiantil_internacional?.porcentaje_estudiantes_internacionales
    ? `${info.comunidad_estudiantil_internacional.porcentaje_estudiantes_internacionales}%`
    : "-";

  const visa = info.visa_y_requisitos_migratorios || {};
  document.getElementById("tipo-visa").textContent =
    visa.tipo_visa_estudiante || "-";
  document.getElementById("documentacion").textContent =
    visa.documentacion_necesaria?.join(", ") || "-";
  document.getElementById("trabajo-visa").textContent =
    visa.trabajo_con_visa_estudiante || "-";

  const clima = info.clima_y_estilo_vida || {};
  document.getElementById("clima").textContent =
    clima.clima_promedio_ciudades || "-";
  document.getElementById("seguridad").textContent =
    clima.nivel_seguridad || "-";
  document.getElementById("oferta-cultural").textContent =
    clima.oferta_cultural_recreativa || "-";
  document.getElementById("enchufes").textContent =
    clima.enchufes_y_voltaje || "-";
}

function actualizarDropdownPaises(paises) {
  const dropdown = document.getElementById("dropdownPaises");
  dropdown.innerHTML = "";

  if (!paises || paises.length === 0) {
    dropdown.innerHTML =
      "<p class='dropdown-item'>No hay países disponibles</p>";
    return;
  }

  paises.sort((a, b) => a.nombre.localeCompare(b.nombre));

  paises.forEach((pais) => {
    const item = document.createElement("a");
    item.classList.add("dropdown-item");
    item.href = "#";
    item.textContent = pais.nombre;

    item.addEventListener("click", (e) => {
      e.preventDefault();
      const container = document.getElementById("selected-paises");
      container.innerHTML = "";
      agregarBadge(pais.nombre, container, "pais");
    });

    dropdown.appendChild(item);
  });
}

async function fetchPaises() {
  try {
    const response = await fetch(CONFIG.API_URL_GET_PAISES);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("No se encontraron países en la base de datos");
        return;
      }
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    paisesDetalles = data;
    actualizarDropdownPaises(data);
  } catch (error) {
    console.error("Error al obtener países:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchPaises);
