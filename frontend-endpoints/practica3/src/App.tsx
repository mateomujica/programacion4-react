import { useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";

export default function App() {
  //bajo capot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

      setToken(tokenValue);
    } catch (err) {
      setError(
        "No se pudo conectar con el backend. Revisá que el servidor esté levantado en " +
          import.meta.env.VITE_API_URL,
      );
    }
  }

  //carroceria
  if (token) {
    return <UserList token={token} />;
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
