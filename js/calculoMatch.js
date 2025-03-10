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

function obtenerNivelAcademicoMaximo(academicData) {
  const niveles = {
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
  // Verificar edad máxima si es requerida
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
    const nivelUsuario = obtenerNivelAcademicoMaximo(usuario.academicData);

    if (!nivelUsuario) {
      return false;
    }

    const niveles = {
      Grado: 1,
      Licenciatura: 2,
      Maestría: 3,
      Doctorado: 4,
    };

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

  console.log("cumpleRequisitos: El usuario cumple con todos los requisitos.");
  return true;
}
