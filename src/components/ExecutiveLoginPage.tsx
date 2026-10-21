"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GYM_BRANDING } from "@/config/branding";
import { loginAdmin } from "@/lib/auth";
import { LoginMember } from "@/action/auth.action";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function ExecutiveLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  // Mode: "admin" | "member"
  const [loginMode, setLoginMode] = useState<"admin" | "member">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLostPasswordModal, setShowLostPasswordModal] = useState(false);

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Check if already authenticated
  useEffect(() => {
    const adminSession = localStorage.getItem("admin_session");
    const pin = localStorage.getItem("pin");
    if (adminSession === "true" || pin === GYM_BRANDING.adminCredentials.pin) {
      router.replace(returnUrl);
    }
  }, [router, returnUrl]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      toast.error("Please enter your username/phone and password");
      return;
    }

    setIsLoading(true);

    // Auto-detect admin vs member:
    // If identifier is "admin" or doesn't look like a 10-digit phone number, or explicitly in admin mode
    const isPureDigits10 = /^\d{10}$/.test(cleanId);
    const targetMode = loginMode === "member" || (isPureDigits10 && cleanId !== "admin") ? "member" : "admin";

    if (targetMode === "admin") {
      await new Promise((r) => setTimeout(r, 350));
      const success = loginAdmin(cleanId, cleanPass);
      setIsLoading(false);

      if (success) {
        toast.success("Welcome back! Executive access granted.");
        router.replace(returnUrl);
      } else {
        toast.error("Invalid administrator credentials. Please check your username and password.");
      }
    } else {
      // Member login via Server Action
      const res = await LoginMember({
        phone: cleanId,
        password: cleanPass,
      });
      setIsLoading(false);

      if (res.success && res.id) {
        toast.success("Welcome back! Signed in successfully.");
        localStorage.setItem("member_id", res.id);
        router.replace("/user");
      } else {
        toast.error("Incorrect athlete phone number or password.");
      }
    }
  };

  // 1-Click Superadmin Demo Fill
  const handleSuperadminClick = () => {
    setLoginMode("admin");
    setIdentifier(GYM_BRANDING.adminCredentials.username);
    setPassword(GYM_BRANDING.adminCredentials.password);
    toast.info("Superadmin credentials populated! Click 'Sign In Here' or press Enter.");
  };

  const handleMemberDemoFill = () => {
    setLoginMode("member");
    setIdentifier("9876543210");
    setPassword("Test@12345");
    toast.info("Demo Member phone populated. Ready to sign in.");
  };

  return (
    <div className="min-h-screen w-full bg-[#121316] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Tablet Device Mockup Outer Frame (Exact match to reference) */}
      <div className="w-full max-w-[1100px] min-h-[640px] rounded-[32px] sm:rounded-[42px] border-[10px] sm:border-[16px] border-[#1f2026] shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative bg-[#0e0f14]">
        
        {/* ============================================================== */}
        {/* LEFT PANEL: Dark Architectural Ribs Wallpaper (From Reference) */}
        {/* ============================================================== */}
        <div className="relative bg-[#0b0c10] flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[380px] lg:min-h-[600px] overflow-hidden">
          
          {/* Architectural Curved Louver Ribs Background Texture */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-1000 scale-105"
            style={{
              backgroundImage: `url('/architectural_dark_ribs.jpg')`,
            }}
          />
          {/* Deep studio vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />

          {/* TOP-LEFT: Floating Glassmorphic "Superadmin Login" Pill */}
          <div className="relative z-10 flex items-start justify-between">
            <button
              type="button"
              onClick={handleSuperadminClick}
              title="Click to auto-populate Superadmin credentials"
              className="group text-left inline-flex items-center gap-3 px-3.5 py-2 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/15 hover:border-white/30 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/90 group-hover:bg-white/20 transition-colors">
                {/* 4 dots / grid geometric icon */}
                <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 16 16">
                  <rect x="2" y="2" width="4.5" height="4.5" rx="1" />
                  <rect x="9.5" y="2" width="4.5" height="4.5" rx="1" />
                  <rect x="2" y="9.5" width="4.5" height="4.5" rx="1" />
                  <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="1" />
                </svg>
              </div>
              <div className="flex flex-col pr-1">
                <span className="text-[12px] font-medium text-white tracking-tight flex items-center gap-1.5 leading-none">
                  Superadmin Login
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] inline-block" />
                </span>
                <span className="text-[10px] text-white/55 font-normal mt-0.5 leading-none">
                  Setup Gym Rates, Interest Rate etc..
                </span>
              </div>
            </button>

            {/* Quick Demo Fill Pill for Member */}
            <button
              type="button"
              onClick={handleMemberDemoFill}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all backdrop-blur-sm border border-white/10 hidden sm:inline-block"
            >
              Athlete Demo
            </button>
          </div>

          {/* BOTTOM ROW: Logo + Brand + Copyright + Domain (Exact Reference Match) */}
          <div className="relative z-10 pt-8 mt-auto flex items-end justify-between text-white/60 text-[11px] font-mono border-t border-white/10">
            {/* Geometric Logo (Triangular steps like Nestvested) */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-end gap-0.5">
                <div className="w-1.5 h-4 bg-white rounded-xs" />
                <div className="w-1.5 h-3 bg-white/80 rounded-xs" />
                <div className="w-1.5 h-2 bg-white/60 rounded-xs" />
                <div className="w-1.5 h-1 bg-white/40 rounded-xs" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight font-sans">
                {GYM_BRANDING.name}™
              </span>
            </div>

            {/* Center Copyright */}
            <span className="hidden sm:inline-block text-white/45 text-[11px]">
              © {GYM_BRANDING.name} Limited {new Date().getFullYear()}
            </span>

            {/* Right Domain */}
            <span className="text-white/45 text-[11px]">
              www.nestvested.co
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: Crisp White Minimalist Editorial Card             */}
        {/* ============================================================== */}
        <div className="bg-white text-zinc-900 flex flex-col justify-between p-8 sm:p-12 lg:p-14 h-full relative">
          
          {/* TOP HEADER: Brand Title & Subtitle */}
          <div>
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div>
                <div className="text-xs font-semibold text-zinc-900 tracking-tight">
                  {GYM_BRANDING.name} Limited™
                </div>
                <div className="text-[11px] text-zinc-400 font-normal mt-0.5">
                  Gym Management & Operations Platform
                </div>
              </div>

              {/* Subtle Role Indicator / Pill */}
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] border border-black/20" />
                {loginMode === "admin" ? "Admin Portal" : "Athlete Portal"}
              </div>
            </div>

            {/* EDITORIAL MAIN HEADLINE (Exact Wording from Reference) */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-[42px] font-normal text-zinc-900 tracking-tight leading-[1.12]">
                Welcome, login to <br />
                your account.
              </h1>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Field 1: Username or Email Address */}
              <div>
                <label className="block text-xs font-normal text-zinc-700 mb-1.5">
                  Username or Email Address:
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full h-12 px-6 rounded-full bg-[#f0f0f0] text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all border-0 shadow-inner"
                />
              </div>

              {/* Field 2: Password */}
              <div>
                <label className="block text-xs font-normal text-zinc-700 mb-1.5">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your First Name"
                    className="w-full h-12 px-6 pr-12 rounded-full bg-[#f0f0f0] text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all border-0 shadow-inner font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ACTIONS ROW: Dark Pill Button + "Lost your password?" link */}
              <div className="pt-2 sm:pt-4 flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 sm:h-12 px-8 sm:px-9 rounded-full bg-[#1b2621] hover:bg-[#111915] text-white text-xs font-medium tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    "Sign In Here"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowLostPasswordModal(true)}
                  className="text-xs text-zinc-600 hover:text-zinc-950 underline underline-offset-4 font-normal transition-colors cursor-pointer"
                >
                  Lost your password?
                </button>
              </div>
            </form>
          </div>

          {/* BOTTOM FOOTER: Domain Link */}
          <div className="pt-6 mt-8 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-400">
            <span>www.nestvested.co</span>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                Demo Admin: admin / admin123
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lost Password Dialog Modal */}
      {showLostPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white text-zinc-900 p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Password Recovery
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Access reset instructions for {GYM_BRANDING.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLostPasswordModal(false)}
                className="text-zinc-400 hover:text-zinc-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
              <div>
                <strong className="text-zinc-900 block font-semibold mb-0.5">
                  1. Administrator Access
                </strong>
                Default pitch credentials are username: <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-900 font-mono">admin</code>, password: <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-900 font-mono">admin123</code> (or PIN: <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-900 font-mono">0987</code>).
              </div>
              <div className="pt-2 border-t border-zinc-200">
                <strong className="text-zinc-900 block font-semibold mb-0.5">
                  2. Registered Athletes
                </strong>
                Athletes can sign in using their 10-digit mobile number and default account password <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-900 font-mono">Test@12345</code>. Contact the gym front desk to reset your PIN.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowLostPasswordModal(false);
                handleSuperadminClick();
              }}
              className="w-full h-10 rounded-full bg-[#1b2621] hover:bg-[#111915] text-white text-xs font-semibold cursor-pointer transition-all"
            >
              Fill Superadmin Demo Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
