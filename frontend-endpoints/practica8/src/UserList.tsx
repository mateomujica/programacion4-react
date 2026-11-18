import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";

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

export function UserList({
  token,
  onUnauthorized,
}: {
  token: string;
  onUnauthorized: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [search, setSearch] = useState<string>("");
  const [soloMayores, setSoloMayores] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);

  function cargarUsuarios(filtrarMayores = soloMayores) {
    setLoading(true);
    setError(null);

    const endpoint = filtrarMayores ? "/user_mayores" : "/user";

    fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        if (respuesta.status === 401) {
          onUnauthorized();
          return;
        }
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
    cargarUsuarios(soloMayores);
  }, [token, soloMayores]);

  useEffect(() => {
    if (selectedId === null) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        if (respuesta.status === 401) {
          onUnauthorized();
          return;
        }
        const data = await respuesta.json().catch(() => ({}));
        if (respuesta.ok) {
          setSelectedUser(data);
        }
      })
      .catch(() => {});
  }, [selectedId, token]);

  function handleBuscar() {
    if (!search.trim()) {
      cargarUsuarios();
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
        if (respuesta.status === 401) {
          onUnauthorized();
          return;
        }
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
    cargarUsuarios();
  }

  async function handleCrearUsuario(e: SubmitEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          email,
          password,
          country_id: Number(countryId),
        }),
      });

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormError(
          typeof data?.detail === "string"
            ? data.detail
            : "Error al crear el usuario."
        );
        return;
      }

      setName("");
      setAge("");
      setEmail("");
      setPassword("");
      setCountryId("1");
      cargarUsuarios();
    } catch {
      setFormError("No se pudo conectar con el servidor.");
    }
  }

  async function handleBorrar(user: User) {
    if (!window.confirm(`¿Seguro que querés borrar a ${user.name}?`)) return;
    setActionError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionError(
          typeof data?.detail === "string"
            ? data.detail
            : "No se pudo borrar el usuario."
        );
        return;
      }

      setUsers(users.filter((u) => u.id !== user.id));
      if (selectedId === user.id) {
        setSelectedId(null);
        setSelectedUser(null);
      }
    } catch {
      setActionError("No se pudo conectar con el servidor.");
    }
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
        <button onClick={() => setSoloMayores(!soloMayores)}>
          {soloMayores ? "Todos" : "Solo mayores"}
        </button>
      </div>

      {actionError && <p>{actionError}</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span
              onClick={() => setSelectedId(user.id)}
              style={{ cursor: "pointer", marginRight: "8px" }}
            >
              {user.name}
            </span>
            <button onClick={() => handleBorrar(user)}>Borrar</button>
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

      <hr />
      <h3>Nuevo usuario</h3>
      <form onSubmit={handleCrearUsuario}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          minLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
        >
          <option value="1">Argentina</option>
          <option value="2">Brasil</option>
        </select>
        <button type="submit">Crear</button>
      </form>
      {formError && <p>{formError}</p>}
    </div>
  );
}