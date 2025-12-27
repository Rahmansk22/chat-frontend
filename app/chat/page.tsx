"use client";
import React from "react";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import { useState, useEffect } from "react";
import { createChat, getChats, getProfile } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Array<{ id: string; title?: string }>>([]);
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchChats() {
      setError(null);
      const t = await getToken();
      console.log("[ChatPage] Clerk token before fetch:", t);
      if (!t) {
        setError("Authentication failed: No Clerk JWT token found. Please sign in again.");
        router.push("/sign-in");
        return;
      }
      setToken(t);
      // Onboarding: check if profile is complete
      try {
        const profile = await getProfile(t);
        if (profile.requireProfile) {
          router.push("/profile-setup");
          return;
        }
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        return;
      }
      setProfileChecked(true);
      try {
        const existingChats = await getChats(t);
        setChats(existingChats);
        if (existingChats.length === 0) {
          try {
            const newChat = await createChat(t);
            setActiveChatId(newChat.id);
            setChats([newChat]);
          } catch (err) {
            setError("Failed to create a new chat. Please try again later.");
          }
        }
      } catch (err) {
        setChats([]);
        setError("Failed to load chats. Please try again later.");
      }
    }
    fetchChats();
  }, [getToken, router]);

  async function handleNewChat() {
    if (!token) return;
    const chat = await createChat(token);
    setActiveChatId(chat.id);
    setChats((prev) => [chat, ...prev]);
  }

  async function handleFirstPrompt(prompt: string) {
    if (!activeChatId || !token) return;
    // Wait a moment for backend to update title, then refresh chat list
    setTimeout(async () => {
      const updatedChats = await getChats(token);
      setChats(updatedChats);
    }, 300);
  }

  function handleSelectChat(id: string) {
    setActiveChatId(id);
  }

  async function handleRenameChat(id: string, newTitle: string) {
    if (!token) return;
    await fetch(`/api/chats/${id}/title`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)));
  }

  async function handleDeleteChat(id: string) {
    await fetch(`/api/chats/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token ?? ""}` },
    });
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  }

  // Sidebar open/collapse state for all devices
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  // Responsive: collapse sidebar by default on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    // Set initial width
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!profileChecked || !token) {
    // If not authenticated or redirecting, render nothing
    return null;
  }

    return (
      <div className="h-screen flex overflow-hidden bg-black">
        {/* Sidebar overlay for mobile/tablet */}
        {sidebarOpen && windowWidth !== null && windowWidth < 1024 && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar and main chat area in a flex row, with shared bottom border for alignment */}
        <div className="flex flex-row w-full h-full">
          <div
            className={`z-50 transition-transform duration-300 h-full flex flex-col ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed lg:relative inset-y-0 left-0 lg:translate-x-0 lg:p-3 lg:py-6 lg:pl-6 border-b border-white/10`}
            style={{
              width: sidebarOpen
                ? windowWidth !== null && windowWidth >= 1024
                  ? 240
                  : 210 // wider on mobile
                : 0,
              minWidth: 0,
              maxHeight: 'calc(100vh - 72px)',
              height: 'calc(100vh - 72px)',
            }}
          >
            <Sidebar
              chats={chats}
              onNewChat={handleNewChat}
              onSelectChat={(id) => {
                handleSelectChat(id);
                if (windowWidth !== null && windowWidth < 1024) setSidebarOpen(false);
              }}
              onRenameChat={handleRenameChat}
              onDeleteChat={handleDeleteChat}
              activeChatId={activeChatId}
              collapsed={!sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((open) => !open)}
            />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden border-b border-white/10">
            {/* Dragon title overlay, does not disturb layout */}
            <div
              className="pointer-events-none select-none fixed left-0 right-0 z-30 flex justify-center"
              style={{ top: '1.25rem', height: 0 }}
            >
              <span
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide bg-black/80 px-6 py-2 rounded-2xl shadow-xl flex items-center justify-center border border-white/10 drop-shadow-lg"
                style={{ minHeight: '2.75rem', letterSpacing: '0.08em' }}
              >
                Dragon <span className="ml-2 font-light text-white/70">AI</span>
              </span>
            </div>
            <div className="flex-1 overflow-hidden p-3 lg:p-6">
              {error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-red-900/80 text-red-200 p-6 rounded-xl text-center max-w-md mx-auto shadow-lg">
                    <div className="text-lg font-bold mb-2">{error}</div>
                    <div className="text-sm">If this keeps happening, please try logging out and back in, or contact support.</div>
                  </div>
                </div>
              ) : (
                <ChatWindow
                  chatId={activeChatId}
                  userId={null}
                  token={token}
                  onFirstPrompt={activeChatId ? handleFirstPrompt : handleNewChat}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area with Dragon title at the top */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Dragon title overlay, does not disturb layout */}
          <div
            className="pointer-events-none select-none fixed left-0 right-0 z-30 flex justify-center"
            style={{ top: '1.25rem', height: 0 }}
          >
            <span
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide bg-black/80 px-6 py-2 rounded-2xl shadow-xl flex items-center justify-center border border-white/10 drop-shadow-lg"
              style={{ minHeight: '2.75rem', letterSpacing: '0.08em' }}
            >
              Dragon <span className="ml-2 font-light text-white/70">AI</span>
            </span>
          </div>
          <div className="flex-1 overflow-hidden p-3 lg:p-6">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-red-900/80 text-red-200 p-6 rounded-xl text-center max-w-md mx-auto shadow-lg">
                  <div className="text-lg font-bold mb-2">{error}</div>
                  <div className="text-sm">If this keeps happening, please try logging out and back in, or contact support.</div>
                </div>
              </div>
            ) : (
              <ChatWindow
                chatId={activeChatId}
                userId={null}
                token={token}
                onFirstPrompt={activeChatId ? handleFirstPrompt : handleNewChat}
              />
            )}
          </div>
        </div>
      </div>
    );
}
