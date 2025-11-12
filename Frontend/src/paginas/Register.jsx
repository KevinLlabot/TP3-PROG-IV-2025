import { useState } from 'react';
import { apiFetch } from '../api.js';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (nombre.trim().length < 3) return setErr('Nombre muy corto');
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return setErr('Email inválido');
    if (password.length < 8) return setErr('Min 8 caracteres');

    try {
      await apiFetch('/auth/registro', {
        method: 'POST',
        body: { nombre, email, password },
      });

      setMsg(`✅ Usuario creado con éxito. Ahora podés iniciar sesión.`);
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gap: 10,
        maxWidth: 380,
        margin: '0 auto',
        backgroundColor: '#1e6f5c',
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        color: 'white',
      }}
    >
      <h3
        style={{
          color: '#00ff9d',
          textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
          borderLeft: '6px solid #00ff9d',
          paddingLeft: 10,
          marginBottom: 10,
        }}
      >
        Registro
      </h3>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        required
        style={{
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #00ff9d',
          outline: 'none',
        }}
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={{
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #00ff9d',
          outline: 'none',
        }}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        style={{
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #00ff9d',
          outline: 'none',
        }}
      />

      {err && (
        <small
          style={{
            color: 'crimson',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {err}
        </small>
      )}

      {msg && (
        <div
          style={{
            color: '#00ff9d',
            backgroundColor: 'rgba(0, 255, 157, 0.1)',
            border: '1px solid #00ff9d',
            borderRadius: 8,
            padding: '8px 10px',
            textAlign: 'center',
            fontWeight: 'bold',
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          {msg}
        </div>
      )}

      <button
        style={{
          backgroundColor: '#00cc76',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 0',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 0 #000',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#00e693')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#00cc76')}
      >
        Crear cuenta
      </button>
    </form>
  );
}
