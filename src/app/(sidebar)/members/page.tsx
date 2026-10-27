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

import { DUMMY_MEMBERS } from "@/lib/dummy-data";

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
  const [memberList, setMemberList] = React.useState<any[]>(DUMMY_MEMBERS);
  const [value, setValue] = React.useState<string>("0");
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

      if (Array.isArray(data) && data.length > 0) {
        setMemberList(data);
      } else {
        // Test dummy data fallback
        if (tabValue === "1") {
          setMemberList(DUMMY_MEMBERS.filter((m) => m.activeServiceName));
        } else if (tabValue === "2") {
          setMemberList(DUMMY_MEMBERS.filter((m) => !m.activeServiceName));
        } else {
          setMemberList(DUMMY_MEMBERS);
        }
      }
    } catch (err) {
      console.warn("Using fallback dummy members for testing:", err);
      if (tabValue === "1") {
        setMemberList(DUMMY_MEMBERS.filter((m) => m.activeServiceName));
      } else if (tabValue === "2") {
        setMemberList(DUMMY_MEMBERS.filter((m) => !m.activeServiceName));
      } else {
        setMemberList(DUMMY_MEMBERS);
      }
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    loadData(value);
  }, [value, loadData]);

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
