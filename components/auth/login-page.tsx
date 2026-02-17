"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/types";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("attendee");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const switchMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError("");
      setIsAnimating(false);
    }, 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const success = login(email, password);
      if (!success) setError("Invalid email or password. Try: alex@example.com or jordan@example.com");
    } else {
      if (!name.trim()) { setError("Name is required"); return; }
      if (!email.trim()) { setError("Email is required"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
      const success = register(name, email, password, role);
      if (!success) setError("An account with this email already exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Eventify</h1>
          <p className="text-muted mt-1 text-sm">
            {isLogin ? "Welcome back! Sign in to continue." : "Create your account to get started."}
          </p>
        </div>

        {/* Card */}
        <div
          className={`bg-card rounded-2xl shadow-sm border border-border p-8 transition-opacity duration-150 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Demo credentials hint */}
          {isLogin && (
            <div className="mb-6 p-3 rounded-xl bg-primary-light text-sm text-primary">
              <p className="font-medium">Demo Accounts:</p>
              <p className="mt-1 text-xs text-muted">
                Organizer: <span className="font-mono">alex@example.com</span> · Attendee: <span className="font-mono">jordan@example.com</span>
              </p>
              <p className="mt-0.5 text-xs text-muted">Any password works</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("attendee")}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      role === "attendee"
                        ? "border-primary bg-primary-light text-primary"
                        : "border-border text-muted hover:border-muted"
                    }`}
                  >
                    Attend Events
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      role === "organizer"
                        ? "border-primary bg-primary-light text-primary"
                        : "border-border text-muted hover:border-muted"
                    }`}
                  >
                    Organize Events
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-muted mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={switchMode}
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
