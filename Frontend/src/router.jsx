import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Alumnos from './pages/Alumnos.jsx';
import Materias from './pages/Materias.jsx';
import Notas from './pages/Notas.jsx';
import ProtectedRoute from './Auth/protectedRoute.jsx';

export const router = createBrowserRouter([
    { path: '/', element: <App />,
        children: [
        { path: 'login', element: <Login/> },
        { path: 'register', element: <Register/> },
        { path: 'alumnos', element: <ProtectedRoute><Alumnos/></ProtectedRoute> },
        { path: 'materias', element: <ProtectedRoute><Materias/></ProtectedRoute> },
        { path: 'notas', element: <ProtectedRoute><Notas/></ProtectedRoute> },
        ],
    },
]);
