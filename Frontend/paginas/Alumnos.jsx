import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import AlumnoForm from '../components/AlumnoForm.jsx';

export default function Alumnos(){
const { token } = useAuth();
const [items, setItems] = useState([]);
const [editing, setEditing] = useState(null);
const [err, setErr] = useState('');


const load = async () => {

try {
const data = await apiFetch('/alumnos', { token });
setItems(data.data);
} catch (e) { setErr(e.message); }
};

useEffect(()=>{ 
load(); 
}, []);

const create = async (payload) => {

try { await apiFetch('/alumnos', { method:'POST', token, body:payload });
load(); 
}
catch(e){ setErr(e.message); }
};

const update = async (id, payload) => {

try { await apiFetch(`/alumnos/${id}`, { method:'PUT', token, body:payload }); 
setEditing(null); 
load(); 
}
catch(e){ setErr(e.message); }
};

const del = async (id) => {
if (!confirm('¿Eliminar alumno?')) return;

try { await apiFetch(`/alumnos/${id}`, { method:'DELETE', token });
load(); 
}
catch(e){ setErr(e.message); }
};

return (
  <div>
    <h3>Alumnos</h3>

    {err && <small style={{ color: 'crimson' }}>{err}</small>}

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

      {/* --- Formulario Nuevo --- */}
      <div>
        <h4>Nuevo</h4>
        <AlumnoForm onSubmit={create} />
      </div>

      {/* --- Listado de Alumnos --- */}
      <div>
        <h4>Listado</h4>
        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nombre}</td>
                <td>{a.apellido}</td>
                <td>{a.dni}</td>
                <td>
                  <button onClick={() => setEditing(a)}>Editar</button>
                  <button onClick={() => del(a.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- Formulario de Edición --- */}
        {editing && (
          <div style={{ marginTop: 8 }}>
            <h4>Editar</h4>
            <AlumnoForm
              initial={editing}
              onSubmit={(p) => update(editing.id, p)}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);
}
