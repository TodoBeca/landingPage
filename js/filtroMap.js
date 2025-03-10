function aplicarFiltroInicial() {
  const paisSeleccionado = sessionStorage.getItem("paisSeleccionado");

  if (paisSeleccionado) {
    // Verificar si el contenedor de badges está disponible
    const selectedPaisesContainer = document.getElementById("selected-paises");

    if (!selectedPaisesContainer) {
      console.error("El contenedor de badges no está disponible en el DOM.");
      return;
    }

    // Verificar si el país ya está en los filtros activos
    const selectedPaises = Array.from(
      document.querySelectorAll("#selected-paises .badge-item")
    ).map((badge) => badge.getAttribute("data-pais"));

    if (!selectedPaises.includes(paisSeleccionado)) {
      // Agregar el país como un badge en el contenedor de países seleccionados
      agregarBadge(paisSeleccionado, selectedPaisesContainer, "pais");
    }

    // Eliminar el valor de sessionStorage para que no persista en futuras búsquedas
    sessionStorage.removeItem("paisSeleccionado");

    // Llamar a filtrarBecas explícitamente para asegurarse de que se aplique el filtro
    filtrarBecas();
  }
}
