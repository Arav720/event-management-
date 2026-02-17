"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User, Role } from "./types";
import { mockUsers } from "./mock-data";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: Role) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API call delay
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(
    (name: string, email: string, _password: string, role: Role) => {
      setIsLoading(true);
      const exists = mockUsers.find((u) => u.email === email);
      if (exists) {
        setIsLoading(false);
        return false;
      }
      const newUser: User = {
        id: String(Date.now()),
        name,
        email,
        role,
      };
      mockUsers.push(newUser);
      setUser(newUser);
      setIsLoading(false);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
