import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Login from './paginas/Login.jsx';
import Register from './paginas/Register.jsx';
import Alumnos from './paginas/Alumnos.jsx';
import Materias from './paginas/Materias.jsx';
import Notas from './paginas/Notas.jsx';
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
