import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser { id: string; email: string; name?: string }
interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("nexus_token");
    if (t) {
      setToken(t);
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } })
        .then(async r => {
          const text = await r.text();
          let d: any = null; try { d = text ? JSON.parse(text) : null; } catch {}
          if (!r.ok) throw new Error(d?.error || text || "Failed");
          return d;
        })
        .then(d => setUser(d.user))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const text = await r.text();
    let d: any = null; try { d = text ? JSON.parse(text) : null; } catch {}
    if (!r.ok) throw new Error(d?.error || text || "Login failed");
    localStorage.setItem("nexus_token", d.token); setToken(d.token); setUser(d.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const r = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const text = await r.text();
    let d: any = null; try { d = text ? JSON.parse(text) : null; } catch {}
    if (!r.ok) throw new Error(d?.error || text || "Register failed");
    localStorage.setItem("nexus_token", d.token); setToken(d.token); setUser(d.user);
  };

  const logout = () => { localStorage.removeItem("nexus_token"); setToken(null); setUser(null); };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
