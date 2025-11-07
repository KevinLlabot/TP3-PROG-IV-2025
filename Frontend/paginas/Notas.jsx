import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import NotaForm from '../components/NotaForm.jsx';

export default function Notas() {
  const { token } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selAlumno, setSelAlumno] = useState('');
  const [selMateria, setSelMateria] = useState('');
  const [detalle, setDetalle] = useState(null);
  const [promedios, setPromedios] = useState([]);
  const [err, setErr] = useState('');

  //Cargar alumnos y materias
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

  //Cargar promedios 
  const loadPromedios = async () => {
    try {
      const d = await apiFetch('/notas/promedios', { token });
      setPromedios(d.data);
    } catch (e) {
      setErr(e.message);
    }
  };

  //Cargar detalle de notas de un alumno en una materia
  const loadDetalle = async () => {
    setDetalle(null);
    if (!selAlumno || !selMateria) return;
    try {
      const d = await apiFetch(`/notas/${selAlumno}/${selMateria}`, { token });
      setDetalle(d.data);
    } catch (e) {
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

  //Guardar o actualizar notas
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

  //Calcular promedio (solo vista actual)
  const promedioLocal = useMemo(() => {
    if (!detalle) return null;
    const vals = [detalle.nota1, detalle.nota2, detalle.nota3].filter(
      (v) => v != null && v !== undefined
    );
    if (!vals.length) return null;
    const p = vals.reduce((a, b) => a + b, 0) / vals.length;
    return p.toFixed(2);
  }, [detalle]);

  
  return (
    <div>
      <h3>Notas por alumno y materia</h3>
      {err && <small style={{ color: 'crimson' }}>{err}</small>}

      {/* --- Seleccion de alumno y materia --- */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select
          value={selAlumno}
          onChange={(e) => setSelAlumno(e.target.value)}
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
        >
          <option value="">Elegí una materia</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre} ({m.codigo})
            </option>
          ))}
        </select>
      </div>

      {/* --- Formulario de notas y promedio individual --- */}
      {selAlumno && selMateria && (
        <div>
          <NotaForm initial={detalle} onSubmit={handleNotas} />
          <div style={{ marginTop: 8 }}>
            <strong>Promedio (vista actual):</strong>{' '}
            {promedioLocal ?? '—'}
          </div>
        </div>
      )}

      {/* --- Promedios generales --- */}
      <h4 style={{ marginTop: 24 }}>Promedios generales</h4>
      <table width="100%" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {promedios.map((p) => (
            <tr key={`${p.alumno_id}-${p.materia_id}`}>
              <td>
                {p.alumno_apellido}, {p.alumno_nombre}
              </td>
              <td>{p.materia_nombre}</td>
              <td>{p.promedio ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

