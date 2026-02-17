"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { User, Role } from "./types";

// Backend API URL - adjust this to your backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map frontend role to backend role
const roleToBackend = (role: Role): string => {
  return role === "attendee" ? "user" : "organizer";
};

// Map backend role to frontend role
const roleFromBackend = (backendRole: string): Role => {
  return backendRole === "user" ? "attendee" : "organizer";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: roleFromBackend(data.user.role),
        };

        setUser(userData);
        setToken(data.token);
        
        // Store in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: Role) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: roleToBackend(role),
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const userData: User = {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: roleFromBackend(data.user.role),
          };

          setUser(userData);
          setToken(data.token);
          
          // Store in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(userData));
          
          setIsLoading(false);
          return true;
        }

        setIsLoading(false);
        return false;
      } catch (error) {
        console.error("Registration error:", error);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
