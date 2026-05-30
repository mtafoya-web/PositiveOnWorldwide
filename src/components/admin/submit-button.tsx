"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Saving" : children}
    </button>
  );
}
