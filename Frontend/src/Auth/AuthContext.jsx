import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext();

export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      } else {
        localStorage.removeItem('user'); 
        return null;
      }
    } catch (e) {
      console.error('Error parseando user:', e);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && storedToken !== 'undefined' ? storedToken : null;
  });

  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = { user, token, login, logout };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

