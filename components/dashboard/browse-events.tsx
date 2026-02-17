"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { Event, EventCategory } from "@/lib/types";
import EventCard from "../events/event-card";
import EventDetailModal from "../events/event-detail-modal";
import { Search, SlidersHorizontal, Calendar, Sparkles } from "lucide-react";

const allCategories: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "All Events" },
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
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredEvents = events.filter((event) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      event.title.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q) ||
      event.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRegister = (eventId: string) => {
    // Use guest user ID if not logged in
    const userId = user?.id || "guest";
    const success = registerForEvent(eventId, userId);
    if (success) showToast("Registered successfully! 🎉");
    else showToast("Registration failed. Event may be full.");
  };

  const handleCancel = (eventId: string) => {
    // Use guest user ID if not logged in
    const userId = user?.id || "guest";
    cancelRegistration(eventId, userId);
    showToast("Registration cancelled.");
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discover Events</h1>
            <p className="text-sm text-muted">Find and register for amazing upcoming events.</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, locations, tags..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <SlidersHorizontal className="w-4 h-4 text-muted shrink-0" />
          {allCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:border-muted/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted mb-4">
        {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Calendar className="w-14 h-14 text-muted/20 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-1">No events found</h3>
          <p className="text-sm text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event, i) => {
            const registered = user ? isUserRegistered(event.id, user.id) : false;
            return (
              <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <EventCard
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                  actionLabel={registered ? "Registered ✓" : "Register"}
                  onAction={() =>
                    registered ? handleCancel(event.id) : handleRegister(event.id)
                  }
                  actionVariant={registered ? "secondary" : "primary"}
                />
              </div>
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
          onCancelRegistration={() => handleCancel(selectedEvent.id)}
        />
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
