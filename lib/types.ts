export type Role = "organizer" | "attendee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  capacity: number;
  registered: number;
  image?: string;
  organizerId: string;
  organizerName: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  price: number;
  tags: string[];
}

export type EventCategory =
  | "conference"
  | "workshop"
  | "meetup"
  | "seminar"
  | "webinar"
  | "social"
  | "other";

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  status: "confirmed" | "pending" | "cancelled";
}
