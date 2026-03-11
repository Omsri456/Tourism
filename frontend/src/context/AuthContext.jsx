import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Restore full user data from localStorage (saved on login/register)
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser({ authenticated: true });
        }
      } else {
        setUser({ authenticated: true });
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    const userToStore = userData || { authenticated: true };
    setUser(userToStore);
    localStorage.setItem('token', newToken);
    // Persist full user data so it survives page refresh
    localStorage.setItem('user', JSON.stringify(userToStore));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
