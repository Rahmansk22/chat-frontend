"use client";

import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import PromptBox from "./PromptBox";
import { getMessages, sendMessageToChat } from "../lib/api";

export default function ChatWindow({
  chatId,
  userId,
  token,
  onFirstPrompt,
}: {
  chatId: string | null;
  userId: string | null;
  token: string | null;
  onFirstPrompt?: (prompt: string) => void;
}) {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [hasSentFirstPrompt, setHasSentFirstPrompt] = useState(false);

  useEffect(() => {
    setHasSentFirstPrompt(false);
    if (chatId && token) {
      getMessages(chatId, token)
        .then(setMessages)
        .catch(() => setMessages([]));
    } else {
      setMessages([]);
    }
  }, [chatId, token]);

  async function handleSend(content: string) {
    if (!chatId || !token) return;
    setMessages((m) => [...m, { role: "user", content }]);
    if (!hasSentFirstPrompt && onFirstPrompt) {
      onFirstPrompt(content);
      setHasSentFirstPrompt(true);
    }
    try {
      const res = await sendMessageToChat(chatId, token, content);
      const assistantContent = res.assistant?.content || res.message?.content || res.content || "";
      setMessages((m) => [...m, { role: "assistant", content: assistantContent }]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((m) => [...m, { role: "assistant", content: "Error: Failed to get response" }]);
    }
  }

  // Handle user message edit and regenerate assistant response
  async function handleEditUserMessage(index: number, newContent: string) {
    if (!chatId || !token) return;
    setMessages((prev) => {
      // Remove the user message at index and its following assistant message
      const newMessages = prev.slice(0, index).concat({ role: "user", content: newContent });
      return newMessages;
    });
    try {
      const res = await sendMessageToChat(chatId, token, newContent);
      const assistantContent = res.assistant?.content || res.message?.content || res.content || "";
      setMessages((prev) => {
        // Add the new assistant message after the edited user message
        return prev.concat({ role: "assistant", content: assistantContent });
      });
    } catch (err) {
      setMessages((prev) => prev.concat({ role: "assistant", content: "Error: Failed to get response" }));
    }
  }


  // Ref for auto-scrolling and scroll-to-bottom arrow
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show scroll-to-bottom arrow if not at bottom
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      // 40px threshold
      setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 40);
    };
    const el = scrollContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-full flex flex-col pb-safe">
      {!chatId ? (
        <div className="flex-1 flex flex-col justify-between text-center px-4 bg-black w-full min-h-[100vh]">
          <div className="flex flex-col items-center pt-12">
            <div className="mb-4 animate-fade-in w-full flex justify-center items-center">
              <svg
                className="w-80 h-80 sm:w-[420px] sm:h-[420px] mt-4 mb-6 sm:mt-0 sm:mb-0"
                viewBox="0 0 800 800"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto', minWidth: 0, minHeight: 0 }}
              >
                <defs>
                  <clipPath id="circleMask">
                    <circle cx="400" cy="400" r="150" />
                  </clipPath>
                </defs>
                <circle
                  cx="400"
                  cy="400"
                  r="220"
                  fill="none"
                  stroke="#00f5ff"
                  strokeWidth="3"
                  strokeDasharray="12 18"
                >
                  <animateTransform attributeName="transform" type="rotate" from="0 400 400" to="360 400 400" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx="400"
                  cy="400"
                  r="185"
                  fill="none"
                  stroke="#7c5cff"
                  strokeWidth="2"
                  strokeDasharray="6 10"
                >
                  <animateTransform attributeName="transform" type="rotate" from="360 400 400" to="0 400 400" dur="12s" repeatCount="indefinite" />
                </circle>
                <image
                  href="/dragon.jpg"
                  x="250"
                  y="250"
                  width="300"
                  height="300"
                  clipPath="url(#circleMask)"
                  preserveAspectRatio="xMidYMid slice"
                  style={{ filter: 'drop-shadow(0 0 24px #00f5ff) saturate(1.2) contrast(1.1)' }}
                />
                <circle cx="400" cy="400" r="150" fill="none" stroke="#00f5ff" strokeWidth="4" opacity="0.4" />
                <circle r="6" fill="#00f5ff">
                  <animateTransform attributeName="transform" type="rotate" from="0 400 400" to="360 400 400" dur="6s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="translate" from="0 -260" to="0 -260" additive="sum" />
                </circle>
                <circle r="4" fill="#7c5cff">
                  <animateTransform attributeName="transform" type="rotate" from="360 400 400" to="0 400 400" dur="9s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="translate" from="0 -300" to="0 -300" additive="sum" />
                </circle>
                <circle r="3" fill="#ffffff">
                  <animateTransform attributeName="transform" type="rotate" from="0 400 400" to="360 400 400" dur="14s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="translate" from="0 -340" to="0 -340" additive="sum" />
                </circle>
                <text
                  x="400"
                  y="590"
                  textAnchor="middle"
                  fill="#00f5ff"
                  fontSize="38"
                  fontFamily="monospace"
                  letterSpacing="2"
                >
                  DRAGON AI
                </text>
              </svg>
            </div>
            <div className="flex flex-col items-center mt-1 mb-1 w-full max-w-[480px]">
              <div className="flex flex-col items-center mt-2 w-full max-w-[480px]">
                <div className="text-white/80 text-lg font-semibold mb-4">Welcome to Dragon AI!</div>
                <button
                  className="mb-5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition-colors"
                  onClick={() => onFirstPrompt && onFirstPrompt("")}
                >
                  Start New Chat
                </button>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">💡 Tip: Try asking anything!</span>
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">✨ Or upload an image with +</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 p-3 sm:p-4 lg:p-6 pt-14 sm:pt-0 overflow-y-auto space-y-4 sm:space-y-6 pb-6 relative bg-black hide-scrollbar"
          ref={scrollContainerRef}
        >
          {/* On mobile, show greeting below the title/SVG. On desktop, keep at the top. */}
          <div className="block sm:hidden mb-2 mt-16">
            <Message
              key="greeting-mobile"
              role="assistant"
              content="Hello! 👋 I’m your AI assistant. How can I help you today? You can ask me anything or try uploading an image using the + button below."
            />
          </div>
          <div className="hidden sm:block mt-16">
            <Message
              key="greeting-desktop"
              role="assistant"
              content="Hello! 👋 I’m your AI assistant. How can I help you today? You can ask me anything or try uploading an image using the + button below."
            />
          </div>
          {/* Then show all chat messages */}
          {messages.map((m, i) => (
            <Message
              key={i}
              role={m.role === "assistant" ? "assistant" : "user"}
              content={m.content}
              onEdit={m.role === "user" ? (newContent) => handleEditUserMessage(i, newContent) : undefined}
            />
          ))}
          <div ref={messagesEndRef} />
          {showScrollDown && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-24 right-8 z-30 bg-white/80 hover:bg-white text-indigo-600 shadow-lg rounded-full p-2 transition-colors border border-indigo-200"
              title="Scroll to bottom"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      )}
      {chatId && <PromptBox onSend={handleSend} />}
    </div>
  );
}
