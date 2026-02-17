"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import EventCard from "../events/event-card";
import EventDetailModal from "../events/event-detail-modal";
import { Event } from "@/lib/types";
import { Calendar, Trash2 } from "lucide-react";

export default function OrganizerEvents({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const { user } = useAuth();
  const { getEventsByOrganizer, deleteEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!user) return null;

  const myEvents = getEventsByOrganizer(user.id);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (eventId: string) => {
    deleteEvent(eventId);
    showToast("Event deleted.");
    if (selectedEvent?.id === eventId) setSelectedEvent(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Events</h1>
          <p className="text-sm text-muted mt-1">
            Manage events you&apos;ve created.
          </p>
        </div>
        <button
          onClick={() => onNavigate("create")}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all"
        >
          + New Event
        </button>
      </div>

      {myEvents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Calendar className="w-12 h-12 text-muted/30 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No events yet
          </h3>
          <p className="text-sm text-muted mb-4">
            Create your first event to get started.
          </p>
          <button
            onClick={() => onNavigate("create")}
            className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myEvents.map((event) => (
            <div key={event.id} className="relative group">
              <EventCard
                event={event}
                onClick={() => setSelectedEvent(event)}
                showOrganizer={false}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(event.id);
                }}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 text-muted hover:text-danger hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                title="Delete event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          showActions={false}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
