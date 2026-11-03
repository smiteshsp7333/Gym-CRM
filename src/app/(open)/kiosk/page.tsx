"use client";

import React, { useState, useEffect } from "react";
import { GYM_BRANDING } from "@/config/branding";
import {
  getStoreMembers,
  recordStoreAttendance,
  getStoreAttendance,
  DummyMember,
} from "@/lib/gym-store";
import {
  QrCode,
  Flame,
  CheckCircle2,
  Delete,
  ArrowLeft,
  Clock,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Search,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function KioskPage() {
  const [pin, setPin] = useState("");
  const [members, setMembers] = useState<DummyMember[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const [checkedInMember, setCheckedInMember] = useState<any>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setMembers(getStoreMembers());
    setRecentCheckIns(getStoreAttendance(format(new Date(), "dd-MM-yyyy")));

    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "hh:mm:ss a • EEEE, dd MMMM yyyy"));
    }, 1000);
    setCurrentTime(format(new Date(), "hh:mm:ss a • EEEE, dd MMMM yyyy"));

    return () => clearInterval(timer);
  }, []);

  // Web Audio API chime on check-in
  const playSuccessChime = () => {
    try {
      if (typeof window !== "undefined") {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      }
    } catch {}
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        processPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  const processPin = (inputPin: string) => {
    // Find member by:
    // 1. Last 4 digits of phone
    // 2. Member code number (e.g. "1001" matches "MEM-1001")
    // 3. Or ID suffix
    const all = getStoreMembers();
    const matched = all.find((m) => {
      const codeDigits = (m.memberCode || "").replace(/\D/g, "");
      const phoneEnd = (m.phone || "").slice(-4);
      return codeDigits === inputPin || phoneEnd === inputPin || codeDigits.endsWith(inputPin);
    });

    if (matched) {
      const result = recordStoreAttendance(matched.id, "kiosk");
      setCheckedInMember(matched);
      setFeedbackMessage(result.message || `Welcome to ${GYM_BRANDING.name}!`);
      playSuccessChime();
      setRecentCheckIns(getStoreAttendance(format(new Date(), "dd-MM-yyyy")));

      setTimeout(() => {
        setPin("");
        setCheckedInMember(null);
        setFeedbackMessage("");
      }, 3500);
    } else {
      setFeedbackMessage("Athlete code not found. Please try again or ask reception.");
      setTimeout(() => {
        setPin("");
        setFeedbackMessage("");
      }, 2000);
    }
  };

  const handleQuickCheckin = (member: DummyMember) => {
    const result = recordStoreAttendance(member.id, "kiosk");
    setCheckedInMember(member);
    setFeedbackMessage(result.message || `Welcome, ${member.name}!`);
    playSuccessChime();
    setRecentCheckIns(getStoreAttendance(format(new Date(), "dd-MM-yyyy")));

    setTimeout(() => {
      setCheckedInMember(null);
      setFeedbackMessage("");
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="size-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#ccff00]/40 transition-all cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              {GYM_BRANDING.name}
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 uppercase">
                Front-Desk Kiosk Mode
              </span>
            </h1>
            <p className="text-xs text-zinc-400 font-mono">{currentTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Scanner Online
          </span>
        </div>
      </header>

      {/* Center Body */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Keypad Terminal (7 Cols) */}
        <div className="lg:col-span-7 bg-[#12141c]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-bold uppercase tracking-wider mb-2">
              <QrCode className="size-3.5" />
              Express Biometric Check-In
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Enter Your 4-Digit Athlete PIN
            </h2>
            <p className="text-xs text-zinc-400">
              Enter Member ID digits (e.g. 1001) or last 4 digits of registered phone number
            </p>
          </div>

          {/* PIN Display Boxes */}
          <div className="flex justify-center items-center gap-3">
            {[0, 1, 2, 3].map((idx) => {
              const char = pin[idx];
              return (
                <div
                  key={idx}
                  className={`size-14 sm:size-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black font-mono transition-all duration-200 ${
                    char
                      ? "border-[#ccff00] bg-[#ccff00]/15 text-[#ccff00] shadow-lg shadow-[#ccff00]/20 scale-105"
                      : "border-white/10 bg-white/[0.02] text-zinc-600"
                  }`}
                >
                  {char || "•"}
                </div>
              );
            })}
          </div>

          {/* Status / Feedback message */}
          {feedbackMessage && (
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center text-xs font-semibold text-zinc-200 animate-pulse">
              {feedbackMessage}
            </div>
          )}

          {/* Numeric Keypad Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="h-14 sm:h-16 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-[#ccff00]/20 border border-white/[0.08] hover:border-[#ccff00]/30 text-xl font-black text-white transition-all cursor-pointer flex items-center justify-center shadow-md active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 sm:h-16 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-bold text-zinc-400 hover:text-white uppercase transition-all cursor-pointer flex items-center justify-center active:scale-95"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress("0")}
              className="h-14 sm:h-16 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-[#ccff00]/20 border border-white/[0.08] hover:border-[#ccff00]/30 text-xl font-black text-white transition-all cursor-pointer flex items-center justify-center shadow-md active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-14 sm:h-16 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all cursor-pointer flex items-center justify-center active:scale-95"
            >
              <Delete className="size-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Check-In Card or Quick Tap (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {checkedInMember ? (
            /* Pop-up Celebration Card */
            <div className="bg-[#12141c] border-2 border-[#ccff00] rounded-3xl p-7 shadow-2xl shadow-[#ccff00]/25 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="size-20 rounded-full bg-[#ccff00]/20 text-[#ccff00] mx-auto flex items-center justify-center border-2 border-[#ccff00] shadow-lg shadow-[#ccff00]/30 animate-bounce">
                <CheckCircle2 className="size-10 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Access Approved • Biometric Verified
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {checkedInMember.name}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {checkedInMember.memberCode || "MEM-1001"} • +91 {checkedInMember.phone}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs space-y-1">
                <p className="text-slate-400">Active Membership Package</p>
                <p className="text-sm font-bold text-[#ccff00]">
                  {checkedInMember.activeServiceName || "Full Gym Access"}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 py-2 rounded-xl">
                <Flame className="size-4 text-amber-400 fill-amber-400" />
                <span>14 Days Consistency Streak! Keep Going!</span>
              </div>
            </div>
          ) : (
            /* Front Desk Quick-Tap Athlete Selector */
            <div className="bg-[#12141c]/90 border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="size-4 text-[#ccff00]" />
                  Quick Tap Check-In
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">Click to check in</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pe-1">
                {members.slice(0, 6).map((mem) => (
                  <button
                    key={mem.id}
                    type="button"
                    onClick={() => handleQuickCheckin(mem)}
                    className="w-full p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#ccff00]/40 flex items-center justify-between transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center font-bold text-xs text-[#ccff00] group-hover:scale-105 transition-transform">
                        {mem.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-colors">
                          {mem.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          {mem.memberCode} • PIN: {mem.memberCode?.replace(/\D/g, "").slice(-4) || "1001"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 group-hover:bg-[#ccff00]/15 group-hover:text-[#ccff00] transition-colors">
                      Check in
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Today's Stream */}
          <div className="bg-[#12141c]/60 border border-white/[0.06] rounded-2xl p-4 text-xs text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-[#ccff00]" />
              Today&apos;s Total Check-Ins:
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {recentCheckIns.length} Athletes
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs text-zinc-500 relative z-10">
        <span>{GYM_BRANDING.name} Reception Terminal</span>
        <Link
          href="/dashboard"
          className="text-[#ccff00] hover:underline font-semibold flex items-center gap-1"
        >
          Exit Kiosk Mode <ArrowLeft className="size-3 rotate-180" />
        </Link>
      </footer>
    </div>
  );
}
