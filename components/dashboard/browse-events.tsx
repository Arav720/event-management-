"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { Event, EventCategory } from "@/lib/types";
import EventCard from "../events/event-card";
import EventDetailModal from "../events/event-detail-modal";
import { Search, SlidersHorizontal, Calendar } from "lucide-react";

const allCategories: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "seminar", label: "Seminar" },
  { value: "webinar", label: "Webinar" },
  { value: "social", label: "Social" },
];

export default function BrowseEvents() {
  const { user } = useAuth();
  const { events, registerForEvent, cancelRegistration, isUserRegistered } =
    useEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "all"
  >("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRegister = (eventId: string) => {
    if (!user) return;
    const success = registerForEvent(eventId, user.id);
    if (success) {
      showToast("Successfully registered! 🎉");
    } else {
      showToast("Registration failed. Event may be full.");
    }
  };

  const handleCancelRegistration = (eventId: string) => {
    if (!user) return;
    cancelRegistration(eventId, user.id);
    showToast("Registration cancelled.");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Browse Events</h1>
        <p className="text-sm text-muted mt-1">
          Discover and register for upcoming events.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name, location, or tag..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal className="w-4 h-4 text-muted flex-shrink-0" />
          {allCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted hover:text-foreground hover:bg-secondary-hover"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Calendar className="w-12 h-12 text-muted/30 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No events found
          </h3>
          <p className="text-sm text-muted">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const registered = user
              ? isUserRegistered(event.id, user.id)
              : false;
            return (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
                actionLabel={registered ? "Registered ✓" : "Register"}
                onAction={() =>
                  registered
                    ? handleCancelRegistration(event.id)
                    : handleRegister(event.id)
                }
                actionVariant={registered ? "secondary" : "primary"}
              />
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedEvent && user && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isRegistered={isUserRegistered(selectedEvent.id, user.id)}
          onRegister={() => handleRegister(selectedEvent.id)}
          onCancelRegistration={() =>
            handleCancelRegistration(selectedEvent.id)
          }
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
