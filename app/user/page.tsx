"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import BrowseEvents from "@/components/dashboard/browse-events";
import MyRegistrations from "@/components/dashboard/my-registrations";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("browse");
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
      case "browse":
        return <BrowseEvents />;
      case "registered":
        return <MyRegistrations />;
      default:
        return <BrowseEvents />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} userType="attendee" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
