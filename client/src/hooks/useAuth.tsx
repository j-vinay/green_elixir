// client/src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signup: (payload: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/user", {
        method: "GET",
        credentials: "same-origin", // important for cookies/sessions
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // Optionally: poll or subscribe to auth events. For now fetch once on mount.
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        return { ok: false, message: text || "Login failed" };
      }
      // server should have set session cookie; reload user
      await fetchUser();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? "Network error" };
    }
  };

  const signup = async (payload: { email: string; password: string; firstName?: string; lastName?: string }) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        return { ok: false, message: json?.message || `Signup failed (${res.status})` };
      }
      await fetchUser();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? "Network error" };
    }
  };

  const logout = async () => {
    try {
      // Use POST logout for CSRF safety if server supports it; otherwise GET /api/logout works with OIDC.
      await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {
        // fallback to GET if POST not implemented
        return fetch("/api/logout", { method: "GET", credentials: "same-origin" });
      });
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  const refresh = async () => {
    await fetchUser();
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      signup,
      logout,
      refresh,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
