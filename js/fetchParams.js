async function fetchParametros() {
  try {
    const response = await fetch(CONFIG.API_URL_GET_PARAMETROS);

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const parametros = await response.json();
    const dropdownIdiomas = document.getElementById("dropdownIdiomas");
    const selectedIdiomasContainer =
      document.getElementById("selected-idiomas");
    const dropdownPaises = document.getElementById("dropdownPaises");
    const selectedPaisesContainer = document.getElementById("selected-paises");

    dropdownIdiomas.innerHTML = "";
    dropdownPaises.innerHTML = "";
    selectedIdiomasContainer.innerHTML = "";
    selectedPaisesContainer.innerHTML = "";

    if (parametros.idiomas && parametros.idiomas.length > 0) {
      parametros.idiomas.forEach((idioma) => {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#";
        dropdownItem.textContent = idioma;

        dropdownItem.addEventListener("click", function (e) {
          e.preventDefault();
          3;
          agregarIdiomaBadge(idioma);
        });

        dropdownIdiomas.appendChild(dropdownItem);
      });
    }

    if (parametros.paises && parametros.paises.length > 0) {
      parametros.paises.forEach((pais) => {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#";
        dropdownItem.textContent = pais;

        dropdownItem.addEventListener("click", function (e) {
          e.preventDefault();
          agregarPaisBadge(pais);
        });

        dropdownPaises.appendChild(dropdownItem);
      });
    }

    function agregarIdiomaBadge(idioma) {
      if (document.querySelector(`[data-idioma="${idioma}"]`)) return;

      const badge = document.createElement("span");
      badge.classList.add("badge-item");
      badge.setAttribute("data-idioma", idioma);
      badge.innerHTML = `
          ${idioma} 
          <button class="delete-btn">&times;</button>
        `;

      badge.querySelector(".delete-btn").addEventListener("click", function () {
        badge.remove();
      });

      selectedIdiomasContainer.appendChild(badge);
    }

    function agregarPaisBadge(pais) {
      if (document.querySelector(`[data-pais="${pais}"]`)) return;

      const badge = document.createElement("span");
      badge.classList.add("badge-item");
      badge.setAttribute("data-pais", pais);
      badge.innerHTML = `
          ${pais} 
          <button class="delete-btn">&times;</button>
        `;

      badge.querySelector(".delete-btn").addEventListener("click", function () {
        badge.remove();
      });

      selectedPaisesContainer.appendChild(badge);
    }
  } catch (error) {
    console.error("Error al obtener parámetros:", error);
    document.getElementById("selected-idiomas").innerHTML =
      "<p>Error al cargar idiomas.</p>";
    document.getElementById("selected-paises").innerHTML =
      "<p>Error al cargar países.</p>";
  }
}

fetchParametros();
