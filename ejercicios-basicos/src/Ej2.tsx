import { useState } from "react";

export default function Ej2() {
  const [valor, setValor] = useState(0);

  const restar = () => {
    if (valor > 0) setValor(valor - 1);
  };

  const sumar = () => {
    if (valor < 10) setValor(valor + 1);
  };

  return (
    <div>
      <h1>{valor}</h1>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={restar} disabled={valor === 0}>-</button>
        <button onClick={sumar} disabled={valor === 10}>+</button>
        <button onClick={() => setValor(0)}>Reiniciar</button>
      </div>
      {valor === 10 && <p>Llegaste al máximo</p>}
    </div>
  );
}