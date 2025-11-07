import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import MateriaForm from '../components/MateriaForm.jsx';

export default function Materias() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  //Cargar todas las materias
  const load = async () => {
    try {
      const data = await apiFetch('/materias', { token });
      setItems(data.data);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  //Crear neuva materia
  const create = async (payload) => {
    try {
      await apiFetch('/materias', { method: 'POST', token, body: payload });
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  //Actualizar materia
  const update = async (id, payload) => {
    try {
      await apiFetch(`/materias/${id}`, {
        method: 'PUT',
        token,
        body: payload,
      });
      setEditing(null);
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  //Eliminar materia
  const del = async (id) => {
    if (!confirm('¿Eliminar materia?')) return;
    try {
      await apiFetch(`/materias/${id}`, { method: 'DELETE', token });
      load();
    } catch (e) {
      setErr(e.message);
    }
  };


  return (
    <div>
      <h3>Materias</h3>
      {err && <small style={{ color: 'crimson' }}>{err}</small>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        
        {/* --- Formulario Nueva Materia --- */}
        <div>
          <h4>Nueva</h4>
          <MateriaForm onSubmit={create} />
        </div>

        {/* --- Listado de Materias --- */}
        <div>
          <h4>Listado</h4>
          <table width="100%" border="1" cellPadding="6">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Código</th>
                <th>Año</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.nombre}</td>
                  <td>{m.codigo}</td>
                  <td>{m.año}</td>
                  <td>
                    <button onClick={() => setEditing(m)}>Editar</button>
                    <button onClick={() => del(m.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Formulario de Edicion --- */}
          {editing && (
            <div style={{ marginTop: 8 }}>
              <h4>Editar</h4>
              <MateriaForm
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


