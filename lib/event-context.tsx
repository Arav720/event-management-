"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { Event, Registration, EventCategory } from "./types";
import { mockEvents } from "./mock-data";
import * as api from "./api";
import type { BackendEvent } from "./api";

interface EventContextType {
  events: Event[];
  registrations: Registration[];
  addEvent: (event: Omit<Event, "id" | "registered" | "status">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string, userId: string) => Promise<boolean>;
  cancelRegistration: (eventId: string, userId: string) => void;
  getEventById: (id: string) => Event | undefined;
  getEventsByOrganizer: (organizerId: string) => Event[];
  getUserRegistrations: (userId: string) => Registration[];
  isUserRegistered: (eventId: string, userId: string) => boolean;
  loadEvents: () => Promise<void>;
  loadMyEvents: () => Promise<void>;
  loadMyRegistrations: () => Promise<void>;
  isLoading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Helper to safely convert category string to EventCategory type
function convertCategory(category: string): EventCategory {
  const validCategories: EventCategory[] = [
    "conference",
    "workshop",
    "meetup",
    "seminar",
    "webinar",
    "social",
    "other"
  ];
  const lowerCategory = category.toLowerCase() as EventCategory;
  return validCategories.includes(lowerCategory) ? lowerCategory : "other";
}

// Helper to convert backend event to frontend Event type
function convertBackendEvent(backendEvent: BackendEvent): Event {
  return {
    id: backendEvent._id,
    title: backendEvent.title,
    description: backendEvent.description,
    date: new Date(backendEvent.date).toISOString().split('T')[0],
    time: backendEvent.time,
    location: backendEvent.location,
    category: convertCategory(backendEvent.category),
    capacity: backendEvent.resisteredUsers?.length + 100 || 100, // Estimate capacity
    registered: backendEvent.resisteredUsers?.length || 0,
    image: backendEvent.image,
    organizerId: typeof backendEvent.organizer === 'string' ? backendEvent.organizer : backendEvent.organizer?._id,
    organizerName: typeof backendEvent.organizer === 'string' ? 'Organizer' : backendEvent.organizer?.name || 'Organizer',
    status: new Date(backendEvent.date) > new Date() ? "upcoming" : "completed",
    price: backendEvent.price || 0,
    tags: [],
  };
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useBackend, setUseBackend] = useState(false);

  // Check if we should use backend on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUseBackend(true);
      loadEvents();
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const backendEvents = await api.getAllEvents();
      const convertedEvents = backendEvents.map(convertBackendEvent);
      setEvents(convertedEvents);
      setUseBackend(true);
    } catch (error) {
      console.error("Failed to load events:", error);
      // Fall back to mock data
      setUseBackend(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMyEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const backendEvents = await api.getMyEvents();
      const convertedEvents = backendEvents.map(convertBackendEvent);
      setEvents(convertedEvents);
    } catch (error) {
      console.error("Failed to load my events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMyRegistrations = useCallback(async () => {
    try {
      setIsLoading(true);
      const backendEvents = await api.getMyRegisteredEvents();
      const convertedEvents = backendEvents.map(convertBackendEvent);
      setEvents(convertedEvents);
    } catch (error) {
      console.error("Failed to load registered events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEvent = useCallback(
    async (event: Omit<Event, "id" | "registered" | "status">) => {
      if (useBackend) {
        try {
          const formData = new FormData();
          formData.append("title", event.title);
          formData.append("description", event.description);
          formData.append("date", event.date);
          formData.append("location", event.location);
          formData.append("category", event.category);
          formData.append("time", event.time);
          formData.append("price", String(event.price));
          // Note: Image upload would need to be handled separately
          
          const result = await api.createEvent(formData);
          const newEvent = convertBackendEvent(result.event);
          setEvents((prev) => [...prev, newEvent]);
        } catch (error) {
          console.error("Failed to create event:", error);
          throw error;
        }
      } else {
        const newEvent: Event = {
          ...event,
          id: String(Date.now()),
          registered: 0,
          status: "upcoming",
        };
        setEvents((prev) => [...prev, newEvent]);
      }
    },
    [useBackend]
  );

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    if (useBackend) {
      try {
        await api.deleteEvent(id);
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setRegistrations((prev) => prev.filter((r) => r.eventId !== id));
      } catch (error) {
        console.error("Failed to delete event:", error);
        throw error;
      }
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setRegistrations((prev) => prev.filter((r) => r.eventId !== id));
    }
  }, [useBackend]);

  const registerForEvent = useCallback(
    async (eventId: string, userId: string) => {
      if (useBackend) {
        try {
          await api.registerForEvent(eventId);
          // Reload events to get updated registration count
          await loadEvents();
          return true;
        } catch (error) {
          console.error("Failed to register for event:", error);
          return false;
        }
      } else {
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
      }
    },
    [events, registrations, useBackend, loadEvents]
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
        loadEvents,
        loadMyEvents,
        loadMyRegistrations,
        isLoading,
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
