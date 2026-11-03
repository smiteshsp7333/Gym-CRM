"use client";

import { GetAllEnquiry } from "@/action/enquiries.action";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import {
  UserPlus,
  Phone,
  MessageCircle,
  Footprints,
  PhoneCall,
  Instagram,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GYM_BRANDING } from "@/config/branding";
import { getStoreEnquiries } from "@/lib/gym-store";

export default function EnquiryPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const { isLoading } = useLoading();

  const loadData = React.useCallback(() => {
    const list = getStoreEnquiries();
    setEnquiries(list);
  }, []);

  useEffect(() => {
    loadData();
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("gym_store_updated", handleUpdate);
    return () => window.removeEventListener("gym_store_updated", handleUpdate);
  }, [loadData]);

  const columns = [
    {
      accessorKey: "name",
      header: "Lead Prospect",
      cellContentGetRow: (row: any) => (
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-[#ccff00]">
            {row.name?.[0]?.toUpperCase() || "L"}
          </div>
          <div>
            <span className="font-bold text-zinc-100 block">{row.name}</span>
            {row.status === "converted" && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Converted to Athlete
              </span>
            )}
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
      accessorKey: "followupDate",
      header: "Follow Up",
      cellContentGetRow: (row: any) => (
        <span className="font-mono text-xs text-zinc-400 font-semibold">
          {row.followupDate || "—"}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Acquisition Channel",
      cellContentGetRow: (row: any) => {
        const type = (row.type || "walkin").toLowerCase();
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
      cellContentGetRow: (row: any) => (
        <span className="text-xs text-zinc-400 max-w-sm truncate block">
          {row.message || "General Membership Query"}
        </span>
      ),
    },
  ];

  const actionColumns = [
    {
      accessorKey: "id",
      header: "Convert",
      cellContentGetRow: (row: any) => (
        <Button
          size="sm"
          className="h-7 px-3 rounded-lg bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-[11px] gap-1 cursor-pointer shadow-sm shadow-[#ccff00]/15"
          onClick={(e) => {
            e.stopPropagation();
            router.push(
              `/members/new?name=${encodeURIComponent(row.name)}&phone=${encodeURIComponent(
                row.phone
              )}&lead_id=${row.id}`
            );
          }}
        >
          <UserPlus className="size-3" />
          <span>Enroll</span>
        </Button>
      ),
    },
    {
      accessorKey: "phone",
      header: "WhatsApp",
      cellContentGetRow: (row: any) => {
        const text = encodeURIComponent(
          `Hi ${row.name}, thank you for your enquiry at ${GYM_BRANDING.name}! We'd love to invite you for a free guided workout session. When would you like to drop by?\n\n- Team ${GYM_BRANDING.shortName}`
        );
        return (
          <a
            href={`https://wa.me/91${row.phone}?text=${text}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center size-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
            title="Follow-up on WhatsApp"
          >
            <MessageCircle className="size-4" />
          </a>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Prospect Enquiries & Lead Pipeline
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums font-mono">
              {enquiries.length} Active Leads
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track walk-in visitors, calls, Instagram DMs, and WhatsApp inquiries. Click &apos;Enroll&apos; to convert to member.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/enquiries/new"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer"
          >
            <UserPlus className="size-3.5 stroke-[2.2]" />
            <span>New Lead Enquiry</span>
          </Link>
        </div>
      </div>

      <DataTable
        dataRows={enquiries}
        columns={columns}
        actionColumns={actionColumns}
        isLoading={isLoading}
      />
    </div>
  );
}
