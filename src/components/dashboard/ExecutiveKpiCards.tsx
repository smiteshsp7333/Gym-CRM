"use client";

import React from "react";
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  Wallet,
  CalendarCheck2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface KpiProps {
  totalRevenue: number;
  activeMembersCount: number;
  totalMembersCount: number;
  todayAttendanceCount: number;
  pendingDuesAmount: number;
  pendingDuesCount: number;
}

export function ExecutiveKpiCards({
  totalRevenue,
  activeMembersCount,
  totalMembersCount,
  todayAttendanceCount,
  pendingDuesAmount,
  pendingDuesCount,
}: KpiProps) {
  const retentionRate =
    totalMembersCount > 0
      ? Math.round((activeMembersCount / totalMembersCount) * 100)
      : 88;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {/* 1. Total Revenue Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#12141c] border border-white/[0.08] p-5 hover:border-[#ccff00]/40 transition-all duration-300 group shadow-xl shadow-black/40">
        <div className="flex items-center justify-between mb-3">
          <div className="size-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#ccff00]">
            <Wallet className="size-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25">
            <ArrowUpRight className="size-3.5" />
            +23.4%
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Revenue
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-white tabular-nums">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
        {/* Neon Lime Sparkline SVG wave */}
        <div className="mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>This month vs last</span>
          <svg className="w-24 h-6 text-[#ccff00]" viewBox="0 0 100 25" fill="none">
            <path
              d="M0 20 Q 20 5, 40 15 T 70 8 T 100 2"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="2" r="3" fill="#ccff00" className="animate-ping opacity-75" />
            <circle cx="100" cy="2" r="2.5" fill="#ccff00" />
          </svg>
        </div>
      </div>

      {/* 2. Active Members Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#12141c] border border-white/[0.08] p-5 hover:border-cyan-400/40 transition-all duration-300 group shadow-xl shadow-black/40">
        <div className="flex items-center justify-between mb-3">
          <div className="size-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400">
            <Users className="size-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/25">
            {retentionRate}% Retention
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Active Members
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-white tabular-nums">
              {activeMembersCount}
            </h3>
            <span className="text-xs text-slate-400">/ {totalMembersCount} enrolled</span>
          </div>
        </div>
        {/* Cyan Sparkline SVG wave */}
        <div className="mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>+4 added this week</span>
          <svg className="w-24 h-6 text-cyan-400" viewBox="0 0 100 25" fill="none">
            <path
              d="M0 18 Q 25 22, 50 10 T 80 12 T 100 3"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="3" r="2.5" fill="#06b6d4" />
          </svg>
        </div>
      </div>

      {/* 3. Daily Attendance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#12141c] border border-white/[0.08] p-5 hover:border-amber-400/40 transition-all duration-300 group shadow-xl shadow-black/40">
        <div className="flex items-center justify-between mb-3">
          <div className="size-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-400">
            <CalendarCheck2 className="size-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/25 font-mono">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Peak: 18:00 - 20:00
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Today&apos;s Check-ins
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-white tabular-nums">
              {todayAttendanceCount}
            </h3>
            <span className="text-xs text-slate-400">athletes on floor</span>
          </div>
        </div>
        {/* Amber Sparkline SVG wave */}
        <div className="mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>64% daily occupancy</span>
          <svg className="w-24 h-6 text-amber-400" viewBox="0 0 100 25" fill="none">
            <path
              d="M0 12 Q 25 3, 50 18 T 75 8 T 100 4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="4" r="2.5" fill="#f59e0b" />
          </svg>
        </div>
      </div>

      {/* 4. Pending Dues Recovery Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#12141c] border border-white/[0.08] p-5 hover:border-rose-400/40 transition-all duration-300 group shadow-xl shadow-black/40">
        <div className="flex items-center justify-between mb-3">
          <div className="size-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-rose-400">
            <AlertCircle className="size-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-400/10 text-rose-400 border border-rose-400/25 font-mono">
            {pendingDuesCount} Pending
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Pending Dues
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-rose-300 tabular-nums">
              ₹{pendingDuesAmount.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
        {/* WhatsApp recovery action cue */}
        <div className="mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
          <span>Ready for 1-click WhatsApp nudge</span>
          <span className="text-[#ccff00] font-medium group-hover:underline flex items-center gap-1">
            Collect <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveKpiCards;
