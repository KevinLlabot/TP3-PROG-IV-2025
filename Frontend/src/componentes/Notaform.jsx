import { useState, useEffect } from 'react';

export default function NotaForm({ initial, onSubmit }) {
  const [nota1, setNota1] = useState(initial?.nota1 ?? '');
  const [nota2, setNota2] = useState(initial?.nota2 ?? '');
  const [nota3, setNota3] = useState(initial?.nota3 ?? '');
  const [err, setErr] = useState('');
  const [promedio, setPromedio] = useState(null);

  
  const valid = (v) => v === '' || (!isNaN(v) && v >= 0 && v <= 10);

 
  const calcularPromedio = (n1, n2, n3) => {
    const notas = [n1, n2, n3]
      .map((v) => parseFloat(v))
      .filter((v) => !isNaN(v)); 
    if (notas.length === 0) return null;
    const total = notas.reduce((a, b) => a + b, 0);
    return (total / notas.length).toFixed(2);
  };

  
  useEffect(() => {
    const nuevoPromedio = calcularPromedio(nota1, nota2, nota3);
    setPromedio(nuevoPromedio);
  }, [nota1, nota2, nota3]);

  
  const handle = (e) => {
    e.preventDefault();
    setErr('');

    if (![nota1, nota2, nota3].every(valid)) {
      setErr('Las notas deben ser números entre 0 y 10');
      return;
    }

    onSubmit({
      nota1: nota1 === '' ? null : Number(nota1),
      nota2: nota2 === '' ? null : Number(nota2),
      nota3: nota3 === '' ? null : Number(nota3),
    });
  };

  
  useEffect(() => {
    setNota1(initial?.nota1 ?? '');
    setNota2(initial?.nota2 ?? '');
    setNota3(initial?.nota3 ?? '');
  }, [initial]);

  return (
    <form
      onSubmit={handle}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'flex-start',
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '10px',
        width: 'fit-content',
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={nota1}
          onChange={(e) => setNota1(e.target.value)}
          placeholder="Nota 1"
        />
        <input
          value={nota2}
          onChange={(e) => setNota2(e.target.value)}
          placeholder="Nota 2"
        />
        <input
          value={nota3}
          onChange={(e) => setNota3(e.target.value)}
          placeholder="Nota 3"
        />
        <button type="submit">Guardar notas</button>
      </div>

      {err && <small style={{ color: 'crimson' }}>{err}</small>}

      
      {promedio !== null && (
        <p style={{ marginTop: 6, fontWeight: 'bold' }}>
          Promedio (vista actual): {promedio}
        </p>
      )}
    </form>
  );
}

