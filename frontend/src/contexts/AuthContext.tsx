import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, type AuthResponse } from "../services/api";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
    isLoading: true,
    isAuthenticated: false,
  });

  // 初始化时验证 token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    authAPI
      .getMe()
      .then((data) => {
        setState({
          user: data.user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem("token", data.token);
    setState({
      user: data.user,
      token: data.token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authAPI.register({ name, email, password });
    localStorage.setItem("token", data.token);
    setState({
      user: data.user,
      token: data.token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
