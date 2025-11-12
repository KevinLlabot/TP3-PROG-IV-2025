import { useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import NotaForm from '../componentes/NotaForm.jsx';

export default function Notas() {
  const { token } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selAlumno, setSelAlumno] = useState('');
  const [selMateria, setSelMateria] = useState('');
  const [detalle, setDetalle] = useState(null);
  const [promedios, setPromedios] = useState([]);
  const [err, setErr] = useState('');

  // Cargar alumnos y materias
  const loadBase = async () => {
    try {
      const [a, m] = await Promise.all([
        apiFetch('/alumnos', { token }),
        apiFetch('/materias', { token }),
      ]);
      setAlumnos(a.data);
      setMaterias(m.data);
    } catch (e) {
      setErr(e.message);
    }
  };

  // Cargar promedios y notas
  const loadPromedios = async () => {
    try {
      const d = await apiFetch('/notas/promedios', { token });
      setPromedios(d.data);
    } catch (e) {
      setErr(e.message);
    }
  };

  // Cargar detalle de notas
  const loadDetalle = async () => {
    setDetalle(null);
    if (!selAlumno || !selMateria) return;
    try {
      const d = await apiFetch(`/notas/${selAlumno}/${selMateria}`, { token });
      setDetalle(d.data);
    } catch {
      setDetalle(null);
    }
  };

  useEffect(() => {
    loadBase();
    loadPromedios();
  }, []);

  useEffect(() => {
    loadDetalle();
  }, [selAlumno, selMateria]);

  // Guardar o actualizar notas
  const handleNotas = async (notas) => {
    try {
      await apiFetch('/notas', {
        method: 'POST',
        token,
        body: {
          alumno_id: Number(selAlumno),
          materia_id: Number(selMateria),
          ...notas,
        },
      });
      await Promise.all([loadDetalle(), loadPromedios()]);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#257a6a',
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
        color: '#fff',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <h3
        style={{
          color: '#00ff9d',
          textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
          border: '2px solid #00ff9d',
          width: 'fit-content',
          padding: '6px 12px',
          borderRadius: 8,
          backgroundColor: 'rgba(0, 255, 157, 0.1)',
          marginBottom: 16,
        }}
      >
        Notas por alumno y materia
      </h3>

      {err && <small style={{ color: 'crimson' }}>{err}</small>}

      {/* --- Selección de alumno y materia --- */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select
          value={selAlumno}
          onChange={(e) => setSelAlumno(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #00ff9d',
            outline: 'none',
            backgroundColor: '#1f6b5c',
            color: 'white',
          }}
        >
          <option value="">Elegí un alumno</option>
          {alumnos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.apellido}, {a.nombre}
            </option>
          ))}
        </select>

        <select
          value={selMateria}
          onChange={(e) => setSelMateria(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #00ff9d',
            outline: 'none',
            backgroundColor: '#1f6b5c',
            color: 'white',
          }}
        >
          <option value="">Elegí una materia</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre} ({m.codigo})
            </option>
          ))}
        </select>
      </div>

      {/* --- Formulario de notas --- */}
      {selAlumno && selMateria && (
        <div
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <NotaForm initial={detalle} onSubmit={handleNotas} />
        </div>
      )}

      {/* --- Tabla de promedios --- */}
      <h4
        style={{
          color: '#00ff9d',
          textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
          borderBottom: '2px solid #00ff9d',
          width: 'fit-content',
          marginBottom: 10,
        }}
      >
        Promedios generales
      </h4>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 10,
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: 'rgba(0, 255, 157, 0.2)' }}>
            <th style={{ padding: 10, borderBottom: '1px solid #00ff9d' }}>Alumno</th>
            <th style={{ padding: 10, borderBottom: '1px solid #00ff9d' }}>Materia</th>
            <th style={{ padding: 10, borderBottom: '1px solid #00ff9d' }}>Nota 1</th>
            <th style={{ padding: 10, borderBottom: '1px solid #00ff9d' }}>Nota 2</th>
            <th style={{ padding: 10, borderBottom: '1px solid #00ff9d' }}>Nota 3</th>
            <th style={{ padding: 10, borderBottom: '1px solid #00ff9d' }}>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {promedios.map((p) => (
            <tr key={`${p.alumno_id}-${p.materia_id}`}>
              <td style={{ padding: 8, borderBottom: '1px solid #005f4d' }}>
                {p.alumno_apellido}, {p.alumno_nombre}
              </td>
              <td style={{ padding: 8, borderBottom: '1px solid #005f4d' }}>
                {p.materia_nombre}
              </td>
              <td>{p.nota1 ?? '—'}</td>
              <td>{p.nota2 ?? '—'}</td>
              <td>{p.nota3 ?? '—'}</td>
              <td>
                <strong>{p.promedio ?? '—'}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


