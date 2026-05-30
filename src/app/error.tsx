"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8 mx-auto">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">Connection Error</h1>
      <p className="text-lg text-gray-400 mb-8 max-w-md">
        The storefront is temporarily unavailable. This is usually due to the database spinning up. Please try again in a few seconds.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
        <Link href="/" className="px-8 py-4 bg-transparent border border-white text-white font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors">
          Return Home
        </Link>
      </div>
    </main>
  );
}
