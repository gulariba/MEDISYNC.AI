'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, tokenStore } from '@/lib/api/client';

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = {
  patient: { email: 'patient@medisync.demo', password: 'Demo@123' },
  doctor:  { email: 'doctor@medisync.demo',  password: 'Demo@123' },
  admin:   { email: 'admin@medisync.demo',   password: 'Demo@123' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Restore session on mount ── */
  useEffect(() => {
    (async () => {
      const token = tokenStore.get();
      if (!token) { setLoading(false); return; }
      try {
        const me = await authApi.me();
        const profile = await fetchProfile(me.role);
        setRole(me.role);
        setUser(buildUser(me, profile));
      } catch {
        tokenStore.remove();
      }
      setLoading(false);
    })();
  }, []);

  /* ── Login with email + password ── */
  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    const { access_token, user: authUser } = res.data;
    tokenStore.set(access_token);

    const profile = authUser.profile || await fetchProfile(authUser.role);
    setRole(authUser.role);
    setUser(buildUser(authUser, profile));
    return { success: true, role: authUser.role };
  }, []);

  /* ── Quick demo login by role ── */
  const loginAs = useCallback(async (demoRole) => {
    const creds = DEMO_ACCOUNTS[demoRole];
    if (!creds) throw new Error('Unknown demo role');
    return login(creds.email, creds.password);
  }, [login]);

  /* ── Register ── */
  const register = useCallback(async ({ email, password, name, role: r }) => {
    const res = await authApi.register(email, password, r || 'patient', name);
    const { access_token, user: authUser } = res.data;
    tokenStore.set(access_token);
    setRole(authUser.role);
    setUser(buildUser(authUser, null));
    return { success: true, role: authUser.role };
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    tokenStore.remove();
    setUser(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, role, loading,
      login, loginAs, register, logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ── Helpers ── */
async function fetchProfile(role) {
  try {
    if (role === 'patient') {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/me`, {
        headers: { Authorization: `Bearer ${tokenStore.get()}` },
      });
      if (r.ok) return (await r.json()).data;
    } else if (role === 'doctor') {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/me`, {
        headers: { Authorization: `Bearer ${tokenStore.get()}` },
      });
      if (r.ok) return (await r.json()).data;
    }
  } catch { /* ignore */ }
  return null;
}

function buildUser(authUser, profile) {
  const name = profile?.name || authUser.profile?.name || authUser.email?.split('@')[0] || 'User';
  return {
    id: authUser.id,
    email: authUser.email,
    role: authUser.role,
    name,
    profileId: profile?.id || authUser.profile?.id,
  };
}

export const useAuth = () => useContext(AuthContext);
