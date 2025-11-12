import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import MateriaForm from '../componentes/MateriaForm.jsx';
import Modal from '../componentes/Modal.jsx';
import './Toast.css'

export default function Materias() {
  const { token } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const data = await apiFetch('/materias', { token });
      setMaterias(data.data);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showMessage = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const create = async (payload) => {
    try {
      await apiFetch('/materias', { method: 'POST', token, body: payload });
      load();
      showMessage('✅ Materia agregada correctamente');
    } catch (e) {
      setErr(e.message);
    }
  };

  const update = async (id, payload) => {
    try {
      await apiFetch(`/materias/${id}`, { method: 'PUT', token, body: payload });
      setEditing(null);
      load();
      showMessage('✅ Materia actualizada');
    } catch (e) {
      setErr(e.message);
    }
  };

  const del = async (id) => {
    if (!confirm('¿Eliminar materia?')) return;
    try {
      await apiFetch(`/materias/${id}`, { method: 'DELETE', token });
      load();
      showMessage('🗑️ Materia eliminada');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h3>Materias</h3>
      {err && <small style={{ color: 'crimson' }}>{err}</small>}

      {msg && (
        <div className="toast-popup">
          <p>{msg}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h4>Agregar Nueva Materia</h4>
          <MateriaForm onSubmit={create} />
        </div>

        <div>
          <h4>Listado de Materias</h4>
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
              {materias.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.nombre}</td>
                  <td>{m.codigo}</td>
                  <td>{m.año}</td>
                  <td>
                    <div className="acciones">
                      <button className="editar" onClick={() => setEditing(m)}>Editar</button>
                      <button className="eliminar" onClick={() => del(m.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <Modal title="Editar Materia" onClose={() => setEditing(null)}>
          <MateriaForm
            initial={editing}
            onSubmit={(p) => update(editing.id, p)}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
