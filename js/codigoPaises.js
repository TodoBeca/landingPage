// Función para cargar los códigos de países
async function fetchCountryCodes() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,idd,translations"
    );

    const countries = await response.json();

    // Ordenar países por nombre
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // Obtener el elemento <select>
    const countryCodeSelect = document.getElementById("paisCode");

    // Limpiar el mensaje de "Cargando..."
    countryCodeSelect.innerHTML = "";

    // Agregar la opción por defecto "+0"
    const defaultOption = document.createElement("option");
    defaultOption.value = "+0"; // Valor de la opción
    defaultOption.textContent = "+0"; // Texto visible
    defaultOption.selected = true; // Seleccionada por defecto
    countryCodeSelect.appendChild(defaultOption);

    // Crear opciones para cada país
    countries.forEach((country) => {
      const hasCode = country.idd?.root && country.idd?.suffixes?.length > 0;
      if (!hasCode) return;

      const countryCode = `${country.idd.root}${country.idd.suffixes[0]}`;
      const countryName =
        country.translations?.spa?.common || country.name.common;

      const option = document.createElement("option");
      option.value = countryCode;
      option.textContent = `(${countryCode}) ${countryName}`;
      countryCodeSelect.appendChild(option);
    });

    // Evento para manejar la selección correctamente
    countryCodeSelect.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      console.log("Código seleccionado:", selectedOption.value);
    });
  } catch (error) {
    console.error("Error al obtener los códigos de países:", error);
    // Mostrar un mensaje de error en el <select>
    const countryCodeSelect = document.getElementById("paisCode");
    countryCodeSelect.innerHTML =
      "<option value=''>Error al cargar los países</option>";
  }
}

// Llamar a la función cuando la página cargue
window.onload = fetchCountryCodes;
