"use client";

import { Event } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Tag,
  X,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

interface EventDetailModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  isRegistered?: boolean;
  onRegister?: () => void;
  onCancelRegistration?: () => void;
  showActions?: boolean;
}

const categoryColors: Record<string, string> = {
  conference: "bg-blue-50 text-blue-600",
  workshop: "bg-violet-50 text-violet-600",
  meetup: "bg-emerald-50 text-emerald-600",
  seminar: "bg-amber-50 text-amber-600",
  webinar: "bg-cyan-50 text-cyan-600",
  social: "bg-pink-50 text-pink-600",
  other: "bg-gray-50 text-gray-500",
};

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  isRegistered,
  onRegister,
  onCancelRegistration,
  showActions = true,
}: EventDetailModalProps) {
  if (!isOpen) return null;

  const spotsLeft = event.capacity - event.registered;
  const fillPercent = (event.registered / event.capacity) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in">
        {/* Event Image Banner */}
        {event.image && event.image.trim() !== '' && (
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.parentElement?.remove();
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}
        
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-start justify-between z-10">
          <div className="flex-1 pr-4">
            <span
              className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize mb-2 ${
                categoryColors[event.category] || categoryColors.other
              }`}
            >
              {event.category}
            </span>
            <h2 className="text-xl font-bold text-foreground leading-tight">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted hover:text-foreground transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Date</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Time</p>
                <p className="text-sm font-medium text-foreground">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 col-span-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Location</p>
                <p className="text-sm font-medium text-foreground">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <DollarSign className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Price</p>
                <p className="text-sm font-medium text-foreground">
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Organizer</p>
                <p className="text-sm font-medium text-foreground">{event.organizerName}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">About</h3>
            <p className="text-sm leading-relaxed text-muted">{event.description}</p>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted/40" />
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Capacity */}
          <div className="p-4 rounded-xl bg-secondary/40">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted">
                {event.registered} / {event.capacity} registered
              </span>
              <span
                className={`font-semibold ${
                  spotsLeft <= 5 ? "text-danger" : spotsLeft <= 20 ? "text-warning" : "text-success"
                }`}
              >
                {spotsLeft} remaining
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  fillPercent > 90
                    ? "bg-danger"
                    : fillPercent > 70
                    ? "bg-warning"
                    : "bg-primary"
                }`}
                style={{ width: `${Math.min(fillPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="pt-1">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">You&apos;re registered for this event!</span>
                  </div>
                  {onCancelRegistration && (
                    <button
                      onClick={onCancelRegistration}
                      className="w-full py-2.5 rounded-xl bg-red-50 text-danger text-sm font-medium hover:bg-red-100 transition-all active:scale-[0.98] border border-red-100"
                    >
                      Cancel Registration
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={onRegister}
                  disabled={spotsLeft === 0}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                    spotsLeft === 0
                      ? "bg-secondary text-muted cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20"
                  }`}
                >
                  {spotsLeft === 0 ? "Event Full" : "Register Now"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
