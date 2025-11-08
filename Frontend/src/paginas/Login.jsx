import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 Simula una respuesta del backend
      const fakeUser = { nombre: "Kevin", email };
      const fakeToken = "123abc";

      // guarda los datos de sesión en el contexto
      login({ user: fakeUser, token: fakeToken });

      // muestra mensaje de bienvenida
      setMensaje(`✨ Bienvenido, ${fakeUser.nombre}`);
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error en el servidor");
    }
  };

  return (
    <div className="login-container">
      {(!user && !mensaje) ? (
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Iniciar sesión</h3>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <div className="bienvenida fade-in">
          <h2>{mensaje || `✨ Bienvenido, ${user?.nombre || "Usuario"}`}</h2>
        </div>
      )}
    </div>
  );
}

