"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { loginApi, registerApi, refreshApi } from "@/lib/authClient";

interface AuthContextType {
  user: { name: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");
    const name = Cookies.get("user_name");
    if (token && name) {
      setUser({ name });
    }
    setLoading(false);

    // Silent refresh interval - every 23 hours
    const interval = setInterval(async () => {
      const rt = Cookies.get("refresh_token");
      if (!rt) return;
      try {
        const data = await refreshApi(rt);
        Cookies.set("access_token", data.accessToken, { expires: 7 });
        Cookies.set("refresh_token", data.refreshToken, { expires: 7 });
        Cookies.set("user_name", data.name, { expires: 7 });
      } catch {
        // Refresh failed — user will be redirected on next protected page load
      }
    }, 23 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    Cookies.set("access_token", data.accessToken, { expires: 7 });
    Cookies.set("refresh_token", data.refreshToken, { expires: 7 });
    Cookies.set("user_name", data.name, { expires: 7 });
    setUser({ name: data.name });
  };

  const register = async (email: string, name: string, password: string) => {
    const data = await registerApi(email, name, password);
    Cookies.set("access_token", data.accessToken, { expires: 7 });
    Cookies.set("refresh_token", data.refreshToken, { expires: 7 });
    Cookies.set("user_name", data.name, { expires: 7 });
    setUser({ name: data.name });
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_name");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
