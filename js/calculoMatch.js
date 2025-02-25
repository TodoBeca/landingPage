function calcularEdad(birthDate) {
  if (!birthDate) {
    console.log("calcularEdad: No se proporcionó fecha de nacimiento.");
    return 0;
  }
  const hoy = new Date();
  const fechaNacimiento = new Date(birthDate);
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  console.log(
    `calcularEdad: Para la fecha ${birthDate}, la edad calculada es ${edad}.`
  );
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
    console.log(
      "obtenerNivelAcademicoMaximo: No se proporcionaron datos académicos."
    );
    return null;
  }

  const maxDegree = academicData.reduce((maxDegree, item, index) => {
    if (index === 0) {
      console.log(
        `obtenerNivelAcademicoMaximo: Inicializando con ${item.degree}.`
      );
      return item.degree;
    }
    console.log(
      `obtenerNivelAcademicoMaximo: Comparando ${item.degree} con ${maxDegree}.`
    );
    return niveles[item.degree] > niveles[maxDegree] ? item.degree : maxDegree;
  }, academicData[0].degree);

  console.log(
    `obtenerNivelAcademicoMaximo: El nivel académico máximo es ${maxDegree}.`
  );
  return maxDegree;
}

function cumpleNivelIdioma(nivelUsuario, nivelRequerido) {
  const niveles = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const indiceUsuario = niveles.indexOf(nivelUsuario.toUpperCase());
  const indiceRequerido = niveles.indexOf(nivelRequerido.toUpperCase());

  console.log(
    `cumpleNivelIdioma: Nivel usuario: ${nivelUsuario} (índice ${indiceUsuario}), Nivel requerido: ${nivelRequerido} (índice ${indiceRequerido})`
  );

  // Si alguno de los niveles no se encuentra, retornar false
  if (indiceUsuario === -1 || indiceRequerido === -1) {
    return false;
  }

  return indiceUsuario >= indiceRequerido;
}

function cumpleRequisitos(usuario, beca) {
  console.log("cumpleRequisitos: Evaluando usuario y beca.");
  console.log("Datos del usuario:", usuario);
  console.log("Datos de la beca:", beca);

  // Verificar edad máxima si es requerida
  if (beca.requisitos && beca.requisitos.edadMax) {
    const edadUsuario = calcularEdad(usuario.personalData.birthDate);
    console.log(
      `cumpleRequisitos: Edad del usuario es ${edadUsuario}, edad máxima requerida es ${beca.requisitos.edadMax}.`
    );
    if (edadUsuario > beca.requisitos.edadMax) {
      console.log("cumpleRequisitos: No cumple con la edad máxima.");
      return false;
    }
  }

  // Verificar nacionalidad
  if (beca.paisPostulante && Array.isArray(beca.paisPostulante)) {
    console.log(
      `cumpleRequisitos: Nacionalidad del usuario: ${usuario.personalData.nationality}. Países permitidos: ${beca.paisPostulante}.`
    );
    if (!beca.paisPostulante.includes(usuario.personalData.nationality)) {
      console.log("cumpleRequisitos: No cumple con la nacionalidad requerida.");
      return false;
    }
  }

  // Verificar nivel académico mínimo
  if (beca.requisitos && beca.requisitos.nivelAcademicoMin) {
    const nivelUsuario = obtenerNivelAcademicoMaximo(usuario.academicData);
    console.log(
      `cumpleRequisitos: Nivel académico del usuario: ${nivelUsuario}. Nivel mínimo requerido: ${beca.requisitos.nivelAcademicoMin}.`
    );
    if (!nivelUsuario) {
      console.log("cumpleRequisitos: No se encontró ningún título académico.");
      return false;
    }

    const niveles = {
      Grado: 1,
      Licenciatura: 2,
      Maestría: 3,
      Doctorado: 4,
    };

    if (niveles[nivelUsuario] < niveles[beca.requisitos.nivelAcademicoMin]) {
      console.log(
        "cumpleRequisitos: El nivel académico del usuario es inferior al requerido."
      );
      return false;
    }
  }

  // Verificar idiomas requeridos
  if (beca.requisitos && beca.requisitos.idiomasRequeridos) {
    const cumpleIdiomas = beca.requisitos.idiomasRequeridos.every(
      (reqIdioma) => {
        console.log(
          `Evaluando idioma requerido: ${reqIdioma.idioma} con nivel mínimo: ${reqIdioma.nivelIdioma}`
        );
        const idiomaCumple = usuario.languages.some((idioma) => {
          const coincideIdioma =
            idioma.language.toLowerCase() === reqIdioma.idioma.toLowerCase();
          const cumpleNivel = cumpleNivelIdioma(
            idioma.level,
            reqIdioma.nivelIdioma
          );
          console.log(
            `Comparando usuario idioma: ${idioma.language} (nivel: ${idioma.level}) -> coincideIdioma: ${coincideIdioma}, cumpleNivel: ${cumpleNivel}`
          );
          return coincideIdioma && cumpleNivel;
        });
        console.log(
          `Resultado para idioma ${reqIdioma.idioma}: ${idiomaCumple}`
        );
        return idiomaCumple;
      }
    );
    if (!cumpleIdiomas) {
      console.log("El usuario no cumple con todos los idiomas requeridos.");
      return false;
    }
  }

  console.log("cumpleRequisitos: El usuario cumple con todos los requisitos.");
  return true;
}
