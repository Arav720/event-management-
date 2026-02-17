"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Event, Registration } from "./types";
import { mockEvents } from "./mock-data";

interface EventContextType {
  events: Event[];
  registrations: Registration[];
  addEvent: (event: Omit<Event, "id" | "registered" | "status">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string, userId: string) => boolean;
  cancelRegistration: (eventId: string, userId: string) => void;
  getEventById: (id: string) => Event | undefined;
  getEventsByOrganizer: (organizerId: string) => Event[];
  getUserRegistrations: (userId: string) => Registration[];
  isUserRegistered: (eventId: string, userId: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const addEvent = useCallback(
    (event: Omit<Event, "id" | "registered" | "status">) => {
      const newEvent: Event = {
        ...event,
        id: String(Date.now()),
        registered: 0,
        status: "upcoming",
      };
      setEvents((prev) => [...prev, newEvent]);
    },
    []
  );

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setRegistrations((prev) => prev.filter((r) => r.eventId !== id));
  }, []);

  const registerForEvent = useCallback(
    (eventId: string, userId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (!event || event.registered >= event.capacity) return false;

      const alreadyRegistered = registrations.find(
        (r) => r.eventId === eventId && r.userId === userId && r.status !== "cancelled"
      );
      if (alreadyRegistered) return false;

      const reg: Registration = {
        id: String(Date.now()),
        eventId,
        userId,
        registeredAt: new Date().toISOString(),
        status: "confirmed",
      };
      setRegistrations((prev) => [...prev, reg]);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, registered: e.registered + 1 } : e
        )
      );
      return true;
    },
    [events, registrations]
  );

  const cancelRegistration = useCallback(
    (eventId: string, userId: string) => {
      setRegistrations((prev) =>
        prev.map((r) =>
          r.eventId === eventId && r.userId === userId
            ? { ...r, status: "cancelled" as const }
            : r
        )
      );
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, registered: Math.max(0, e.registered - 1) }
            : e
        )
      );
    },
    []
  );

  const getEventById = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events]
  );

  const getEventsByOrganizer = useCallback(
    (organizerId: string) =>
      events.filter((e) => e.organizerId === organizerId),
    [events]
  );

  const getUserRegistrations = useCallback(
    (userId: string) =>
      registrations.filter(
        (r) => r.userId === userId && r.status !== "cancelled"
      ),
    [registrations]
  );

  const isUserRegistered = useCallback(
    (eventId: string, userId: string) =>
      registrations.some(
        (r) =>
          r.eventId === eventId &&
          r.userId === userId &&
          r.status !== "cancelled"
      ),
    [registrations]
  );

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelRegistration,
        getEventById,
        getEventsByOrganizer,
        getUserRegistrations,
        isUserRegistered,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
}
