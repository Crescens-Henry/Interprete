import React, { useState } from "react";
import Monaco from "@monaco-editor/react";
import CodeBugDocs from "../components/CodeBugDocs";

function Home() {
  const [codigo, setCodigo] = useState("");
  const [resul, setResul] = useState([]);
  const [esValido, setEsValido] = useState(null);

  function handleValidarClick() {
    analizarCodigo();
  }

  const analizarCodigo = () => {
    const cadenaS = codigo.replace(/\s/g, "");
    const { esValida, infoPila } = validacion(cadenaS);
    setEsValido(esValida);
    setResul(infoPila);
  };

  function setEditorTheme(monaco) {
    monaco.editor.defineTheme("codebug", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#141417",
        "editor.lineHighlightBackground": "#FFFFFF0F",
      },
    });
  }
  return (
    <>
      <div className="title">
        <h1>CodeBug</h1>
        <h2>Crescencio Perez Santiz</h2>
      </div>
      <div className="area">
        <Monaco
          beforeMount={setEditorTheme}
          width="800"
          height="50vh"
          language="javascript"
          theme="codebug"
          value={codigo}
          options={{
            selectOnLineNumbers: false,
            mouseStyle: "text",
            acceptSuggestionOnEnter: "off",
            quickSuggestions: false,
          }}
          onChange={(newValue) => {
            console.log("Valor:", newValue);
            setCodigo(newValue);
          }}
        />
        <div className="line-validator">
          <button onClick={handleValidarClick}>Validar Código</button>
          {esValido !== null && <p>{esValido ? "válida" : "inválida"}</p>}
        </div>
      </div>
      <div style={{ marginLeft: "25px" }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {resul.map((info, index) => (
            <li key={index} style={{ marginTop: "1cm" }}>
              {info}
            </li>
          ))}
        </ul>
      </div>

      <CodeBugDocs />
    </>
  );
}

function validacion(codigo) {
  let pila = ["$"];
  let contador = 0;
  let infoPila = [];

  pila[1] = "A";

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
      if (a === ";") {
        break;
      }
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
    A: ["T", "N"],
    T: ["l", "e", "t", "N"],
    N: ["L", "R"],

    M: ["[", "E", "]", ";"],
    E: ["D", "C"],
    C: siguiente === "," ? ["X"] : ["ε"],
    X: siguiente === "," ? [",", "D", "C"] : ["ε"],
    COMA: [","],

    R: /[a-z]/.test(siguiente) ? ["L", "R"] : ["M"],
    L: /[a-z]/.test(siguiente) ? [siguiente] : ["ε"],
    D: /[0-9]/.test(siguiente) ? [siguiente] : null,
    PUNTO_Y_COMA: [";"],
  };

  return producciones[noTerminal];
}

export default Home;
