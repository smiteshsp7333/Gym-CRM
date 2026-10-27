"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Calendar, Plus, UserPlus, Sparkles } from "lucide-react";
import { GYM_BRANDING } from "@/config/branding";

export function SiteHeader() {
  const todayFormatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-white/[0.06] bg-[#090a0f]/90 backdrop-blur-md sticky top-0 z-40 transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left Side: Sidebar Toggle & Brand Title */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-white" />
          <Separator orientation="vertical" className="mx-1 h-4 bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white">
              {GYM_BRANDING.name}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
              <span className="size-1.5 rounded-full bg-[#ccff00] animate-pulse" />
              Live CRM
            </span>
          </div>
        </div>

        {/* Right Side: Date & Quick Actions (Direct Link Routing - Zero Nesting Errors) */}
        <div className="flex items-center gap-2.5">
          {/* Live Date Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 font-mono">
            <Calendar className="size-3.5 text-[#ccff00]" />
            <span>{todayFormatted}</span>
          </div>

          {/* Quick Pitch Demo Seeder */}
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/seed", { method: "POST" });
                const data = await res.json();
                if (data.success) {
                  alert("✨ Pitch Demo Data Primed! 28 Members, Services & Sales loaded.");
                  window.location.reload();
                } else {
                  alert(data.error || "Failed to load demo data.");
                }
              } catch (e: any) {
                alert("Error: " + e.message);
              }
            }}
            title="Populate 28 Indian athletes, plans, sales and attendance for client presentation"
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-xs font-semibold text-[#ccff00] hover:text-white transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="size-3.5 text-[#ccff00]" />
            <span className="hidden xl:inline">Seed Demo</span>
          </button>

          {/* Quick Create Member */}
          <Link
            href="/members/new"
            prefetch={true}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-zinc-700/80 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-600 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="size-3.5 text-[#ccff00]" />
            <span>Member</span>
          </Link>

          {/* Quick Create Sale */}
          <Link
            href="/sales/new"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-md shadow-[#ccff00]/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>New Sale</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
