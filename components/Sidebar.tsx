import React, { useEffect, useState } from "react";
import { useClerk, useAuth } from "@clerk/nextjs";
import { getChats, getProfile } from "../lib/api";

export default function Sidebar({
  chats = [],
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  activeChatId,
  collapsed = false,
  onToggleSidebar,
}: {
  chats: Array<{ id: string; title?: string }>;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  activeChatId: string | null;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [chatList, setChatList] = useState<Array<{ id: string; createdAt: string }>>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const { getToken } = useAuth();
  useEffect(() => {
    async function fetchData() {
      const token = await getToken();
      console.log("[Sidebar] Clerk token before fetch:", token);
      if (!token) {
        setUser(null);
        setChatList([]);
        console.error("[Sidebar] No Clerk JWT token found. User is not authenticated.");
        return;
      }
      try {
        const [chats, profile] = await Promise.all([
          getChats(token),
          getProfile(token)
        ]);
        setChatList(chats);
        setUser(profile);
      } catch (err) {
        setChatList([]);
        setUser(null);
        console.error("[Sidebar] Failed to fetch chats/profile:", err);
      }
    }
    fetchData();
  }, [getToken]);

  const { signOut } = useClerk();
  async function handleLogout() {
    await signOut();
    window.location.href = "/sign-in";
  }

  function handleDeleteAllChats() {
    setConfirmDeleteAll(true);
  }

  return (
    <aside
      className={`flex flex-col transition-all duration-300 ${collapsed ? 'w-14 min-w-0 p-0 overflow-hidden items-center bg-transparent border-none' : 'w-52 sm:w-60 lg:w-60 p-3 sm:p-4 rounded-2xl lg:rounded-3xl bg-white/5 backdrop-blur-xl border-r lg:border border-white/10'}`}
      style={{ minWidth: collapsed ? 0 : undefined, height: '100%' }}
    >
      {/* Hamburger Sidebar Toggle Button (right side when expanded, centered when collapsed) */}
      {collapsed ? (
        <button
          className="mt-4 mb-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition mx-auto"
          aria-label="Expand sidebar"
          onClick={onToggleSidebar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center justify-between mb-4">
          <div />
          <button
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            aria-label="Collapse sidebar"
            onClick={onToggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}
      {!collapsed && (
        <>
          <h2 className="text-lg font-semibold mb-4 sm:mb-6">Chats</h2>
          <button
            className="mb-3 sm:mb-4 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 transition p-2.5 sm:p-3 text-left text-sm sm:text-base"
            onClick={onNewChat}
          >
            + New Chat
          </button>
          <div className="flex-1 space-y-1.5 sm:space-y-2 overflow-y-auto text-xs sm:text-sm text-white/60 hide-scrollbar">
            {chats.length === 0 ? (
              <div className="text-center py-4">No saved chats</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center justify-between rounded-lg p-2 transition ${
                    activeChatId === chat.id ? "bg-indigo-600 text-white" : "hover:bg-white/10 active:bg-white/20"
                  }`}
                >
                  <button className="flex-1 text-left truncate pr-2" onClick={() => onSelectChat(chat.id)}>
                    {chat.title || `Chat ${chat.id}`}
                  </button>
                  <div className="flex gap-1.5 sm:gap-2 ml-2">
                    <button
                      className="text-xs px-1.5 sm:px-2 py-1 rounded bg-white/20 hover:bg-white/30 active:bg-white/40 transition"
                      aria-label="Rename chat"
                      title="Rename"
                      onClick={() => {
                        const t = window.prompt("Rename chat", chat.title || "");
                        if (t && t.trim()) onRenameChat(chat.id, t.trim());
                      }}
                    >
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 13.5v2.5h2.5l7-7a1.77 1.77 0 0 0-2.5-2.5l-7 7Z" />
                      </svg>
                    </button>
                    <button
                      className="text-xs px-1.5 sm:px-2 py-1 rounded bg-red-500/60 text-white hover:bg-red-600 active:bg-red-700 transition"
                      aria-label="Delete chat"
                      title="Delete"
                      onClick={() => {
                        setConfirmDeleteId(chat.id);
                        setConfirmDeleteTitle(chat.title || `Chat ${chat.id}`);
                      }}
                    >
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
                        <rect x="5" y="6" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 sm:mt-6 border-t border-white/10 pt-3 sm:pt-4 flex flex-col gap-2">
            {user && <div className="text-white/80 font-medium text-sm sm:text-base truncate">👤 {user.name}</div>}
            <button
              className="rounded-xl bg-red-500/80 hover:bg-red-600 active:bg-red-700 transition p-2 sm:p-2.5 text-white text-xs sm:text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}
      {confirmDeleteId && !collapsed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 m-0">
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-white text-gray-900 shadow-xl">
            <div className="px-3 py-4 sm:px-5 border-b border-gray-200">
              <h3 className="text-base font-semibold">Delete chat</h3>
              <p className="text-sm text-gray-600 mt-1">{confirmDeleteTitle}</p>
            </div>
            <div className="px-3 py-4 sm:px-5 flex justify-end gap-2 sm:gap-3">
              <button
                className="px-3 py-2 sm:px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 sm:px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                onClick={() => {
                  if (confirmDeleteId) onDeleteChat(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
