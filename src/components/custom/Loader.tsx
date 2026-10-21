"use client";

import React from "react";
import { useLoading } from "@/hooks/use-loading";

/**
 * Modern non-blocking feedback indicator.
 * Replaces the disruptive full-screen blocker with a sleek, non-intrusive status pill.
 */
const GlobalLoader: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none transition-all animate-in fade-in duration-150">
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#12141c]/95 border border-[#ccff00]/40 shadow-xl shadow-black/80 backdrop-blur-md">
        <div className="size-3 rounded-full border-2 border-[#ccff00]/30 border-t-[#ccff00] animate-spin" />
        <span className="text-[11px] font-mono font-bold text-[#ccff00] uppercase tracking-wider">
          Syncing...
        </span>
      </div>
    </div>
  );
};

export default GlobalLoader;