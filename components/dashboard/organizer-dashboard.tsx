"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import {
  Calendar,
  Users,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  BarChart3,
  MapPin,
  Clock,
} from "lucide-react";

export default function OrganizerDashboard({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const { user } = useAuth();
  const { getEventsByOrganizer, registrations, loadMyEvents } = useEvents();

  // Use guest user ID if not logged in
  const userId = user?.id || "guest";
  const userName = user?.name || "Guest User";

  // Load organizer's events on mount
  useEffect(() => {
    if (user) {
      loadMyEvents();
    }
  }, [user]);

  const myEvents = getEventsByOrganizer(userId);
  const totalRegistrations = myEvents.reduce((sum, e) => sum + e.registered, 0);
  const totalCapacity = myEvents.reduce((sum, e) => sum + e.capacity, 0);
  const upcomingCount = myEvents.filter((e) => e.status === "upcoming").length;
  const fillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const stats = [
    { label: "Total Events", value: myEvents.length, icon: Calendar, color: "text-primary", bg: "bg-primary-light" },
    { label: "Total Registrations", value: totalRegistrations, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Upcoming", value: upcomingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Fill Rate", value: `${fillRate}%`, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  // Get recent registrations across all organizer events
  const myEventIds = new Set(myEvents.map((e) => e.id));
  const recentRegs = registrations
    .filter((r) => myEventIds.has(r.eventId) && r.status !== "cancelled")
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {userName.split(" ")[0]}!
          </h1>
          <p className="text-muted text-sm mt-1">
            Here&apos;s your event overview at a glance.
          </p>
        </div>
        <button
          onClick={() => onNavigate("create")}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
        >
          <PlusCircle className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted" />
              <h2 className="text-lg font-semibold text-foreground">Your Events</h2>
            </div>
            {myEvents.length > 4 && (
              <button
                onClick={() => onNavigate("events")}
                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Calendar className="w-12 h-12 text-muted/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground mb-1">No events yet</h3>
              <p className="text-sm text-muted mb-4">Create your first event to get started.</p>
              <button
                onClick={() => onNavigate("create")}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all shadow-sm"
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myEvents.slice(0, 4).map((event, i) => {
                const fillPct = (event.registered / event.capacity) * 100;
                return (
                  <div
                    key={event.id}
                    className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-all animate-slide-up cursor-pointer"
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => onNavigate("events")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-sm font-semibold text-foreground truncate">{event.title}</h3>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-30">{event.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Registration count badge */}
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-light">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-bold text-primary">
                            {event.registered}/{event.capacity}
                          </span>
                        </div>
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fillPct > 90 ? "bg-warning" : fillPct > 70 ? "bg-amber-300" : "bg-primary"
                            }`}
                            style={{ width: `${Math.min(fillPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Registrations sidebar */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-muted" />
            <h2 className="text-lg font-semibold text-foreground">Recent Signups</h2>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4">
            {recentRegs.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-muted/20 mx-auto mb-2" />
                <p className="text-sm text-muted">No registrations yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRegs.map((reg) => {
                  const event = myEvents.find((e) => e.id === reg.eventId);
                  return (
                    <div key={reg.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        U
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          User #{reg.userId}
                        </p>
                        <p className="text-[11px] text-muted truncate">
                          {event?.title || "Unknown event"}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted shrink-0">
                        {new Date(reg.registeredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
