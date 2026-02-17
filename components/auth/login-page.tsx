"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/types";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CalendarDays, Mic2 } from "lucide-react";

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
      setName("");
      setEmail("");
      setPassword("");
      setIsAnimating(false);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const success = login(email, password);
      if (!success)
        setError("Invalid credentials. Try the demo accounts above.");
    } else {
      if (!name.trim()) { setError("Name is required"); return; }
      if (!email.trim()) { setError("Email is required"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
      const success = register(name, email, password, role);
      if (!success) setError("An account with this email already exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-5">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Eventify</h1>
          <p className="text-muted mt-2 text-sm">
            {isLogin ? "Welcome back! Sign in to your account." : "Create your account to get started."}
          </p>
        </div>

        {/* Card */}
        <div
          className={`bg-card rounded-2xl shadow-sm border border-border p-8 transition-all duration-200 ${
            isAnimating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
          }`}
        >
          {/* Demo hint */}
          {isLogin && (
            <div className="mb-6 p-4 rounded-xl bg-primary-light/60 border border-primary/10">
              <p className="text-sm font-semibold text-primary mb-2">Demo Accounts</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Mic2 className="w-3.5 h-3.5 text-primary/60" />
                  <span>Organizer: <code className="font-mono text-foreground bg-white/60 px-1.5 py-0.5 rounded">alex@example.com</code></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <CalendarDays className="w-3.5 h-3.5 text-primary/60" />
                  <span>Attendee: <code className="font-mono text-foreground bg-white/60 px-1.5 py-0.5 rounded">jordan@example.com</code></span>
                </div>
                <p className="text-xs text-muted/70 mt-1">Any password works</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name - register only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted/50 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selector - register only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">I want to</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("attendee")}
                    className={`group relative p-4 rounded-xl border-2 text-left transition-all ${
                      role === "attendee"
                        ? "border-primary bg-primary-light shadow-sm"
                        : "border-border hover:border-muted/40 bg-background"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                      role === "attendee" ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <CalendarDays className={`w-4 h-4 ${role === "attendee" ? "text-primary" : "text-muted"}`} />
                    </div>
                    <p className={`text-sm font-semibold ${role === "attendee" ? "text-primary" : "text-foreground"}`}>
                      Attend Events
                    </p>
                    <p className="text-xs text-muted mt-0.5">Browse & register</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`group relative p-4 rounded-xl border-2 text-left transition-all ${
                      role === "organizer"
                        ? "border-primary bg-primary-light shadow-sm"
                        : "border-border hover:border-muted/40 bg-background"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                      role === "organizer" ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <Mic2 className={`w-4 h-4 ${role === "organizer" ? "text-primary" : "text-muted"}`} />
                    </div>
                    <p className={`text-sm font-semibold ${role === "organizer" ? "text-primary" : "text-foreground"}`}>
                      Organize Events
                    </p>
                    <p className="text-xs text-muted mt-0.5">Create & manage</p>
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-danger text-sm animate-slide-up">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-muted mt-6">
          {isLogin ? "Don&apos;t have an account?" : "Already have an account?"}{" "}
          <button onClick={switchMode} className="text-primary font-semibold hover:underline">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
