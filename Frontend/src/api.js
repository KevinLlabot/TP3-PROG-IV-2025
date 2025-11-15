const API_URL = 'http://localhost:3000/api';

// Función para realizar llamadas a la API
export const apiFetch = async (path, { method = 'GET', body, token } = {}) => {
    
const headers = { 'Content-Type': 'application/json' };

if (token) headers.Authorization = `Bearer ${token}`;

const res = await fetch(`${API_URL}${path}`, {
method, headers,
body: body ? JSON.stringify(body) : undefined
});

const data = await res.json().catch(() => ({}));

if (!res.ok) {
const msg = data?.error || data?.errors?.map(e=>e.msg).join(', ') ||
'Error de red';
throw new Error(msg);
}

return data;

};
