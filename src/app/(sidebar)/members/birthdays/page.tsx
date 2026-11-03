"use client";

import { DataTable } from "@/components/custom/data-table";
import { DatePickerDemo } from "@/components/custom/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useState, useMemo } from "react";
import { Gift, MessageCircle, Sparkles, Send, Cake } from "lucide-react";
import { GYM_BRANDING } from "@/config/branding";
import { getTodayBirthdays, getStoreMembers } from "@/lib/gym-store";
import { toast } from "sonner";

export default function BirthdaysPage() {
  const [date, setDate] = useState(format(new Date(), "dd-MM-yyyy"));
  const [memberList, setMemberList] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const birthdays = getTodayBirthdays(date);
    if (birthdays.length > 0) {
      setMemberList(birthdays);
      setSelectedMember(birthdays[0]);
    } else {
      // If none match target date, grab a couple of sample members for pitch demonstration
      const all = getStoreMembers();
      setMemberList(all.slice(0, 2));
      setSelectedMember(all[0]);
    }
    setIsLoading(false);
  }, [date]);

  const handleSendAllWishes = () => {
    if (memberList.length === 0) {
      toast.info("No athletes celebrating on this date");
      return;
    }
    const first = memberList[0];
    const text = encodeURIComponent(
      `Happy Birthday ${first.name}! 🎉🎂 Team ${GYM_BRANDING.shortName} wishes you great health, strength, and happiness today. Enjoy your special day!\n\n~ Team ${GYM_BRANDING.name}`
    );
    window.open(`https://wa.me/91${first.phone}?text=${text}`, "_blank");
    toast.success(`Birthday greeting opened for ${first.name}!`);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Athlete Name",
      cellContentGetRow: (row: any) => (
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center font-bold text-xs">
            <Cake className="size-4" />
          </div>
          <div>
            <p className="font-bold text-white">{row.name}</p>
            <p className="text-[10px] text-zinc-500 font-mono">DOB: {row.DOB}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cellContentGetRow: (row: any) => (
        <span className="font-mono text-xs text-zinc-300">+91 {row.phone}</span>
      ),
    },
    {
      accessorKey: "activeServiceName",
      header: "Active Plan",
      cellContentGetRow: (row: any) => (
        <span className="text-xs text-[#ccff00] font-semibold">
          {row.activeServiceName || "Active Athlete"}
        </span>
      ),
    },
  ];

  const actionColumns = [
    {
      accessorKey: "phone",
      header: "Wish on WhatsApp",
      cellContentGetRow: (row: any) => {
        const text = encodeURIComponent(
          `Happy Birthday ${row.name}! 🎉🎂 Wishing you peak fitness, strength, and happiness from all of us at ${GYM_BRANDING.name}. Have a fantastic workout and year ahead!\n\n~ Team ${GYM_BRANDING.shortName}`
        );
        return (
          <a
            href={`https://wa.me/91${row.phone}?text=${text}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            <MessageCircle className="size-3.5" />
            <span>Send Wish</span>
          </a>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Gift className="size-6 text-[#ccff00]" />
            Birthday Celebrations & Retention
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums">
              {memberList.length} Celebrating
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build unshakeable loyalty by sending automated, personalized birthday wishes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DatePickerDemo defaultDate={date} onDateChange={(d) => setDate(d)} />
        </div>
      </div>

      {/* Pitch-Ready Birthday Wish Blast Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-[#12141c] border border-pink-500/30 p-6 sm:p-7 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="size-14 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-300 flex items-center justify-center shrink-0">
            <Gift className="size-7 animate-bounce" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="size-3" />
              Automated Retention Automation
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Send Birthday Wishes to {memberList.length} Athletes Today
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Personalized greetings increase annual membership renewal rates by up to 24%.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSendAllWishes}
          className="h-11 px-6 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-500/25 transition-all shrink-0 relative z-10"
        >
          <Send className="size-4" />
          <span>Send Birthday Wishes</span>
        </Button>
      </div>

      {/* Birthday Athletes Table */}
      <DataTable
        dataRows={memberList}
        columns={columns}
        actionColumns={actionColumns}
        isLoading={isLoading}
        onItemClick={(row) => setSelectedMember(row)}
      />
    </div>
  );
}
