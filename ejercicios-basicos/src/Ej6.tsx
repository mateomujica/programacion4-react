import { useState } from "react";

const LENGUAJES = ["JavaScript", "Java", "Python", "C#", "TypeScript", "C++"];

export default function App() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = LENGUAJES.filter((lenguaje) =>
    lenguaje.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar..."
      />
      <p>{filtrados.length} resultados</p>
      <ul>
        {filtrados.map((lenguaje) => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>
    </div>
  );
}