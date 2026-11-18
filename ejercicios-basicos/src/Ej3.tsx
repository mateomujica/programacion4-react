import { useState } from "react";

export default function Ej3() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <h3>Hola Mundo</h3>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "Ocultar respuesta" : "Mostrar respuesta"}
      </button>
      {visible && (
        <p>
          Hola Mundo
        </p>
      )}
    </div>
  );
}