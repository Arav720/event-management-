"use client";

import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import EventCard from "../events/event-card";
import { Calendar, Ticket } from "lucide-react";
import { useState } from "react";
import EventDetailModal from "../events/event-detail-modal";
import { Event } from "@/lib/types";

export default function MyRegistrations() {
  const { user } = useAuth();
  const { getUserRegistrations, getEventById, cancelRegistration, isUserRegistered, registerForEvent } =
    useEvents();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!user) return null;

  const regs = getUserRegistrations(user.id);
  const registeredEvents = regs
    .map((r) => getEventById(r.eventId))
    .filter(Boolean) as Event[];

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancel = (eventId: string) => {
    cancelRegistration(eventId, user.id);
    showToast("Registration cancelled.");
    if (selectedEvent?.id === eventId) setSelectedEvent(null);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Events</h1>
            <p className="text-sm text-muted">
              Events you&apos;ve registered for.
            </p>
          </div>
        </div>
      </div>

      {registeredEvents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Calendar className="w-12 h-12 text-muted/30 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No registrations yet
          </h3>
          <p className="text-sm text-muted">
            Browse events and register to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => setSelectedEvent(event)}
              actionLabel="Cancel Registration"
              onAction={() => handleCancel(event.id)}
              actionVariant="danger"
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isRegistered={isUserRegistered(selectedEvent.id, user.id)}
          onRegister={() => {
            registerForEvent(selectedEvent.id, user.id);
            showToast("Registered! 🎉");
          }}
          onCancelRegistration={() => handleCancel(selectedEvent.id)}
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
