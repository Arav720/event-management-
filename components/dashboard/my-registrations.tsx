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
    console.log('MyRegistrations: User:', user);
    if (user) {
      console.log('MyRegistrations: Loading my registrations for user ID:', user.id);
      loadMyRegistrations();
    }
  }, [user, loadMyRegistrations]);

  const regs = getUserRegistrations(userId);
  console.log('MyRegistrations: Retrieved registrations:', regs);
  const registeredEvents = regs
    .map((r) => {
      const event = getEventById(r.eventId);
      console.log(`MyRegistrations: Registration ${r.id} -> Event`, event);
      return event ? { event, registration: r } : null;
    })
    .filter(Boolean) as { event: Event; registration: typeof regs[0] }[];

  console.log('MyRegistrations: Final registered events to display:', registeredEvents);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registeredEvents.map(({ event, registration }, i) => (
            <div
              key={event.id}
              className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-primary/20 overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all animate-slide-up group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Ticket punch holes effect */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full -ml-2" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full -mr-2" />
              
              {/* Ticket content */}
              <div className="p-6">
                {/* Header with QR code placeholder */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-xs font-semibold text-success uppercase tracking-wide">Confirmed</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                      {event.category}
                    </span>
                  </div>
                  
                  {/* QR Code placeholder */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30 shrink-0">
                    <Ticket className="w-8 h-8 text-primary/40" />
                  </div>
                </div>

                {/* Event details */}
                <div className="space-y-3 mb-4 pb-4 border-b border-dashed border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long", month: "long", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted uppercase tracking-wide">Time</p>
                      <p className="font-semibold text-foreground">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted uppercase tracking-wide">Location</p>
                      <p className="font-semibold text-foreground truncate">{event.location}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted mb-0.5">Registration ID</p>
                    <p className="text-xs font-mono font-semibold text-foreground">
                      {registration.id.slice(0, 12).toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-muted mb-0.5">Price</p>
                      <p className="text-sm font-bold text-foreground">
                        {event.price === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          `$${event.price}`
                        )}
                      </p>
                    </div>
                    
                    {cancelConfirm === event.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCancelConfirm(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:bg-secondary transition-colors"
                        >
                          Keep
                        </button>
                        <button
                          onClick={() => handleCancel(event.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-danger text-white hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancelConfirm(event.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-muted hover:text-danger transition-colors group/btn"
                        title="Cancel registration"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
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
