"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ProfileSetupForm from "../../components/ProfileSetupForm";
import { getProfile } from "../../lib/api";

export default function ProfileSetupPage() {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    getToken().then(async t => {
      console.log("[ProfileSetupPage] Clerk token before fetch:", t);
      if (!t) {
        setError("Authentication failed: No Clerk JWT token found. Please sign in again.");
        router.push("/sign-in");
        setLoading(true);
        return;
      }
      setToken(t);
      // Check if profile exists
      try {
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            // Profile exists, redirect to chat
            router.push("/chat");
            return;
          }
        }
      } catch (e) {
        // Ignore fetch errors, allow setup
      }
      setProfileChecked(true);
      setLoading(false);
    });
  }, [getToken, router]);

  async function handleSubmit(name: string) {
    if (!token) {
      setError("Authentication not ready. Please wait and try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const endpoint = `/api/auth/profile`;
      console.log("[ProfileSetup] Endpoint:", endpoint);
      console.log("[ProfileSetup] Clerk token before fetch:", token);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save profile");
        setLoading(false);
        return;
      }
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
      setLoading(false);
    }
  }

  if (loading || !token || !profileChecked) {
    // If not authenticated or still checking profile, render nothing
    return null;
  }
  return <ProfileSetupForm onSubmit={handleSubmit} loading={loading} />;
}
