"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import BrowseEvents from "@/components/dashboard/browse-events";
import MyRegistrations from "@/components/dashboard/my-registrations";

function UserPageContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  // Get initial tab from URL params
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    return (tab === 'tickets' || tab === 'registered') ? 'registered' : 'browse';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());

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

export default function UserPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    }>
      <UserPageContent />
    </Suspense>
  );
}
