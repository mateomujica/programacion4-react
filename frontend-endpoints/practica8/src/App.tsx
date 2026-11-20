import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";

interface CurrentUser {
  id: number;
  name: string;
  roles: { name: string }[] | string[];
}

function getUserIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const candidate =
      payload.id ??
      payload.user_id ??
      (isNaN(Number(payload.sub)) ? null : payload.sub);
    return candidate !== null && candidate !== undefined
      ? Number(candidate)
      : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  function handleUnauthorized() {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    setError("Tu sesión venció");
  }

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setCurrentUser(data);
        }
      })
      .catch(() => {});
  }, [token]);

  async function handleSubmit(evento: SubmitEvent) {
    evento?.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Completa email y contraseña.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof data?.detail === "string"
            ? data.detail
            : "Credenciales inválidas.";
        setError(message);
        return;
      }

      const tokenValue = data?.token ?? data?.access_token;

      if (!tokenValue) {
        setError("La API no devolvió un token válido.");
        return;
      }

      localStorage.setItem("token", tokenValue);
      setToken(tokenValue);
    } catch (err) {
      setError(
        "No se pudo conectar con el backend. Revisá que el servidor esté levantado en " +
          import.meta.env.VITE_API_URL
      );
    }
  }

  if (token) {
    const rolesTexto = currentUser?.roles
      ?.map((r) => (typeof r === "string" ? r : r.name))
      .join(", ");

    return (
      <div>
        {currentUser && (
          <h2>
            Hola, {currentUser.name} ({rolesTexto})
          </h2>
        )}
        <UserList token={token} onUnauthorized={handleUnauthorized} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Ingresar</button>
      {error && <p>{error}</p>}
    </form>
  );
}