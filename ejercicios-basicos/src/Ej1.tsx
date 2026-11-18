function Producto({ nombre, precio, stock }: { nombre: string; precio: number; stock: number }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", width: "160px" }}>
      <h3>{nombre}</h3>
      <p>${precio}</p>
      <p>{stock === 0 ? "Sin stock" : `Stock: ${stock} unidades`}</p>
    </div>
  );
}

export default function Ej1() {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <Producto nombre="Teclado" precio={45000} stock={12} />
      <Producto nombre="Mouse" precio={18000} stock={0} />
      <Producto nombre="Monitor" precio={320000} stock={3} />
    </div>
  );
}