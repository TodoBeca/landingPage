document.addEventListener("DOMContentLoaded", function () {
  // Definición del arreglo de nacionalidades en español
  const countries = [
    // América Latina
    "Argentina",
    "Bolivia",
    "Brasil",
    "Chile",
    "Colombia",
    "Cuba",
    "República Dominicana",
    "Ecuador",
    "México",
    "Paraguay",
    "Perú",
    "Uruguay",
    "Venezuela",
    // Centroamérica
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Panamá",
    "Belice",
    // América del Norte
    "Canadá",
    "Estados Unidos",
    // Europa
    "Albania",
    "Andorra",
    "Armenia",
    "Austria",
    "Azerbaiyán",
    "Bielorrusia",
    "Bélgica",
    "Bosnia y Herzegovina",
    "Bulgaria",
    "Croacia",
    "Chipre",
    "República Checa",
    "Dinamarca",
    "Estonia",
    "Finlandia",
    "Francia",
    "Georgia",
    "Alemania",
    "Grecia",
    "Hungría",
    "Islandia",
    "Irlanda",
    "Italia",
    "Kazajistán",
    "Kosovo",
    "Letonia",
    "Liechtenstein",
    "Lituania",
    "Luxemburgo",
    "Malta",
    "Moldavia",
    "Mónaco",
    "Montenegro",
    "Países Bajos",
    "Macedonia del Norte",
    "Noruega",
    "Polonia",
    "Portugal",
    "Rumania",
    "Rusia",
    "San Marino",
    "Serbia",
    "Eslovaquia",
    "Eslovenia",
    "España",
    "Suecia",
    "Suiza",
    "Turquía",
    "Ucrania",
    "Reino Unido",
    "Ciudad del Vaticano",
  ];

  // Ordenar el arreglo alfabéticamente usando localeCompare para comparaciones correctas en español
  countries.sort((a, b) => a.localeCompare(b));

  // Función para poblar un <select> dado el elemento y el texto por defecto
  function populateSelect(selectElement, defaultText) {
    // Crear opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultText;
    selectElement.appendChild(defaultOption);

    // Agregar cada país como opción
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      selectElement.appendChild(option);
    });
  }

  // Obtener los elementos <select> del DOM
  const nationalitySelect = document.getElementById("nationalitySelect");
  const additionalCitizenshipSelect = document.getElementById(
    "additionalCitizenshipSelect"
  );

  // Poblar ambos selects
  if (nationalitySelect) {
    populateSelect(nationalitySelect, "Selecciona tu nacionalidad");
  }
  if (additionalCitizenshipSelect) {
    populateSelect(
      additionalCitizenshipSelect,
      "Selecciona tu ciudadanía adicional"
    );
  }
});
