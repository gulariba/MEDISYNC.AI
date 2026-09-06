'use client';
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const login = (email) => { setUser({ email, name: 'Sarah Khan', id: 'p1' }); setRole('patient'); return true; };
  const loginAs = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'patient') setUser({ name: 'Sarah Khan', email: 'sarah.khan@email.com', id: 'p1' });
    else if (demoRole === 'doctor') setUser({ name: 'Dr. Ahmed Khan', email: 'ahmed.khan@hospital.com', id: 'd1' });
    else if (demoRole === 'admin') setUser({ name: 'Admin User', email: 'admin@medisync.com', id: 'admin1' });
  };
  const logout = () => { setUser(null); setRole(null); };
  return <AuthContext.Provider value={{ user, role, login, loginAs, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
