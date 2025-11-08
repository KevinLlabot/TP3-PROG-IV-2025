import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import './App.css';

export default function App(){

const { user, logout } = useAuth();

return (
<div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
  
<header
  style={{
    display: 'flex',
    flexDirection: 'column',   // 👈 hace que el título y el nav estén uno abajo del otro
    alignItems: 'center',      // 👈 centra ambos horizontalmente
    gap: 8,
    marginBottom: 16,
  }}
>
  <h2
    style={{
      color: '#2ecc71',
      fontWeight: 'bold',
      fontFamily: '"Segoe UI", Arial, sans-serif',
      letterSpacing: '1px',
      textShadow: '0 0 8px rgba(46, 204, 113, 0.5)',
      transition: 'transform 0.3s ease, text-shadow 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.textShadow = '0 0 15px rgba(46, 204, 113, 0.8)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
      e.target.style.textShadow = '0 0 8px rgba(46, 204, 113, 0.5)';
    }}
  >
    Gestión Académica
  </h2>

  <nav style={{ display: 'flex', gap: 20 }}>
    <Link to="/alumnos">Alumnos</Link>
    <Link to="/materias">Materias</Link>
    <Link to="/notas">Notas</Link>
  </nav>

  <div style={{ position: 'absolute', top: 16, right: 32 }}>
    {user ? (
      <>
        <span className="user-greeting">Hola, {user.nombre}</span>
        <button onClick={logout}>Salir</button>
      </>
    ) : (
      <>
    <nav className="auth-links">  
        <Link to="/login">Login</Link> 
        {' | '}
        <Link to="/register">Registro</Link>
    </nav>
        
      </>
    )}
  </div>
</header>
<Outlet />
</div>

);
}


