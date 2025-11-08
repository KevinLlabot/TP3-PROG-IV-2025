import { useState, useEffect } from 'react';

export default function MateriaForm({ initial, onSubmit, onCancel }){

const [nombre, setNombre] = useState(initial?.nombre || '');
const [codigo, setCodigo] = useState(initial?.codigo || '');
const [año, setAño] = useState(initial?.año || 1);
const [err, setErr] = useState('');

const handle = (e) => {

e.preventDefault(); 
setErr('');

if (!nombre.trim() || !/^[a-z0-9]+$/i.test(codigo) || !(año>=1 && año<=6))return setErr('Revise los datos ingresados');
onSubmit({ nombre, codigo, año: Number(año) });
};

useEffect(()=>{ 
  
setNombre(initial?.nombre||'');
setCodigo(initial?.codigo||''); 
setAño(initial?.año||1); 
}, [initial]);

return (

<form onSubmit={handle} style={{ display:'grid', gap:6 }}>

<input value={nombre} onChange={e=>setNombre(e.target.value)}
placeholder="Nombre" required />

<input value={codigo} onChange={e=>setCodigo(e.target.value)}
placeholder="Código" required />

<input type="number" value={año}
onChange={e=>setAño(e.target.value)} placeholder="Año" min={1} max={6}
required />

{err && <small style={{color:'crimson'}}>{err}</small>}

<div style={{display:'flex', gap:8}}>
<button type="submit">Guardar</button>
{onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
</div>

</form>
);
}

