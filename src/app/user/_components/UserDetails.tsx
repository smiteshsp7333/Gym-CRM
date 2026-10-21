"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  CalendarCheck,
  Dumbbell,
  QrCode,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";

type Props = {
  user: any;
};

const UserDetails = ({ user }: Props) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GY";

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#12141c] via-[#10121a] to-[#0c0d14] border border-zinc-800/90 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative Glow */}
      <div className="absolute right-0 top-0 w-56 h-56 bg-radial from-[#ccff00]/10 to-transparent pointer-events-none opacity-40" />

      {/* Member Pass Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1d202d] border-2 border-[#ccff00]/60 flex items-center justify-center text-xl font-black text-[#ccff00] shadow-lg shadow-black/50">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {user?.name || "Member Profile"}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              ID: {user?.memberCode || "MEM-001"} · {GYM_BRANDING.name}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#ccff00]" title="Digital Check-in Pass">
          <QrCode className="h-5 w-5" />
        </div>
      </div>

      {/* Contact & Membership Meta Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 text-xs">
        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
          <Phone className="h-4 w-4 text-[#ccff00]" />
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">Registered Phone</div>
            <div className="text-zinc-200 font-mono font-medium">+91 {user?.phone?.toString() || "—"}</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
          <Mail className="h-4 w-4 text-cyan-400" />
          <div className="truncate">
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">Email</div>
            <div className="text-zinc-200 font-medium truncate">{user?.email || "No email registered"}</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
          <CalendarCheck className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">Joined On</div>
            <div className="text-zinc-200 font-medium">{user?.DOJ || "Recently"}</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
          <MapPin className="h-4 w-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">Home Club</div>
            <div className="text-zinc-200 font-medium">{user?.address || GYM_BRANDING.city}</div>
          </div>
        </div>
      </div>

      {/* Direct Workout Hub Button */}
      <div className="pt-2 relative z-10">
        <Link href="/user/workout" className="block">
          <button
            type="button"
            className="w-full h-12 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ccff00]/15 active:scale-[0.98] cursor-pointer"
          >
            <Dumbbell className="h-4 w-4" />
            Open Daily Exercise & Workout Hub
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserDetails;