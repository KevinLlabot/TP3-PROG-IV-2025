import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiFetch } from "../api.js"; 

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
      //Petición al backend
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      
      
      if (!data.success || !data.token || !data.user) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      
      login({ user: data.user, token: data.token });

      
      setMensaje(`🎓 Bienvenido, ${data.user.nombre}`);
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos o error en el servidor");
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
          <h2>{mensaje}</h2>
        </div>
      )}
    </div>
  );
}



