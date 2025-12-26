import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-full flex items-center justify-center px-4 bg-gradient-to-br from-black via-zinc-900 to-zinc-950">
      <div className="text-center space-y-8 sm:space-y-10 animate-fade-in">
        <div className="flex justify-center">
          <img
            src="/hero.jpg"
            alt="Dragon AI Logo"
            className="mx-auto w-40 h-40 sm:w-56 sm:h-56 rounded-full shadow-2xl border-4 border-indigo-500/40 animate-pulse"
            style={{ boxShadow: "0 0 60px 10px #00f5ff55" }}
          />
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg"
          style={{ fontFamily: 'Arial, Helvetica, Verdana, Geneva, sans-serif', textShadow: '0 1px 3px #00f5ff', lineHeight: 1.2, letterSpacing: '0.04em', paddingBottom: '0.15em' }}
        >
          Dragon AI
        </h1>
        <p className="text-white/70 text-lg sm:text-xl max-w-xl mx-auto">
          Experience the Future of AI Conversations & Creativity<br />
          <span className="text-indigo-300">Text & Image generation with Dragon AI</span>
        </p>
        <Link
          href="/chat"
          className="inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white text-lg font-bold shadow-xl transition-all duration-200 animate-bounce"
        >
          Start Chat
        </Link>
      </div>
    </div>
  );
}
