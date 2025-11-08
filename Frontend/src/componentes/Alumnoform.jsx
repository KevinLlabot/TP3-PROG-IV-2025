import { useState, useEffect } from 'react';

export default function AlumnoForm({ initial, onSubmit, onCancel }){

const [nombre, setNombre] = useState(initial?.nombre || '');
const [apellido, setApellido] = useState(initial?.apellido || '');
const [dni, setDni] = useState(initial?.dni || '');
const [err, setErr] = useState('');

const handle = (e) => {
e.preventDefault(); 
setErr('');

if (!nombre.trim() || !apellido.trim()) return setErr('Nombre y apellido son obligatorios');
if (!/^\d{7,9}$/.test(dni)) return setErr('DNI inválido');

onSubmit({ nombre, apellido, dni });

};

useEffect(()=>{
  
setNombre(initial?.nombre||'');
setApellido(initial?.apellido||''); 
setDni(initial?.dni||''); 

}, [initial]);

return (
<form onSubmit={handle} style={{ display:'grid', gap:6 }}>

<input value={nombre} onChange={e=>setNombre(e.target.value)}
placeholder="Nombre" required />

<input value={apellido} onChange={e=>setApellido(e.target.value)}
placeholder="Apellido" required />

<input value={dni} onChange={e=>setDni(e.target.value)}
placeholder="DNI" required />

{err && <small style={{color:'crimson'}}>{err}</small>}

<div style={{display:'flex', gap:8}}>
<button type="submit">Guardar</button>
{onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
</div>

</form>
);
}

