import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  age: number;
  country?: { name: string } | string;
  country_id?: number;
  roles: { name: string }[] | string[];
}

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [search, setSearch] = useState<string>("");

  function cargarTodos() {
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        const data = await respuesta.json().catch(() => ({}));
        if (!respuesta.ok) {
          setError(
            typeof data?.detail === "string" ? data.detail : "Error al cargar."
          );
          return;
        }
        setUsers(data);
      })
      .catch(() => {
        setError("No se pudo consultar la lista de usuarios.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    cargarTodos();
  }, [token]);

  useEffect(() => {
    if (selectedId === null) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        const data = await respuesta.json().catch(() => ({}));
        if (respuesta.ok) {
          setSelectedUser(data);
        }
      })
      .catch(() => {});
  }, [selectedId, token]);

  function handleBuscar() {
    if (!search.trim()) {
      cargarTodos();
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `${import.meta.env.VITE_API_URL}/user/search/${encodeURIComponent(
        search
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(async (respuesta) => {
        const data = await respuesta.json().catch(() => ({}));
        if (!respuesta.ok) {
          setError(
            typeof data?.detail === "string" ? data.detail : "Error al buscar."
          );
          return;
        }
        setUsers(data);
      })
      .catch(() => {
        setError("No se pudo realizar la búsqueda.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleLimpiar() {
    setSearch("");
    cargarTodos();
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre"
        />
        <button onClick={handleBuscar}>Buscar</button>
        <button onClick={handleLimpiar}>Limpiar</button>
      </div>

      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedId(user.id)}
            style={{ cursor: "pointer" }}
          >
            {user.name}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>Detalle de {selectedUser.name}</h3>
          <p>Email: {selectedUser.email}</p>
          <p>Edad: {selectedUser.age}</p>
          <p>
            País:{" "}
            {typeof selectedUser.country === "object"
              ? selectedUser.country?.name
              : selectedUser.country ?? selectedUser.country_id}
          </p>
          <p>
            Roles:{" "}
            {selectedUser.roles
              ?.map((r) => (typeof r === "string" ? r : r.name))
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}