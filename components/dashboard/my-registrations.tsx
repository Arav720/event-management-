"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { Event } from "@/lib/types";
import {
  Calendar,
  Ticket,
  MapPin,
  Clock,
  XCircle,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function MyRegistrations() {
  const { user } = useAuth();
  const {
    getUserRegistrations,
    getEventById,
    cancelRegistration,
    loadMyRegistrations,
  } = useEvents();

  const [toast, setToast] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  // Use guest user ID if not logged in
  const userId = user?.id || "guest";

  // Load registered events on mount
  useEffect(() => {
    if (user) {
      loadMyRegistrations();
    }
  }, [user, loadMyRegistrations]);

  const regs = getUserRegistrations(userId);
  const registeredEvents = regs
    .map((r) => {
      const event = getEventById(r.eventId);
      return event ? { event, registration: r } : null;
    })
    .filter(Boolean) as { event: Event; registration: typeof regs[0] }[];

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancel = (eventId: string) => {
    const userId = user?.id || "guest";
    cancelRegistration(eventId, userId);
    showToast("Registration cancelled.");
    setCancelConfirm(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Tickets</h1>
            <p className="text-sm text-muted">
              {registeredEvents.length} event{registeredEvents.length !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {registeredEvents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Ticket className="w-14 h-14 text-muted/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No tickets yet</h3>
          <p className="text-sm text-muted">Browse events and register to see your tickets here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registeredEvents.map(({ event, registration }, i) => (
            <div
              key={event.id}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-sm transition-all animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Event info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span className="text-xs font-medium text-success">Confirmed</span>
                      <span className="text-xs text-muted">·</span>
                      <span className="text-xs text-muted capitalize px-2 py-0.5 rounded-full bg-secondary">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short", month: "short", day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-50">{event.location}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {event.registered}/{event.capacity} attending
                      </span>
                    </div>
                    <p className="text-[11px] text-muted/60 mt-2">
                      Registered on {new Date(registration.registeredAt).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Price + cancel */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-sm font-bold text-foreground">
                      {event.price === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        `$${event.price}`
                      )}
                    </span>

                    {cancelConfirm === event.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCancelConfirm(null)}
                          className="px-2.5 py-1 rounded-lg text-xs text-muted hover:bg-secondary"
                        >
                          Keep
                        </button>
                        <button
                          onClick={() => handleCancel(event.id)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-danger text-white hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelConfirm(event.id)}
                        className="flex items-center gap-1 text-xs text-muted hover:text-danger transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-toast">
          {toast}
        </div>
      )}
    </div>
  );
}
