import { useState } from 'react';
import { apiFetch } from '../api.js';

export default function Register(){

const [nombre, setNombre] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [msg, setMsg] = useState('');
const [err, setErr] = useState('');

const handleSubmit = async (e) => {

e.preventDefault(); 
setErr(''); 
setMsg('');

if (nombre.trim().length < 3) return setErr('Nombre muy corto');
if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return setErr('Email inválido');
if (password.length < 8) return setErr('Min 8 caracteres');

try {

await apiFetch('/auth/register', { method: 'POST', body: { nombre, email, password } });

setMsg('Usuario creado. Ahora podés iniciar sesión.'); 
setNombre(''); 
setEmail(''); 
setPassword('');

} catch (e) { setErr(e.message); }
};

return (
<form onSubmit={handleSubmit} style={{ display:'grid', gap:8, maxWidth:360 }}>

<h3>Registro</h3>

<input value={nombre} onChange={e=>setNombre(e.target.value)}
placeholder="Nombre" required />

<input value={email} onChange={e=>setEmail(e.target.value)}
placeholder="Email" required />

<input type="password" value={password}
onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" required />

{err && <small style={{color:'crimson'}}>{err}</small>}
{msg && <small style={{color:'green'}}>{msg}</small>}
<button>Crear cuenta</button>

</form>
);
}
