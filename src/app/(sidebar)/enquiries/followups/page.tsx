"use client";

import { GetEnquiryByFollowupDate } from "@/action/enquiries.action";
import { DataTable } from "@/components/custom/data-table";
import { DatePickerDemo } from "@/components/custom/date-picker";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Calendar,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Users,
} from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";

const columns = [
  {
    accessorKey: "name",
    header: "Prospect Name",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-200 text-xs">
          {row.original.name?.[0]?.toUpperCase() || "L"}
        </div>
        <span className="font-bold text-zinc-100">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Mobile Number",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs text-zinc-300">
        +91 {row.original.phone?.toString()}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Channel",
    cell: ({ row }: any) => {
      const type = row.original.type;
      const colors: Record<string, string> = {
        walkin: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        call: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        instagram: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        whatsapp: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      };
      return (
        <span
          className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
            colors[type] || "bg-zinc-800 text-zinc-300 border-zinc-700"
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Requirement / Interest",
    cell: ({ row }: any) => (
      <span className="text-xs text-zinc-400 max-w-xs truncate block">
        {row.original.message || "General Membership Query"}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Quick Outreach",
    cell: ({ row }: any) => {
      const phone = row.original.phone?.toString();
      const name = row.original.name;
      const text = `Hi ${name}, greeting from ${GYM_BRANDING.name}! Just following up on your gym membership inquiry. Would you like to schedule a free trial workout session today?`;
      return (
        <a
          href={`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold transition-all shadow-sm"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
      );
    },
  },
];

const EnquiryFollowupsPage = () => {
  const [memberList, setMemberList] = useState<any[]>([]);
  const [date, setDate] = useState(format(new Date(), "dd-MM-yyyy"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await GetEnquiryByFollowupDate(date);
        setMemberList(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [date]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/enquiries"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Enquiries
            </Link>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold uppercase tracking-wider">
              Retention Radar
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Scheduled Enquiry Follow-Ups
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Target prospective leads scheduled for trial workouts and package follow-ups for {GYM_BRANDING.name}.
          </p>
        </div>

        {/* Date Filter & Count */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <DatePickerDemo defaultDate={date} onDateChange={(newDate) => setDate(newDate)} />
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#12141c] border border-zinc-800 flex items-center gap-2 text-xs font-mono font-bold text-[#ccff00]">
            <Users className="h-4 w-4" />
            {memberList.length} Scheduled
          </div>
        </div>
      </div>

      {/* Modern Data Table */}
      <DataTable dataRows={memberList} isLoading={isLoading} columns={columns} />
    </div>
  );
};

export default EnquiryFollowupsPage;