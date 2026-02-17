// API utilities for making authenticated requests

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Backend event type
interface BackendEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  time: string;
  price: number;
  image?: string;
  organizer: string | { _id: string; name: string; email: string };
  resisteredUsers: string[];
}

/**
 * Make an authenticated API request with the JWT token
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");
  
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  };

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * Helper to handle API responses
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  
  return data;
}

/**
 * Make a GET request with authentication
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint, { method: "GET" });
  return handleApiResponse<T>(response);
}

/**
 * Make a POST request with authentication
 */
export async function apiPost<T>(endpoint: string, body: FormData | Record<string, unknown>): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
  return handleApiResponse<T>(response);
}

/**
 * Make a PUT request with authentication
 */
export async function apiPut<T>(endpoint: string, body: FormData | Record<string, unknown>): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
  return handleApiResponse<T>(response);
}

/**
 * Make a DELETE request with authentication
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint, { method: "DELETE" });
  return handleApiResponse<T>(response);
}

// ==================== USER ENDPOINTS ====================

/**
 * Get all events (public)
 */
export async function getAllEvents() {
  return apiGet<BackendEvent[]>("/api/v1/user/get-all-events");
}

/**
 * Register for an event
 */
export async function registerForEvent(eventId: string) {
  return apiPost<{ message: string }>("/api/v1/user/register-event", { eventId });
}

/**
 * Get my registered events
 */
export async function getMyRegisteredEvents() {
  return apiGet<BackendEvent[]>("/api/v1/user/get-registered-event");
}

// ==================== ORGANIZER ENDPOINTS ====================

/**
 * Create a new event (with image upload)
 */
export async function createEvent(formData: FormData) {
  return apiPost<{ message: string; event: BackendEvent }>("/api/v1/organizer/create-event", formData);
}

/**
 * Update an event (with optional image upload)
 */
export async function updateEvent(formData: FormData) {
  return apiPut<{ message: string; event: BackendEvent }>("/api/v1/organizer/update-event", formData);
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string) {
  return apiDelete<{ message: string }>(`/api/v1/organizer/delete-event/${eventId}`);
}

/**
 * Get all my events (as organizer)
 */
export async function getMyEvents() {
  return apiGet<BackendEvent[]>("/api/v1/organizer/organizer-all-events");
}

/**
 * Get organizer dashboard stats
 */
export async function getDashboardStats() {
  return apiGet<{
    totalEvents: number;
    totalRegistrations: number;
    upcomingEvents: number;
    recentEvents: BackendEvent[];
  }>("/api/v1/organizer/dashboard");
}

export { API_URL };
export type { BackendEvent };
