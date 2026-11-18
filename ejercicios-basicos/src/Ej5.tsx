import { useState } from "react";

export default function Ej5() {
  const [texto, setTexto] = useState("");
  const [items, setItems] = useState<{ id: number; nombre: string }[]>([]);

  const agregar = () => {
    if (texto.trim() === "") return;
    setItems([...items, { id: Date.now(), nombre: texto }]);
    setTexto("");
  };

 const eliminar = (id: number) => {
  setItems(items.filter((item) => item.id !== id));
};

  return (
    <div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej: fideos"
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {items.length === 0 ? (
        <p>No hay nada para comprar</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.nombre}{" "}
              <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}