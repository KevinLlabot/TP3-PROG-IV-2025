import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import './App.css';

export default function App() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const enLogin = location.pathname === '/login';
  const enRegister = location.pathname === '/register';
  const enAuth = enLogin || enRegister;
  const mostrarBienvenida = !user && !enAuth;

  return (
    <div
      className={mostrarBienvenida ? 'fondo-animado' : 'fondo-normal'}
      style={{ minHeight: '100vh', padding: 16 }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
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
            className={mostrarBienvenida ? 'titulo-animado' : ''}
            style={{
              color: '#2ecc71',
              fontWeight: 'bold',
              fontFamily: '"Segoe UI", Arial, sans-serif',
              letterSpacing: '1px',
              borderBottom: '2px solid #2ecc71',
              paddingBottom: 4,
              textShadow: '0 0 8px rgba(46, 204, 113, 0.5)',
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

          {/* 🔹 Zona superior derecha */}
          <div
            style={{
              position: 'fixed',
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
              <nav className="auth-links" style={{ display: 'flex', gap: 10 }}>
                {enLogin ? (
                  <>
                    <Link to="/register">Registrarse</Link>
                    <button
                      onClick={() => navigate('/')}
                      style={{
                        background: 'transparent',
                        border: '1px solid #2ecc71',
                        color: '#2ecc71',
                        borderRadius: 6,
                        padding: '2px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      Volver
                    </button>
                  </>
                ) : enRegister ? (
                  <>
                    <Link to="/login">Login</Link>
                    <button
                      onClick={() => navigate('/')}
                      style={{
                        background: 'transparent',
                        border: '1px solid #2ecc71',
                        color: '#2ecc71',
                        borderRadius: 6,
                        padding: '2px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      Volver
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login">Login</Link> | <Link to="/register">Registrarse</Link>
                  </>
                )}
              </nav>
            )}
          </div>
        </header>

        {/* 🔸 Texto de bienvenida */}
        {mostrarBienvenida && (
          <div className="texto-bienvenida">
            <p>
              Bienvenido al sistema de <strong>Gestión Académica</strong>.<br />
              Iniciá sesión o registrate para comenzar a administrar alumnos, materias y notas.
            </p>
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
}




