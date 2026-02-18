"use client";

import { Event } from "@/lib/types";
import { Calendar, MapPin, Users, Tag, Clock, Image as ImageIcon } from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: "primary" | "danger" | "secondary";
  showOrganizer?: boolean;
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

export default function EventCard({
  event,
  onClick,
  actionLabel,
  onAction,
  actionVariant = "primary",
  showOrganizer = true,
}: EventCardProps) {
  const spotsLeft = event.capacity - event.registered;
  const fillPercent = (event.registered / event.capacity) * 100;

  const actionStyles = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/10",
    danger: "bg-red-50 text-danger hover:bg-red-100",
    secondary: "bg-primary-light text-primary hover:bg-primary-light/80 border border-primary/10",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-border/80 transition-all duration-300 group ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Event Image */}
      {event.image && event.image.trim() !== '' ? (
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Show fallback if image fails to load
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/30">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                `;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Price badge on image */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-white/20">
            <span className="text-sm font-bold text-foreground">
              {event.price === 0 ? (
                <span className="text-success">Free</span>
              ) : (
                `$${event.price}`
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative h-40 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-primary/20" />
          {/* Price badge on placeholder */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-border">
            <span className="text-sm font-bold text-foreground">
              {event.price === 0 ? (
                <span className="text-success">Free</span>
              ) : (
                `$${event.price}`
              )}
            </span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5">
        {/* Badge row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
              categoryColors[event.category] || categoryColors.other
            }`}
          >
            {event.category}
          </span>
        </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
        {event.title}
      </h3>

      {/* Meta */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-border">·</span>
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        {showOrganizer && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>by {event.organizerName}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <Tag className="w-3 h-3 text-muted/40" />
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Capacity */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted">
            {event.registered} / {event.capacity}
          </span>
          <span
            className={`font-medium ${
              spotsLeft <= 5 ? "text-danger" : spotsLeft <= 20 ? "text-warning" : "text-success"
            }`}
          >
            {spotsLeft} left
          </span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
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

      {/* Action */}
      {actionLabel && onAction && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97] ${actionStyles[actionVariant]}`}
        >
          {actionLabel}
        </button>
      )}
      </div>
    </div>
  );
}
