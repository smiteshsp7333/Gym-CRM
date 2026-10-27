"use client";
import {
  GetAllMembers,
  getAllMembersWithActiveSale,
  getAllActiveMembers,
  getAllInActiveMembers,
  updateReviewStatus,
} from "@/action/member.action";
// import { getAllActiveMembers } from '@/action/sales.action'
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoading } from "@/hooks/use-loading";
import { Check, Cross, X, Gift, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {};
const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "activeServiceName",
    header: "Active Service",
    cellClassName: "capitalize",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

const MemberPage = (props: Props) => {
  const router = useRouter();
  const [memberList, setMemberList] = React.useState<any[]>([]);
  const [value, setValue] = React.useState<string>("0");
  const [isSeeding, setIsSeeding] = React.useState<boolean>(false);
  const { showLoading, hideLoading, isLoading } = useLoading();

  const loadData = React.useCallback(async (tabValue: string) => {
    showLoading();
    try {
      let data: any[] = [];
      if (tabValue === "1") {
        data = await getAllActiveMembers();
      } else if (tabValue === "2") {
        data = await getAllInActiveMembers();
      } else {
        data = await getAllMembersWithActiveSale();
      }
      setMemberList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch member records:", err);
      toast.error("Could not load athlete records. Check database connection.");
      setMemberList([]);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    loadData(value);
  }, [value, loadData]);

  const handleSeedPitchData = async (clearExisting = false) => {
    setIsSeeding(true);
    showLoading();
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clear: clearExisting }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("✨ Pitch Demo Dataset Primed! (28 Athletes, Services & Sales Loaded)");
        await loadData(value);
      } else {
        toast.error(json.error || "Failed to initialize pitch dataset.");
      }
    } catch (err: any) {
      console.error("Seeding error:", err);
      toast.error("Failed to seed database: " + err.message);
    } finally {
      setIsSeeding(false);
      hideLoading();
    }
  };

  const actionColumn = [
    {
      accessorKey: "id",
      header: "Review",
      cellContentGetRow: (row: any) => (
        <ReviewButton id={row.id} isDone={row.reviewDone} />
      ),
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Member Directory
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums">
              {memberList.length} Athletes
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage athlete memberships, review statuses, and profile records
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => handleSeedPitchData(false)}
            disabled={isSeeding}
            variant="outline"
            size="sm"
            className="h-9 px-3.5 rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10 text-xs font-semibold text-[#ccff00] hover:bg-[#ccff00]/20 hover:text-white transition-all cursor-pointer"
          >
            {isSeeding ? (
              <span className="flex items-center gap-2">
                <span className="size-3 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
                Seeding CRM...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                ⚡ <span>Load Pitch Demo</span>
              </span>
            )}
          </Button>
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

      {/* Pitch Demo Empty State Card */}
      {!isLoading && memberList.length === 0 && (
        <div className="rounded-2xl border border-[#ccff00]/30 bg-[#12141c]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/80 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 size-48 rounded-full bg-[#ccff00]/10 blur-3xl group-hover:bg-[#ccff00]/15 transition-all" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 text-[11px] font-bold text-[#ccff00] uppercase tracking-wider font-mono">
                Pitch-Ready CRM Database
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                No Athlete Records Found in Cloud Database
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Presenting to a client? Click below to instantly populate your CRM with 28 realistic Indian athlete profiles, active & expiring plans, pending payment balances, attendance logs, and enquiries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                onClick={() => handleSeedPitchData(true)}
                disabled={isSeeding}
                className="h-11 px-6 rounded-full bg-[#ccff00] text-black hover:bg-[#b8e600] font-extrabold text-xs shadow-lg shadow-[#ccff00]/25 transition-all active:scale-95 cursor-pointer"
              >
                {isSeeding ? "Initializing 28 Athletes..." : "✨ Load Pitch Demo Dataset"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Tabs onValueChange={(e) => setValue(e)} defaultValue="0" value={value} className="w-full sm:w-auto">
          <TabsList className="bg-[#12141c] border border-white/[0.08] p-1 rounded-full">
            <TabsTrigger value="0" className="rounded-full data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-semibold text-xs transition-all">
              All Members
            </TabsTrigger>
            <TabsTrigger value="1" className="rounded-full data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-semibold text-xs transition-all">
              Active Plans
            </TabsTrigger>
            <TabsTrigger value="2" className="rounded-full data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-semibold text-xs transition-all">
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DataTable
        dataRows={memberList}
        isLoading={isLoading}
        columns={columns}
        onItemClick={(row) => router.push(`/members/${row.id}`)}
        actionColumns={actionColumn}
      />
    </div>
  );
};

export default MemberPage;

const ReviewButton = ({ id, isDone }: { id: string; isDone: boolean }) => {
  const [isTick, setIsTick] = React.useState(isDone);
  const [loading, setLoading] = React.useState(false);
  const updateReview = async (status: boolean) => {
    setLoading(true);
    const res = await updateReviewStatus(id, status);
    if (res.success) {
      setIsTick(status);
      setLoading(false);
      return;
    } else {
      toast.error("Failed to update review");
      setLoading(false);
      return;
    }
  };
  if (!isTick) {
    return (
      <Button
        size={"icon"}
        variant={"destructive"}
        className="cursor-pointer"
        onClick={() => updateReview(true)}
      >
        {!loading ? (
          <X size={16} className="" />
        ) : (
          <div className="animate-spin rounded-full h-4 w-4 border-l-2 border-b-2 border-white"></div>
        )}
      </Button>
    );
  } else {
    return (
      <Button
        size={"icon"}
        variant={"default"}
        className="cursor-pointer"
        onClick={() => updateReview(false)}
      >
        {!loading ? (
          <Check size={16} />
        ) : (
          <div className="animate-spin rounded-full h-4 w-4 border-l-2 border-b-2 border-white"></div>
        )}
        
      </Button>
    );
  }
};
