import { useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login(){

const { login } = useAuth();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState(''); 

const handleSubmit = async (e) => {

e.preventDefault(); 
setError('');

if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return setError('Email inválido');

if (password.length < 8) return setError('Min 8 caracteres');

try {

const data = await apiFetch('/auth/login', { method: 'POST',  body: {email, password } });

login({ user: data.user, token: data.token });

} catch (e) { setError(e.message); }

};

return (
<form onSubmit={handleSubmit} style={{ display:'grid', gap:8, maxWidth:360 }}>
<h3>Iniciar sesión</h3>

<input value={email} onChange={e=>setEmail(e.target.value)}
placeholder="Email" required />

<input type="password" value={password}
onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" required />

{error && <small style={{color:'crimson'}}>{error}</small>}

<button>Entrar</button>

</form>
);
}


