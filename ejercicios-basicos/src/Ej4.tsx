import { useState } from "react";

export default function Ej4() {
  const [celsius, setCelsius] = useState("");
  const fahrenheit = (Number(celsius) * 9) / 5 + 32;

  return (
    <div>
      <input
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        placeholder="Grados Celsius"
      />
      <h1>{fahrenheit.toFixed(1)} °F</h1>
      {Number(celsius) > 30 && <p>Hace calor</p>}
    </div>
  );
}