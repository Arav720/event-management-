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
  workshop: "bg-purple-50 text-purple-600",
  meetup: "bg-green-50 text-green-600",
  seminar: "bg-amber-50 text-amber-600",
  webinar: "bg-cyan-50 text-cyan-600",
  social: "bg-pink-50 text-pink-600",
  other: "bg-gray-50 text-gray-600",
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
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div className="flex-1 pr-4">
            <span
              className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize mb-2 ${
                categoryColors[event.category] || categoryColors.other
              }`}
            >
              {event.category}
            </span>
            <h2 className="text-xl font-bold text-foreground">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted">Date</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted">Time</p>
                <p className="text-sm font-medium text-foreground">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 col-span-2">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="text-sm font-medium text-foreground">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted">Price</p>
                <p className="text-sm font-medium text-foreground">
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted">Organizer</p>
                <p className="text-sm font-medium text-foreground">{event.organizerName}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">About this event</h3>
            <p className="text-sm leading-relaxed text-muted">{event.description}</p>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted" />
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Capacity */}
          <div className="p-4 rounded-xl bg-secondary/50">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted">
                {event.registered} / {event.capacity} spots filled
              </span>
              <span
                className={`font-medium ${
                  spotsLeft <= 10 ? "text-warning" : "text-success"
                }`}
              >
                {spotsLeft} remaining
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  fillPercent > 90
                    ? "bg-warning"
                    : fillPercent > 70
                    ? "bg-amber-300"
                    : "bg-primary"
                }`}
                style={{ width: `${Math.min(fillPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="pt-2">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">You&apos;re registered!</span>
                  </div>
                  {onCancelRegistration && (
                    <button
                      onClick={onCancelRegistration}
                      className="w-full py-2.5 rounded-xl bg-red-50 text-danger text-sm font-medium hover:bg-red-100 transition-all active:scale-[0.98]"
                    >
                      Cancel Registration
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={onRegister}
                  disabled={spotsLeft === 0}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                    spotsLeft === 0
                      ? "bg-secondary text-muted cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-hover shadow-sm"
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
