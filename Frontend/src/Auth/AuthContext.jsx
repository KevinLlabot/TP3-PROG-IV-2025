import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext();

export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {

const [user, setUser] = useState(()=>
JSON.parse(localStorage.getItem('user')||'null'));
const [token, setToken] = useState(()=> localStorage.getItem('token'));

const login = ({ user, token }) => {

setUser(user); setToken(token);
localStorage.setItem('user', JSON.stringify(user));
localStorage.setItem('token', token);

};

const logout = () => {

setUser(null); setToken(null);
localStorage.removeItem('user');
localStorage.removeItem('token');

};

const value = { user, token, login, logout };

return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
