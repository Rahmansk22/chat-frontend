"use client";
import { useEffect, useState } from "react";
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

    useEffect(() => {
      getToken().then(t => {
        if (!t) {
          router.push("/sign-in");
          setLoading(true);
          return;
        }
        setToken(t);
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
      console.log("[ProfileSetup] Clerk token before fetch:", token);
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/auth/profile`, {
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

    if (loading || !token) {
      // If not authenticated, we are redirecting, so render nothing
      return null;
    }
  return <ProfileSetupForm onSubmit={handleSubmit} loading={loading} />;
}
