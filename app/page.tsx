"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/auth/login-page";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    // Using setTimeout to avoid setState warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Redirect based on user role
  useEffect(() => {
    if (mounted && user) {
      if (user.role === "organizer") {
        router.push("/organizer");
      } else {
        router.push("/user");
      }
    }
  }, [user, mounted, router]);

  // Return null on server-side and first client render to match SSR
  if (!mounted) return null;

  // Show login page if not logged in
  if (!user) return <LoginPage />;

  // Show nothing while redirecting
  return null;
}
