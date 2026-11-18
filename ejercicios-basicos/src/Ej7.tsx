interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean;
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", width: "160px" }}>
      <h3>{nombre}</h3>
      {oferta && <p><strong>¡Oferta!</strong></p>}
      <p>${precio}</p>
      <p>{stock === 0 ? "Sin stock" : `Stock: ${stock}`}</p>
    </div>
  );
}

export default function Ej7() {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <Producto nombre="Teclado" precio={45000} stock={12} oferta={true} />
      <Producto nombre="Mouse" precio={18000} stock={0} />
    </div>
  );
}