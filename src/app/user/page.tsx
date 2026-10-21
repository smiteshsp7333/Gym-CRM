"use client";

import { getAllDetailsOfMember } from "@/action/user.action";
import React, { useEffect, useState } from "react";
import UserDetails from "./_components/UserDetails";
import AttendanceSum from "./_components/AttendanceSum";
import Sales from "./_components/Sales";
import { Button } from "@/components/ui/button";
import { KeyRound, LogOut, MessageCircle, ArrowLeft, Dumbbell, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";

const UserPortalPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (typeof window !== "undefined") {
        const member_id = localStorage.getItem("member_id");
        if (member_id) {
          try {
            const data = await getAllDetailsOfMember(member_id);
            setUserData(data);
          } catch (err) {
            console.error("Failed to load user details", err);
          } finally {
            setIsLoading(false);
          }
        }
      }
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("member_id");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Club Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00] text-black flex items-center justify-center font-black">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white tracking-wide">
                {GYM_BRANDING.name}
              </div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                Member Digital Portal
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${GYM_BRANDING.phone.replace(/[^0-9]/g, "")}?text=Hi%20Coach,%20I%20have%20a%20query%20about%20my%20membership/workout.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp Desk
          </a>
        </div>

        {/* Member Pass */}
        <UserDetails user={userData?.user} />

        {/* Attendance Summary */}
        <AttendanceSum attendance={userData?.allAttendanceOfMember} />

        {/* Membership Plans & Invoices */}
        <Sales activeSales={userData?.activeSales} expiredSales={userData?.inActiveSales} />

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <Link href="/user/change-password">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-zinc-900 border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 text-[#ccff00]" />
              Change Password
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserPortalPage;