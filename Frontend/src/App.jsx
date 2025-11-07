import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';

export default function App(){

const { user, logout } = useAuth();

return (
<div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
  
<header style={{ display: 'flex', gap: 12, alignItems: 'center',marginBottom: 16 }}>

<h2>Gestión Académica</h2>

<nav style={{ display: 'flex', gap: 8 }}>
<Link to="/alumnos">Alumnos</Link>
<Link to="/materias">Materias</Link>
<Link to="/notas">Notas</Link>
</nav>

<div style={{ marginLeft: 'auto' }}> {user ? (

<>
<span style={{ marginRight: 8 }}>Hola, {user.nombre}</span>
<button onClick={logout}>Salir</button>
</>

) : (
  
<>
<Link to="/login">Login</Link>
{' · '}
<Link to="/register">Registro</Link>
</>

)}

</div>
</header>
<Outlet />
</div>

);
}


