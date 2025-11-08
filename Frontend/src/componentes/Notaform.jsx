import { useState, useEffect } from 'react';

export default function NotaForm({ initial, onSubmit }) {
  const [nota1, setNota1] = useState(initial?.nota1 ?? '');
  const [nota2, setNota2] = useState(initial?.nota2 ?? '');
  const [nota3, setNota3] = useState(initial?.nota3 ?? '');
  const [err, setErr] = useState('');

  //Validacion: permite vacio o numero entre 0 y 10
  const valid = (v) => v === '' || (!isNaN(v) && v >= 0 && v <= 10);

  // Manejo del envío del formlario
  const handle = (e) => {
    e.preventDefault();
    setErr('');

    //Vaildar que todas las notas sean validas
    if (![nota1, nota2, nota3].every(valid)) {
      setErr('Las notas deben ser números entre 0 y 10');
      return;
    }

    //Enviar los datos al componente padre
    onSubmit({
      nota1: nota1 === '' ? null : Number(nota1),
      nota2: nota2 === '' ? null : Number(nota2),
      nota3: nota3 === '' ? null : Number(nota3),
    });
  };

  //Actualizar los campos si cambia la prop "initial"
  useEffect(() => {
    setNota1(initial?.nota1 ?? '');
    setNota2(initial?.nota2 ?? '');
    setNota3(initial?.nota3 ?? '');
  }, [initial]);

 
  return (
    <form
      onSubmit={handle}
      style={{ display: 'flex', gap: 8, alignItems: 'center' }}
    >
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

      {err && <small style={{ color: 'crimson' }}>{err}</small>}

      <button type="submit">Guardar notas</button>
    </form>
  );
}
