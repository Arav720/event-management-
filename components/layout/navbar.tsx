"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  LogOut,
  Calendar,
  PlusCircle,
  LayoutDashboard,
  Ticket,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType?: "organizer" | "attendee"; // Add userType prop to determine which tabs to show
}

export default function Navbar({ activeTab, onTabChange, userType = "attendee" }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOrganizer = user?.role === "organizer" || userType === "organizer";

  const tabs = isOrganizer
    ? [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "events", label: "My Events", icon: Calendar },
        { id: "create", label: "Create", icon: PlusCircle },
      ]
    : [
        { id: "browse", label: "Browse", icon: Search },
        { id: "registered", label: "My Tickets", icon: Ticket },
      ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">Eventify</span>
            {user && (
              <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium capitalize">
                {user.role}
              </span>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "text-muted hover:text-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* User */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="text-right mr-1">
                  <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                  <p className="text-[11px] text-muted capitalize">{user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-primary-hover text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-right mr-1">
                <p className="text-sm font-medium text-foreground leading-tight">Guest User</p>
                <p className="text-[11px] text-muted capitalize">{userType}</p>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1 animate-slide-up">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setMobileOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-hover text-white flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-hover text-white flex items-center justify-center text-sm font-bold">
                  G
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Guest User</p>
                  <p className="text-xs text-muted capitalize">{userType}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
