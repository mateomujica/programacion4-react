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
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        const data = await respuesta.json().catch(() => ({}));
        if (!respuesta.ok) {
          setError(
            typeof data?.detail === "string" ? data.detail : "No autorizado."
          );
          return;
        }
        setUsers(data);
      })
      .catch(() => {
        setError("No se pudo consultar la lista de usuarios.");
      });
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

  if (error) return <p>{error}</p>;

  return (
    <div>
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