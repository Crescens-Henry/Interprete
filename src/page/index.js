console.log("Por favor, ingresa la cadena que deseas validar:");
process.stdin.setEncoding("utf8");
process.stdin.on("data", function (data) {
  const cadenaS = data.trim();

  const { esValida, infoPila } = validacion(cadenaS);

  console.log("La cadena ingresada es válida:", esValida);
  console.log("Información de la pila:");
  infoPila.forEach((info) => console.log(info));

  process.exit();
});

function validacion(codigo) {
  let pila = ["$"];
  let contador = 0;
  let infoPila = [];

  pila[1] = "S";

  const pushInfo = (X) => {
    infoPila.push(`Push: ${X} -- ${codigo.slice(contador)}`);
  };

  const popInfo = (X) => {
    infoPila.push(`Pop: ${X} --  ${codigo.slice(contador)}`);
  };

  while (pila.length > 0) {
    const X = pila.pop();

    if (!X) {
      break;
    }

    const a = codigo[contador];

    if (X === "$") {
      infoPila.push("Completo.");
      break;
    }

    if (X === a) {
      contador++;
    } else if (esNoTerminal(X)) {
      const produccion = obtenerProduccion(X, a);

      if (produccion) {
        pushInfo(X);
        if (produccion[0] !== "ε") {
          for (let i = produccion.length - 1; i >= 0; i--) {
            pila.push(produccion[i]);
          }
        }
      } else {
        infoPila.push(
          `Error: No se pudo encontrar una producción válida para ${X}.`
        );
        return { esValida: false, infoPila };
      }
    } else {
      popInfo(X);
      return { esValida: false, infoPila };
    }
  }

  return { esValida: contador === codigo.length, infoPila };
}

function esNoTerminal(simbolo) {
  return /[A-Z]/.test(simbolo);
}

function obtenerProduccion(noTerminal, siguiente) {
  const producciones = {
    S: ["I", "V"],
    V: ["v", "a", "r", "T"],
    //T:['TIPO','G'],
    G: ["N", "O"],
    N: ["L", "R", "IGUAL"],
    O: ["TAKEDATA", "P"],
    P: ["(", ")", "F"],

    IGUAL: ["="],
    T:
      siguiente === "i"
        ? ["i", "n", "t", "G"]
        : siguiente === "f"
        ? ["f", "l", "o", "a", "t", "G"]
        : siguiente === "s"
        ? ["s", "t", "r", "i", "n", "g", "G"]
        : null,

    TAKEDATA: ["t", "a", "k", "e", "D", "a", "t", "a"],

    I: ["{"],
    F: ["}"],
    R: /[a-z]/.test(siguiente) ? ["L", "R"] : ["ε"],
    L: /[a-z]/.test(siguiente) ? [siguiente] : null,
  };

  return producciones[noTerminal];
}
