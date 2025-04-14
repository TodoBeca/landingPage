function calcularEdad(birthDate) {
  if (!birthDate) {
    return 0;
  }
  const hoy = new Date();
  const fechaNacimiento = new Date(birthDate);
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }

  return edad;
}

function usuarioTieneInformacionCompleta(usuario) {
  if (
    !usuario ||
    !usuario.personalData ||
    !usuario.personalData.birthDate ||
    !usuario.personalData.nationality ||
    !Array.isArray(usuario.academicData) ||
    usuario.academicData.length === 0 ||
    !Array.isArray(usuario.languages) ||
    usuario.languages.length === 0
  ) {
    return false;
  }

  const academicoInvalido = usuario.academicData.some((item) => !item.degree);

  const idiomaInvalido = usuario.languages.some(
    (idioma) => !idioma.language || !idioma.level
  );

  return !academicoInvalido && !idiomaInvalido;
}

function obtenerNivelAcademicoMaximo(academicData) {
  const niveles = {
    Secundario: 0,
    Grado: 1,
    Licenciatura: 2,
    Maestría: 3,
    Doctorado: 4,
  };

  if (!academicData || academicData.length === 0) {
    return null;
  }

  const maxDegree = academicData.reduce((maxDegree, item, index) => {
    if (index === 0) {
      return item.degree;
    }

    return niveles[item.degree] > niveles[maxDegree] ? item.degree : maxDegree;
  }, academicData[0].degree);

  return maxDegree;
}

function cumpleNivelIdioma(nivelUsuario, nivelRequerido) {
  const niveles = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const indiceUsuario = niveles.indexOf(nivelUsuario.toUpperCase());
  const indiceRequerido = niveles.indexOf(nivelRequerido.toUpperCase());

  // Si alguno de los niveles no se encuentra, retornar false
  if (indiceUsuario === -1 || indiceRequerido === -1) {
    return false;
  }

  return indiceUsuario >= indiceRequerido;
}

function cumpleRequisitos(usuario, beca) {
  if (!usuarioTieneInformacionCompleta(usuario)) {
    return "Faltan Datos";
  }

  if (beca.requisitos && beca.requisitos.edadMax) {
    const edadUsuario = calcularEdad(usuario.personalData.birthDate);

    if (edadUsuario > beca.requisitos.edadMax) {
      return false;
    }
  }

  // Verificar nacionalidad
  if (beca.paisPostulante && Array.isArray(beca.paisPostulante)) {
    if (!beca.paisPostulante.includes(usuario.personalData.nationality)) {
      return false;
    }
  }

  // Verificar nivel académico mínimo
  if (beca.requisitos && beca.requisitos.nivelAcademicoMin) {
    const nivelUsuario =
      obtenerNivelAcademicoMaximo(usuario.academicData) || "Secundario";

    const niveles = {
      Secundario: 0,
      Grado: 1,
      Licenciatura: 2,
      Maestría: 3,
      Doctorado: 4,
    };

    if (
      niveles[nivelUsuario] > 0 &&
      beca.requisitos.nivelAcademicoMin === "Secundario"
    ) {
      return false;
    }

    if (niveles[nivelUsuario] < niveles[beca.requisitos.nivelAcademicoMin]) {
      return false;
    }
  }

  // Verificar idiomas requeridos
  if (beca.requisitos && beca.requisitos.idiomasRequeridos) {
    const cumpleIdiomas = beca.requisitos.idiomasRequeridos.every(
      (reqIdioma) => {
        const idiomaCumple = usuario.languages.some((idioma) => {
          const coincideIdioma =
            idioma.language.toLowerCase() === reqIdioma.idioma.toLowerCase();
          const cumpleNivel = cumpleNivelIdioma(
            idioma.level,
            reqIdioma.nivelIdioma
          );

          return coincideIdioma && cumpleNivel;
        });

        return idiomaCumple;
      }
    );
    if (!cumpleIdiomas) {
      return false;
    }
  }

  return true;
}
