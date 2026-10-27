"use client";

import { EnquiryResponse, GetAllEnquiry } from "@/action/enquiries.action";
import { DataTable } from "@/components/custom/data-table";
import { useLoading } from "@/hooks/use-loading";
import { UserPlus, Search, Phone, Calendar, MessageSquare, Footprints, PhoneCall, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {};

const columns = [
  {
    accessorKey: "name",
    header: "Lead Name",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-[#ccff00]">
          {row.original.name?.[0]?.toUpperCase() || "L"}
        </div>
        <span className="font-bold text-zinc-100">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs text-zinc-300">
        +91 {row.original.phone?.toString()}
      </span>
    ),
  },
  {
    accessorKey: "followupDate",
    header: "Follow Up",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs text-zinc-400">
        {row.original.followupDate || "—"}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Acquisition Channel",
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
    header: "Interest / Requirement",
    cell: ({ row }: any) => (
      <span className="text-xs text-zinc-400 max-w-sm truncate block">
        {row.original.message || "General Membership Query"}
      </span>
    ),
  },
];

import { DUMMY_ENQUIRIES } from "@/lib/dummy-data";

const EnquiryPage = (props: Props) => {
  const [enquiries, setEnquiries] = useState<any[]>(DUMMY_ENQUIRIES);
  const { isLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAllEnquiry();
        if (Array.isArray(data) && data.length > 0) {
          setEnquiries(data);
        } else {
          setEnquiries(DUMMY_ENQUIRIES);
        }
      } catch (err) {
        setEnquiries(DUMMY_ENQUIRIES);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Prospect Enquiries & Lead Pipeline
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums font-mono">
              {enquiries.length} Active Leads
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track walk-in visitors, calls, Instagram DMs, and WhatsApp inquiries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/enquiries/new"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer"
          >
            <UserPlus className="size-3.5 stroke-[2.2]" />
            <span>New Enquiry</span>
          </Link>
        </div>
      </div>

      <DataTable dataRows={enquiries} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default EnquiryPage;