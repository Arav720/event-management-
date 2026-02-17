"use client";

import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import {
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
} from "lucide-react";
import EventCard from "../events/event-card";

export default function OrganizerDashboard({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const { user } = useAuth();
  const { getEventsByOrganizer, events } = useEvents();

  if (!user) return null;

  const myEvents = getEventsByOrganizer(user.id);
  const totalRegistrations = myEvents.reduce((sum, e) => sum + e.registered, 0);
  const totalCapacity = myEvents.reduce((sum, e) => sum + e.capacity, 0);
  const totalRevenue = myEvents.reduce(
    (sum, e) => sum + e.price * e.registered,
    0
  );

  const stats = [
    {
      label: "Total Events",
      value: myEvents.length,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary-light",
    },
    {
      label: "Total Registrations",
      value: totalRegistrations,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Avg. Fill Rate",
      value:
        totalCapacity > 0
          ? `${Math.round((totalRegistrations / totalCapacity) * 100)}%`
          : "0%",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Est. Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user.name.split(" ")[0]}!
        </h1>
        <p className="text-muted text-sm mt-1">
          Here&apos;s an overview of your events and performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border border-border p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted" />
            <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
          </div>
          {myEvents.length > 3 && (
            <button
              onClick={() => onNavigate("events")}
              className="text-sm text-primary font-medium hover:underline"
            >
              View all
            </button>
          )}
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Calendar className="w-12 h-12 text-muted/30 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-1">No events yet</h3>
            <p className="text-sm text-muted mb-4">Create your first event to get started.</p>
            <button
              onClick={() => onNavigate("create")}
              className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showOrganizer={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
