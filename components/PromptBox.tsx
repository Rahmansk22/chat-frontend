"use client";

import React, { useState, useRef } from "react";

export default function PromptBox({ onSend }: { onSend: (msg: string) => void }) {
  const [value, setValue] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showImageUploadComingSoon, setShowImageUploadComingSoon] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageAnalysis, setImageAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setShowImagePreview(true);
      
      // Analyze the image
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/image/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setImageAnalysis(data.analysis);
        } else {
          setImageAnalysis("Unable to analyze image. Please try again.");
        }
      } catch (err) {
        setImageAnalysis("Error analyzing image. Please try again.");
        console.error("Image analysis error:", err);
      } finally {
        setIsAnalyzing(false);
      }
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleSendImage = () => {
    if (selectedImage) {
      onSend(selectedImage);
      setShowImagePreview(false);
      setSelectedImage("");
      setImageAnalysis("");
    }
  };

  const handleGenerateImage = async () => {
    setShowComingSoon(true);
  };

  return (
    <>
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Image Generation</h2>
              <button
                onClick={() => setShowComingSoon(false)}
                className="text-white/60 hover:text-white active:text-white text-2xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Placeholder Image */}
              <div>
                <div className="w-full rounded-lg border border-white/20 max-h-64 bg-white/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🖼️</div>
                    <p className="text-white/60 text-sm">Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3 text-white/80 text-lg">Under Construction</h3>
                <div className="text-white/70 text-sm leading-relaxed space-y-4">
                  <p className="text-white/60">Image generation feature is currently under development.</p>
                  <div>
                    <p className="font-medium mb-2">✨ We're building:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/60">
                      <li>AI-powered image generation</li>
                      <li>Multiple style options</li>
                      <li>High-quality outputs</li>
                      <li>Advanced customization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowComingSoon(false)}
                className="flex-1 px-4 py-2.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white font-medium text-sm sm:text-base"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageUploadComingSoon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Image Upload & Analysis</h2>
              <button
                onClick={() => setShowImageUploadComingSoon(false)}
                className="text-white/60 hover:text-white active:text-white text-2xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Placeholder Image */}
              <div>
                <div className="w-full rounded-lg border border-white/20 max-h-64 bg-white/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-3">📎</div>
                    <p className="text-white/60 text-sm">Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3 text-white/80 text-lg">Under Construction</h3>
                <div className="text-white/70 text-sm leading-relaxed space-y-4">
                  <p className="text-white/60">Image upload and analysis feature is currently under development.</p>
                  <div>
                    <p className="font-medium mb-2">✨ We're building:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/60">
                      <li>Image upload and analysis</li>
                      <li>AI-powered image understanding</li>
                      <li>Multi-modal conversations</li>
                      <li>Real-time image processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowImageUploadComingSoon(false)}
                className="flex-1 px-4 py-2.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white font-medium text-sm sm:text-base"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {showImagePreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Image Analysis</h2>
              <button
                onClick={() => setShowImagePreview(false)}
                className="text-white/60 hover:text-white active:text-white text-2xl p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Image Preview */}
              <div>
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full rounded-lg border border-white/20 max-h-64 object-cover"
                />
              </div>

              {/* Analysis */}
              <div>
                <h3 className="font-semibold mb-3 text-white/80">AI Analysis</h3>
                {isAnalyzing ? (
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    Analyzing image...
                  </div>
                ) : (
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {imageAnalysis}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={handleSendImage}
                disabled={isAnalyzing}
                className="flex-1 px-4 py-2.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Image to Chat
              </button>
              <button
                onClick={() => setShowImagePreview(false)}
                className="flex-1 px-4 py-2.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition text-white font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 sm:p-4 lg:p-6 pb-1 sm:pb-4 lg:pb-6 border-t border-white/10">
        <div className="flex gap-2 sm:gap-3 lg:gap-4 bg-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 items-end relative w-full">
          {/* Always show + icon for actions, all screen sizes */}
          <div className="relative">
            <button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition text-white/70 hover:text-white text-xl flex items-center justify-center"
              onClick={() => setShowDropdown((v) => !v)}
              type="button"
              aria-label="More actions"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M11 7v8M7 11h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute left-0 bottom-12 z-20 bg-white/90 rounded-lg shadow-lg py-1 min-w-[140px] border border-white/20 flex flex-col">
                <button
                  onClick={() => { setShowImageUploadComingSoon(true); setShowDropdown(false); }}
                  className="px-4 py-3 text-left text-black hover:bg-indigo-100 text-base flex items-center gap-3 rounded-t-lg"
                  type="button"
                >
                  <span className="text-xl">📎</span>
                  <span className="font-semibold">Attach Image</span>
                </button>
                <div className="w-full h-[2px] bg-gradient-to-r from-indigo-300 via-blue-200 to-cyan-200 my-0" />
                <button
                  onClick={() => { handleGenerateImage(); setShowDropdown(false); }}
                  className="px-4 py-3 text-left text-black hover:bg-blue-100 text-base flex items-center gap-3 rounded-b-lg"
                  type="button"
                >
                  <span className="text-xl">🖼️</span>
                  <span className="font-semibold">Generate Image</span>
                </button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {/* Auto-growing textarea for prompt input */}
          <textarea
            className="flex-1 min-w-0 resize-none bg-transparent outline-none placeholder-white/40 text-sm sm:text-base border border-white/20 rounded-xl px-3 py-2 focus:border-indigo-400 transition leading-relaxed max-h-40 overflow-y-auto hide-scrollbar"
            placeholder="Ask anything..."
            value={value}
            rows={1}
            onInput={e => {
              const ta = e.currentTarget;
              ta.style.height = 'auto';
              ta.style.height = ta.scrollHeight + 'px';
            }}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey && value.trim()) {
                e.preventDefault();
                onSend(value);
                setValue("");
              }
            }}
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
            style={{ minHeight: 36 }}
          />
          <button
            onClick={() => {
              if (value.trim()) {
                onSend(value);
                setValue("");
              }
            }}
            className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition flex items-center justify-center"
            type="button"
            aria-label="Send"
            style={{ marginLeft: 'auto' }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
