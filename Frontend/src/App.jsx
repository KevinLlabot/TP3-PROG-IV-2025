import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import './App.css';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
          position: 'relative',
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
            borderBottom: '2px solid #2ecc71',
            paddingBottom: 4,
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

        {user && (
          <nav style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            <Link to="/alumnos">Alumnos</Link>
            <Link to="/materias">Materias</Link>
            <Link to="/notas">Notas</Link>
          </nav>
        )}

        {/* 🔹 Saludo fijo arriba a la derecha */}
        <div
          style={{
            position: 'fixed', // se fija al borde de la ventana, no al header
            top: 20,
            right: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 1000,
          }}
        >
          {user ? (
            <>
              <span
                className="user-greeting"
                style={{
                  color: '#2ecc71',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
                }}
              >
                Hola, {user.nombre}
              </span>
              <button
                onClick={logout}
                style={{
                  backgroundColor: '#2ecc71',
                  border: 'none',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 3px 0 #000',
                  transition: 'all 0.2s ease',
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <nav className="auth-links">
              <Link to="/login">Login</Link>
              {' | '}
              <Link to="/register">Registro</Link>
            </nav>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  );
}


