import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dd_user'));
    } catch {
      return null;
    }
  });

  const login = useCallback((userPayload) => {
    setUser(userPayload);
    localStorage.setItem('dd_user', JSON.stringify(userPayload));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dd_user');
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
