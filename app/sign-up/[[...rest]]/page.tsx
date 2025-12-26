"use client";
import React from "react";
import { SignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-white/60 hover:text-white active:text-white/80 transition z-10"
        title="Back"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm sm:text-base">Back</span>
      </button>
      <SignUp />
    </div>
  );
}
