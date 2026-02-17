"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/lib/event-context";
import { EventCategory, Event } from "@/lib/types";
import { createEvent, updateEvent } from "@/lib/api";
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
  ArrowLeft,
  Upload,
} from "lucide-react";

const categories: { value: EventCategory; label: string; emoji: string }[] = [
  { value: "conference", label: "Conference", emoji: "🎤" },
  { value: "workshop", label: "Workshop", emoji: "🛠" },
  { value: "meetup", label: "Meetup", emoji: "🤝" },
  { value: "seminar", label: "Seminar", emoji: "📚" },
  { value: "webinar", label: "Webinar", emoji: "💻" },
  { value: "social", label: "Social", emoji: "🎉" },
  { value: "other", label: "Other", emoji: "✨" },
];

export default function CreateEventForm({
  event,
  onSuccess,
}: {
  event?: Event;
  onSuccess?: () => void;
}) {
  const { loadMyEvents } = useEvents();
  const isEditMode = !!event;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("conference");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date);
      setTime(event.time);
      setLocation(event.location);
      setCategory(event.category);
      setCapacity(event.capacity?.toString() || "");
      setPrice(event.price?.toString() || "0");
      setTagsInput(event.tags?.join(", ") || "");
    }
  }, [event]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      
      if (isEditMode && event) {
        formData.append('eventId', event.id);
      }
      
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('date', date);
      formData.append('location', location.trim());
      formData.append('category', category);
      formData.append('time', time);
      formData.append('price', price || '0');
      
      // Add image if selected
      if (image) {
        formData.append('image', image);
      }

      console.log('Submitting event form...', {
        isEditMode,
        hasImage: !!image,
        title: title.trim(),
      });

      // Call appropriate API endpoint
      let result;
      if (isEditMode) {
        console.log('Calling updateEvent API...');
        result = await updateEvent(formData);
      } else {
        console.log('Calling createEvent API...');
        result = await createEvent(formData);
      }

      console.log('Event API response:', result);

      // Reload events after successful creation/update
      console.log('Loading my events...');
      await loadMyEvents();

      // Reset form only if creating (not editing)
      if (!isEditMode) {
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setCategory("conference");
        setCapacity("");
        setPrice("");
        setTagsInput("");
        setImage(null);
        setStep(1);
      }
      
      setErrors({});
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} event:`, error);
      const errorMessage = error?.message || `Failed to ${isEditMode ? 'update' : 'create'} event. Please try again.`;
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isEditMode ? 'Event Updated!' : 'Event Created!'}
        </h2>
        <p className="text-sm text-muted">
          Your event has been {isEditMode ? 'updated' : 'published'} successfully.
        </p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all ${
      errors[field] ? "border-danger" : "border-border focus:border-primary"
    }`;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-sm text-muted">
              {isEditMode ? 'Update the event details below.' : 'Fill in the details to publish your event.'}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-5">
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-primary" : "bg-secondary"}`} />
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className={`text-xs font-medium ${step === 1 ? "text-primary" : "text-muted"}`}>Basic Info</span>
          <span className={`text-xs font-medium ${step === 2 ? "text-primary" : "text-muted"}`}>Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-right">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <FileText className="w-4 h-4 text-muted/50" />
                Event Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tech Innovation Summit 2026"
                className={inputClass("title")}
              />
              {errors.title && <p className="text-xs text-danger mt-1.5">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <FileText className="w-4 h-4 text-muted/50" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell attendees what to expect..."
                rows={4}
                className={`${inputClass("description")} resize-none`}
              />
              {errors.description && (
                <p className="text-xs text-danger mt-1.5">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2.5 block">Category</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center transition-all ${
                      category === cat.value
                        ? "border-primary bg-primary-light shadow-sm"
                        : "border-border hover:border-muted/40 bg-background"
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className={`text-[10px] font-medium ${category === cat.value ? "text-primary" : "text-muted"}`}>
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 text-muted/50" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass("date")}
                />
                {errors.date && <p className="text-xs text-danger mt-1.5">{errors.date}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Clock className="w-4 h-4 text-muted/50" />
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={inputClass("time")}
                />
                {errors.time && <p className="text-xs text-danger mt-1.5">{errors.time}</p>}
              </div>
            </div>

            {/* Next */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-right">
            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 text-muted/50" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Convention Center, San Francisco"
                className={inputClass("location")}
              />
              {errors.location && <p className="text-xs text-danger mt-1.5">{errors.location}</p>}
            </div>

            {/* Capacity & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Users className="w-4 h-4 text-muted/50" />
                  Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="100"
                  min="1"
                  className={inputClass("capacity")}
                />
                {errors.capacity && (
                  <p className="text-xs text-danger mt-1.5">{errors.capacity}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <DollarSign className="w-4 h-4 text-muted/50" />
                  Price ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0 (Free)"
                  min="0"
                  step="0.01"
                  className={inputClass("price")}
                />
                {errors.price && <p className="text-xs text-danger mt-1.5">{errors.price}</p>}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Tag className="w-4 h-4 text-muted/50" />
                Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="technology, AI, networking"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted/40 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
              />
              <p className="text-xs text-muted mt-1.5">Separate tags with commas</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Upload className="w-4 h-4 text-muted/50" />
                Event Image {isEditMode && '(optional - leave empty to keep current)'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary hover:file:bg-primary/10 cursor-pointer"
              />
              {image && (
                <p className="text-xs text-muted mt-1.5">Selected: {image.name}</p>
              )}
            </div>

            {errors.submit && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-danger">{errors.submit}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-secondary transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Publish Event')}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
