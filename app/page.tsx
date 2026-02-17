"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import LoginPage from "@/components/auth/login-page";
import Navbar from "@/components/layout/navbar";
import OrganizerDashboard from "@/components/dashboard/organizer-dashboard";
import OrganizerEvents from "@/components/dashboard/organizer-events";
import CreateEventForm from "@/components/events/create-event-form";
import BrowseEvents from "@/components/dashboard/browse-events";
import MyRegistrations from "@/components/dashboard/my-registrations";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set default tab when user logs in
  useEffect(() => {
    if (user && !activeTab) {
      if (user.role === "organizer") setActiveTab("dashboard");
      else setActiveTab("browse");
    } else if (!user && activeTab) {
      setActiveTab("");
    }
  }, [user, activeTab]);

  // Return null on server-side and first client render to match SSR
  if (!mounted) return null;

  if (!user) return <LoginPage />;

  const isOrganizer = user.role === "organizer";

  const renderContent = () => {
    if (isOrganizer) {
      switch (activeTab) {
        case "dashboard":
          return <OrganizerDashboard onNavigate={setActiveTab} />;
        case "events":
          return <OrganizerEvents onNavigate={setActiveTab} />;
        case "create":
          return (
            <CreateEventForm onSuccess={() => setActiveTab("events")} />
          );
        default:
          return <OrganizerDashboard onNavigate={setActiveTab} />;
      }
    } else {
      switch (activeTab) {
        case "browse":
          return <BrowseEvents />;
        case "registered":
          return <MyRegistrations />;
        default:
          return <BrowseEvents />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
