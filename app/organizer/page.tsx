"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import OrganizerDashboard from "@/components/dashboard/organizer-dashboard";
import OrganizerEvents from "@/components/dashboard/organizer-events";
import CreateEventForm from "@/components/events/create-event-form";

export default function OrganizerPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    // Using setTimeout to avoid setState warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <OrganizerDashboard onNavigate={setActiveTab} />;
      case "events":
        return <OrganizerEvents onNavigate={setActiveTab} />;
      case "create":
        return <CreateEventForm onSuccess={() => setActiveTab("events")} />;
      default:
        return <OrganizerDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} userType="organizer" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
