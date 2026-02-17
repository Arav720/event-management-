"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import {
  Calendar,
  Trash2,
  Users,
  MapPin,
  Clock,
  Eye,
  PlusCircle,
  ChevronUp,
} from "lucide-react";

export default function OrganizerEvents({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const { user } = useAuth();
  const { getEventsByOrganizer, deleteEvent, registrations, loadMyEvents } = useEvents();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Use guest user ID if not logged in
  const userId = user?.id || "guest";

  // Load organizer's events on mount
  useEffect(() => {
    if (user) {
      loadMyEvents();
    }
  }, [user]);

  const myEvents = getEventsByOrganizer(userId);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      showToast("Event deleted successfully.");
      setDeleteConfirm(null);
      if (expandedEvent === eventId) setExpandedEvent(null);
    } catch (error) {
      showToast("Failed to delete event.");
    }
  };

  const getEventRegistrations = (eventId: string) => {
    return registrations.filter(
      (r) => r.eventId === eventId && r.status !== "cancelled"
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Events</h1>
          <p className="text-sm text-muted mt-1">
            {myEvents.length} event{myEvents.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <button
          onClick={() => onNavigate("create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
        >
          <PlusCircle className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Empty state */}
      {myEvents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Calendar className="w-14 h-14 text-muted/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No events yet</h3>
          <p className="text-sm text-muted mb-5">Create your first event to get started.</p>
          <button
            onClick={() => onNavigate("create")}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all shadow-sm"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myEvents.map((event, i) => {
            const eventRegs = getEventRegistrations(event.id);
            const fillPct = (event.registered / event.capacity) * 100;
            const isExpanded = expandedEvent === event.id;

            return (
              <div
                key={event.id}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-sm transition-all animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Event row */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          event.status === "upcoming"
                            ? "bg-emerald-50 text-emerald-600"
                            : event.status === "completed"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-amber-50 text-amber-600"
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-xs text-muted capitalize px-2 py-0.5 rounded-full bg-secondary">
                          {event.category}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short", month: "short", day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-45">{event.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Registration counter + actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-light">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">
                          {event.registered}
                        </span>
                        <span className="text-xs text-primary/60">
                          / {event.capacity}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            fillPct > 90 ? "bg-warning" : fillPct > 70 ? "bg-amber-300" : "bg-primary"
                          }`}
                          style={{ width: `${Math.min(fillPct, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-light transition-colors"
                          title="View registrations"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(event.id)}
                          className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded: registrations list */}
                {isExpanded && (
                  <div className="border-t border-border bg-secondary/30 px-5 py-4 animate-slide-up">
                    <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                      Registrations ({eventRegs.length})
                    </h4>
                    {eventRegs.length === 0 ? (
                      <p className="text-sm text-muted py-2">No registrations yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {eventRegs.map((reg) => (
                          <div
                            key={reg.id}
                            className="flex items-center justify-between bg-card rounded-xl px-4 py-2.5 border border-border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
                                U
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  User #{reg.userId}
                                </p>
                                <p className="text-[11px] text-muted">
                                  Registered {new Date(reg.registeredAt).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium capitalize">
                              {reg.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Delete confirm */}
                {deleteConfirm === event.id && (
                  <div className="border-t border-red-100 bg-red-50/50 px-5 py-3 flex items-center justify-between animate-slide-up">
                    <p className="text-sm text-danger font-medium">Delete this event?</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 rounded-lg text-sm text-muted hover:bg-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1.5 rounded-lg text-sm bg-danger text-white hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
