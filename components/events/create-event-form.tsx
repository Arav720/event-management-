"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEvents } from "@/lib/event-context";
import { EventCategory } from "@/lib/types";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Tag,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const categories: { value: EventCategory; label: string }[] = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "seminar", label: "Seminar" },
  { value: "webinar", label: "Webinar" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

export default function CreateEventForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { user } = useAuth();
  const { addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("conference");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!capacity || Number(capacity) < 1)
      newErrors.capacity = "Capacity must be at least 1";
    if (price && Number(price) < 0)
      newErrors.price = "Price cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      category,
      capacity: Number(capacity),
      price: Number(price) || 0,
      tags,
      organizerId: user.id,
      organizerName: user.name,
    });

    // Reset
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setCategory("conference");
    setCapacity("");
    setPrice("");
    setTagsInput("");
    setErrors({});
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onSuccess?.();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">Event Created!</h2>
        <p className="text-sm text-muted">Your event has been published successfully.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Create New Event</h1>
            <p className="text-sm text-muted">Fill in the details below to publish your event.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
            <FileText className="w-4 h-4 text-muted" />
            Event Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tech Innovation Summit 2026"
            className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted/50 focus:ring-1 focus:ring-primary outline-none ${
              errors.title ? "border-danger" : "border-border focus:border-primary"
            }`}
          />
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
            <FileText className="w-4 h-4 text-muted" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell attendees what to expect..."
            rows={4}
            className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted/50 focus:ring-1 focus:ring-primary outline-none resize-none ${
              errors.description ? "border-danger" : "border-border focus:border-primary"
            }`}
          />
          {errors.description && (
            <p className="text-xs text-danger mt-1">{errors.description}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Calendar className="w-4 h-4 text-muted" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:ring-1 focus:ring-primary outline-none ${
                errors.date ? "border-danger" : "border-border focus:border-primary"
              }`}
            />
            {errors.date && <p className="text-xs text-danger mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Clock className="w-4 h-4 text-muted" />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:ring-1 focus:ring-primary outline-none ${
                errors.time ? "border-danger" : "border-border focus:border-primary"
              }`}
            />
            {errors.time && <p className="text-xs text-danger mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
            <MapPin className="w-4 h-4 text-muted" />
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Convention Center, San Francisco"
            className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted/50 focus:ring-1 focus:ring-primary outline-none ${
              errors.location ? "border-danger" : "border-border focus:border-primary"
            }`}
          />
          {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted hover:text-foreground hover:bg-secondary-hover"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Capacity & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <Users className="w-4 h-4 text-muted" />
              Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="100"
              min="1"
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted/50 focus:ring-1 focus:ring-primary outline-none ${
                errors.capacity ? "border-danger" : "border-border focus:border-primary"
              }`}
            />
            {errors.capacity && (
              <p className="text-xs text-danger mt-1">{errors.capacity}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
              <DollarSign className="w-4 h-4 text-muted" />
              Price ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0 (Free)"
              min="0"
              step="0.01"
              className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted/50 focus:ring-1 focus:ring-primary outline-none ${
                errors.price ? "border-danger" : "border-border focus:border-primary"
              }`}
            />
            {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
            <Tag className="w-4 h-4 text-muted" />
            Tags
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="technology, AI, networking (comma-separated)"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <p className="text-xs text-muted mt-1">Separate tags with commas</p>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm"
          >
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}
