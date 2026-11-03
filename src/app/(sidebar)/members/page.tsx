"use client";

import { updateReviewStatus } from "@/action/member.action";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoading } from "@/hooks/use-loading";
import {
  Check,
  X,
  Gift,
  UserPlus,
  MessageCircle,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { GYM_BRANDING } from "@/config/branding";
import {
  getStoreMembers,
  updateStoreMember,
  getStoreSales,
  getTodayBirthdays,
  getExpiringMembers,
} from "@/lib/gym-store";

type FilterChip = "all" | "active" | "expiring" | "dues" | "birthdays" | "noplan";

export default function MemberPage() {
  const router = useRouter();
  const [memberList, setMemberList] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterChip>("all");
  const { showLoading, hideLoading, isLoading } = useLoading();

  const loadData = React.useCallback(() => {
    const list = getStoreMembers();
    setMemberList(list);
  }, []);

  useEffect(() => {
    loadData();
    const handleStoreUpdate = () => {
      loadData();
    };
    window.addEventListener("gym_store_updated", handleStoreUpdate);
    return () => window.removeEventListener("gym_store_updated", handleStoreUpdate);
  }, [loadData]);

  // Derived metrics for filter chips
  const sales = useMemo(() => getStoreSales(), [memberList]);
  const todayBirthdays = useMemo(() => getTodayBirthdays(), [memberList]);
  const expiringSales = useMemo(() => getExpiringMembers(7), [sales]);

  const memberStatusMap = useMemo(() => {
    const map = new Map<string, { status: "active" | "expiring" | "expired" | "noplan"; label: string; badgeClass: string }>();
    const salesByMember = new Map<string, any[]>();

    for (const s of sales) {
      const arr = salesByMember.get(s.member_id) || [];
      arr.push(s);
      salesByMember.set(s.member_id, arr);
    }

    const expiringMemberIds = new Set(expiringSales.map((e) => e.member_id));

    for (const m of memberList) {
      if (expiringMemberIds.has(m.id)) {
        map.set(m.id, {
          status: "expiring",
          label: "Expiring Soon",
          badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        });
      } else if (m.activeServiceName) {
        map.set(m.id, {
          status: "active",
          label: "Active Plan",
          badgeClass: "bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/30",
        });
      } else {
        map.set(m.id, {
          status: "noplan",
          label: "No Active Plan",
          badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        });
      }
    }
    return map;
  }, [memberList, sales, expiringSales]);

  // Filtered members based on active chip
  const filteredMembers = useMemo(() => {
    if (filter === "all") return memberList;
    if (filter === "active") {
      return memberList.filter((m) => memberStatusMap.get(m.id)?.status === "active");
    }
    if (filter === "expiring") {
      const expiringIds = new Set(expiringSales.map((e) => e.member_id));
      return memberList.filter((m) => expiringIds.has(m.id));
    }
    if (filter === "dues") {
      const dueMemberIds = new Set(
        sales.filter((s) => (s.dueAmount || 0) > 0).map((s) => s.member_id)
      );
      return memberList.filter((m) => dueMemberIds.has(m.id));
    }
    if (filter === "birthdays") {
      const bdayIds = new Set(todayBirthdays.map((b) => b.id));
      return memberList.filter((m) => bdayIds.has(m.id));
    }
    if (filter === "noplan") {
      return memberList.filter((m) => !m.activeServiceName);
    }
    return memberList;
  }, [memberList, filter, memberStatusMap, expiringSales, sales, todayBirthdays]);

  const columns = [
    {
      accessorKey: "name",
      header: "Athlete Name",
      cellContentGetRow: (row: any) => {
        const info = memberStatusMap.get(row.id);
        return (
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-[#ccff00]">
              {row.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-bold text-white hover:text-[#ccff00] transition-colors">{row.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-zinc-400 font-mono">{row.memberCode || "MEM-1000"}</span>
                {info && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${info.badgeClass}`}>
                    {info.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
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
      header: "Active Package",
      cellContentGetRow: (row: any) => (
        <span className="text-xs font-semibold text-zinc-200">
          {row.activeServiceName || <span className="text-zinc-500 font-normal italic">None (Enrolled)</span>}
        </span>
      ),
    },
    {
      accessorKey: "age",
      header: "Age",
      cellContentGetRow: (row: any) => (
        <span className="text-xs text-zinc-400 tabular-nums">{row.age || 26} yrs</span>
      ),
    },
  ];

  const actionColumns = [
    {
      accessorKey: "id",
      header: "Bill Plan",
      cellContentGetRow: (row: any) => (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2.5 rounded-lg border-zinc-800 bg-zinc-900/60 hover:bg-[#ccff00]/15 hover:text-[#ccff00] hover:border-[#ccff00]/40 text-xs text-zinc-300 cursor-pointer gap-1"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/sales/new?member_id=${row.id}`);
          }}
        >
          <CreditCard className="size-3" />
          <span>Issue Plan</span>
        </Button>
      ),
    },
    {
      accessorKey: "phone",
      header: "WhatsApp",
      cellContentGetRow: (row: any) => {
        const text = encodeURIComponent(
          `Hi ${row.name}, greeting from ${GYM_BRANDING.name}! We look forward to seeing you at today's workout. Stay strong, stay healthy!\n\n- Team ${GYM_BRANDING.shortName}`
        );
        return (
          <a
            href={`https://wa.me/91${row.phone}?text=${text}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center size-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
            title="Send WhatsApp Message"
          >
            <MessageCircle className="size-4" />
          </a>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Review",
      cellContentGetRow: (row: any) => (
        <ReviewButton id={row.id} isDone={Boolean(row.reviewDone)} />
      ),
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Member Directory
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums">
              {filteredMembers.length} Athletes
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage athlete memberships, plan renewals, review statuses, and profile records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/members/birthdays"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <Gift className="size-3.5 text-[#ccff00]" />
            <span>Birthdays</span>
          </Link>
          <Link
            href="/members/new"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer"
          >
            <UserPlus className="size-3.5 stroke-[2.2]" />
            <span>Register Member</span>
          </Link>
        </div>
      </div>

      {/* 1-Click Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
        {[
          { key: "all", label: `All Athletes (${memberList.length})` },
          { key: "active", label: `Active Plans (${memberList.filter((m) => m.activeServiceName).length})` },
          { key: "expiring", label: `Expiring in 7 Days (${expiringSales.length})` },
          { key: "dues", label: `Pending Balance (${sales.filter((s) => (s.dueAmount || 0) > 0).length})` },
          { key: "birthdays", label: `Birthday Today (${todayBirthdays.length})` },
          { key: "noplan", label: `Enrolled / No Plan (${memberList.filter((m) => !m.activeServiceName).length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key as FilterChip)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              filter === key
                ? "bg-[#ccff00] text-black border-[#ccff00] shadow-md shadow-[#ccff00]/20"
                : "bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Data Table with Pulse Skeletons & Custom Item Click */}
      <DataTable
        dataRows={filteredMembers}
        isLoading={isLoading}
        columns={columns}
        actionColumns={actionColumns}
        onItemClick={(row) => router.push(`/members/${row.id}`)}
      />
    </div>
  );
}

const ReviewButton = ({ id, isDone }: { id: string; isDone: boolean }) => {
  const [isTick, setIsTick] = useState(isDone);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsTick(isDone);
  }, [isDone]);

  const updateReview = async (e: React.MouseEvent, status: boolean) => {
    e.stopPropagation();
    setLoading(true);
    setIsTick(status);

    // Update in unified store
    updateStoreMember(id, { reviewDone: status });

    // Background sync to server
    try {
      await updateReviewStatus(id, status);
      toast.success(status ? "Member review verified" : "Review marked pending");
    } catch {
      // optimistic update retained
    } finally {
      setLoading(false);
    }
  };

  if (!isTick) {
    return (
      <Button
        size="icon"
        variant="destructive"
        className="cursor-pointer size-8 rounded-lg"
        onClick={(e) => updateReview(e, true)}
        title="Mark review completed"
      >
        {!loading ? (
          <X className="size-3.5" />
        ) : (
          <div className="animate-spin rounded-full h-3.5 w-3.5 border-l-2 border-b-2 border-white" />
        )}
      </Button>
    );
  } else {
    return (
      <Button
        size="icon"
        variant="default"
        className="cursor-pointer size-8 rounded-lg bg-[#ccff00] text-black hover:bg-[#b8e600]"
        onClick={(e) => updateReview(e, false)}
        title="Review completed (click to reset)"
      >
        {!loading ? (
          <Check className="size-3.5 stroke-[2.5]" />
        ) : (
          <div className="animate-spin rounded-full h-3.5 w-3.5 border-l-2 border-b-2 border-black" />
        )}
      </Button>
    );
  }
};
