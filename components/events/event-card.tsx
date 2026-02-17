"use client";

import { Event } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
} from "lucide-react";

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
  workshop: "bg-purple-50 text-purple-600",
  meetup: "bg-green-50 text-green-600",
  seminar: "bg-amber-50 text-amber-600",
  webinar: "bg-cyan-50 text-cyan-600",
  social: "bg-pink-50 text-pink-600",
  other: "bg-gray-50 text-gray-600",
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
    primary: "bg-primary text-white hover:bg-primary-hover",
    danger: "bg-red-50 text-danger hover:bg-red-100",
    secondary: "bg-secondary text-foreground hover:bg-secondary-hover",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all duration-200 group ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Top row: category badge + price */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
            categoryColors[event.category] || categoryColors.other
          }`}
        >
          {event.category}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {event.price === 0 ? (
            <span className="text-success">Free</span>
          ) : (
            `$${event.price}`
          )}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {event.title}
      </h3>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <Clock className="w-3.5 h-3.5 flex-shrink-0 ml-2" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        {showOrganizer && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>by {event.organizerName}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <Tag className="w-3 h-3 text-muted" />
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Capacity bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted">
            {event.registered} / {event.capacity} registered
          </span>
          <span
            className={`font-medium ${
              spotsLeft <= 10 ? "text-warning" : "text-success"
            }`}
          >
            {spotsLeft} spots left
          </span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
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

      {/* Action */}
      {actionLabel && onAction && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className={`w-full py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${actionStyles[actionVariant]}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
