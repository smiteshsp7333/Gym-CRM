"use client";

import { DeleteSaleById, GetAllSalesWithExpand, SalesResponse } from "@/action/sales.action";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { FileText, Send, Trash2, AlertCircle, Clock, Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { GYM_BRANDING } from "@/config/branding";

type Props = {};

const columns = [
  {
    accessorKey: "service_name",
    header: "Plan / Service",
    cell: ({ row }: any) => (
      <span className="font-bold text-zinc-100">{row.original.service_name}</span>
    ),
  },
  {
    accessorKey: "member_name",
    header: "Member Name",
    cell: ({ row }: any) => (
      <Link
        href={`/members/${row.original.member?.id || ""}`}
        className="font-medium text-zinc-300 hover:text-[#ccff00] transition-colors"
      >
        {row.original.member_name}
      </Link>
    ),
  },
  {
    accessorKey: "amount",
    header: "Total (₹)",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-semibold text-zinc-200">
        ₹{Number(row.original.amount).toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    accessorKey: "paid",
    header: "Paid (₹)",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-semibold text-emerald-400">
        ₹{Number(row.original.paid).toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    accessorKey: "discount",
    header: "Discount (₹)",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs text-zinc-400">
        ₹{Number(row.original.discount || 0).toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Activation",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs text-zinc-400">{row.original.startDate}</span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Expiry",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs text-amber-400/90">{row.original.endDate}</span>
    ),
  },
];

const DeleteColumn = [
  {
    accessorKey: "id",
    header: "Delete",
    cellContent: (
      <Button variant="destructive" size={"icon"} className="cursor-pointer size-8 rounded-lg">
        <Trash2 className="size-3.5" />
      </Button>
    ),
    onClick: async (rowId: any) => {
      await DeleteSaleById(rowId);
      toast.success("Sale invoice record deleted");
      window.location.reload();
    },
  },
  {
    accessorKey: "id",
    header: "Receipt",
    cellContent: (
      <Button variant="secondary" size={"icon"} className="cursor-pointer size-8 rounded-lg">
        <FileText className="size-3.5" />
      </Button>
    ),
    onClickGetRow: (row: any) => {
      window.open(`/invoices/${row.id}`, "_blank");
    },
  },
  {
    accessorKey: "id",
    header: "WhatsApp",
    cellContent: (
      <Button className="cursor-pointer size-8 rounded-lg bg-[#25D366] text-black hover:bg-[#20ba59]">
        <Send className="size-3.5" />
      </Button>
    ),
    onClickGetRow: (row: any) => {
      const origin = typeof window !== "undefined" ? window.location.origin : GYM_BRANDING.websiteUrl;
      const message = `Hi ${row.member_name}, your invoice for ${row.service_name} is available. Thank you for choosing ${GYM_BRANDING.name}. Stay healthy, stay strong! %0A%0A${origin}/invoices/${row.id} %0A%0A- Team ${GYM_BRANDING.shortName}`;
      window.open(`https://api.whatsapp.com/send?phone=91${row.member?.phone || row.member_phone}&text=${message}`);
    },
  },
];

import { DUMMY_SALES } from "@/lib/dummy-data";

const SalesPage = (props: Props) => {
  const [salesList, setSalesList] = useState<any[]>(DUMMY_SALES);
  const { showLoading, hideLoading, isLoading } = useLoading();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await GetAllSalesWithExpand();
        if (Array.isArray(data) && data.length > 0) {
          setSalesList(data);
        } else {
          setSalesList(DUMMY_SALES);
        }
      } catch (err) {
        console.warn("Using dummy sales for testing:", err);
        setSalesList(DUMMY_SALES);
      } finally {
        hideLoading();
      }
    }
    showLoading();
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Sales & Service Invoices
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums font-mono">
              {salesList.length} Transactions
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track memberships sold, invoice delivery, and payment completion
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/sales/pending-payments"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <AlertCircle className="size-3.5 text-rose-400" />
            <span>Pending Dues</span>
          </Link>

          <Link
            href="/sales/followups"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Clock className="size-3.5 text-amber-400" />
            <span>Renewals</span>
          </Link>

          <Link
            href="/sales/new"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.2]" />
            <span>Record Sale</span>
          </Link>
        </div>
      </div>

      <DataTable dataRows={salesList} actionColumns={DeleteColumn} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default SalesPage;