import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we establish a /api/auth/me route in the future we can fetch real user data here
    // For now we will decode the basic state or just rely on the token presence
    if (token) {
        // Mock user object for UI purposes based on token existence
        setUser({ authenticated: true });
        localStorage.setItem('token', token);
    } else {
        setUser(null);
        localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData || { authenticated: true });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
