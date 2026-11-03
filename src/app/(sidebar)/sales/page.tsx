"use client";

import { DeleteSaleById, GetAllSalesWithExpand } from "@/action/sales.action";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import {
  FileText,
  Plus,
  Send,
  Trash2,
  Clock,
  AlertCircle,
  Receipt,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { GYM_BRANDING } from "@/config/branding";
import { getStoreSales, deleteStoreSale, getExpiringMembers } from "@/lib/gym-store";

type SalesFilter = "all" | "pending" | "expiring";

const columns = [
  {
    accessorKey: "service_name",
    header: "Plan / Service",
    cellContentGetRow: (row: any) => (
      <div>
        <p className="font-bold text-white">{row.service_name}</p>
        {row.paymentMode && (
          <span className="text-[10px] font-mono text-zinc-400">Via {row.paymentMode}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "member_name",
    header: "Athlete Name",
    cellContentGetRow: (row: any) => (
      <div>
        <p className="font-semibold text-zinc-200">{row.member_name || row.member?.name}</p>
        <p className="text-[10px] text-zinc-500 font-mono">
          +91 {row.member_phone || row.member?.phone}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Total (₹)",
    cellContentGetRow: (row: any) => (
      <span className="font-mono text-xs font-bold text-white tabular-nums">
        ₹{row.amount?.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    accessorKey: "paid",
    header: "Paid (₹)",
    cellContentGetRow: (row: any) => (
      <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
        ₹{row.paid?.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    accessorKey: "dueAmount",
    header: "Balance (₹)",
    cellContentGetRow: (row: any) => {
      const due = Number(row.dueAmount || 0);
      return (
        <span
          className={`font-mono text-xs font-bold tabular-nums ${
            due > 0 ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          {due > 0 ? `₹${due.toLocaleString("en-IN")}` : "Settled"}
        </span>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Activation",
    cellContentGetRow: (row: any) => (
      <span className="font-mono text-xs text-zinc-400">{row.startDate}</span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Expiry",
    cellContentGetRow: (row: any) => (
      <span className="font-mono text-xs text-zinc-300 font-semibold">{row.endDate}</span>
    ),
  },
];

export default function SalesPage() {
  const [salesList, setSalesList] = useState<any[]>([]);
  const [filter, setFilter] = useState<SalesFilter>("all");
  const { showLoading, hideLoading, isLoading } = useLoading();

  const loadData = React.useCallback(() => {
    const list = getStoreSales();
    setSalesList(list);
  }, []);

  useEffect(() => {
    loadData();
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("gym_store_updated", handleUpdate);
    return () => window.removeEventListener("gym_store_updated", handleUpdate);
  }, [loadData]);

  const expiringSales = useMemo(() => getExpiringMembers(7), [salesList]);
  const pendingSales = useMemo(
    () => salesList.filter((s) => Number(s.dueAmount || 0) > 0),
    [salesList]
  );

  const filteredSales = useMemo(() => {
    if (filter === "pending") return pendingSales;
    if (filter === "expiring") return expiringSales;
    return salesList;
  }, [salesList, filter, pendingSales, expiringSales]);

  const handleDelete = async (rowId: string) => {
    try {
      deleteStoreSale(rowId);
      // Background sync to server action
      try {
        await DeleteSaleById(rowId);
      } catch {}
      toast.success("Sale invoice record deleted");
    } catch {
      toast.error("Failed to delete sale record");
    }
  };

  const actionColumns = [
    {
      accessorKey: "id",
      header: "Invoice",
      cellContentGetRow: (row: any) => (
        <Button
          variant="secondary"
          size="icon"
          className="cursor-pointer size-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/invoices/${row.id}`, "_blank");
          }}
          title="View & Print Official Tax Invoice"
        >
          <Receipt className="size-3.5 text-[#ccff00]" />
        </Button>
      ),
    },
    {
      accessorKey: "id",
      header: "WhatsApp",
      cellContentGetRow: (row: any) => {
        const origin = typeof window !== "undefined" ? window.location.origin : GYM_BRANDING.websiteUrl;
        const phone = row.member_phone || row.member?.phone || "9820110001";
        const message = encodeURIComponent(
          `Hi ${row.member_name || "Athlete"}, your invoice for ${row.service_name} at ${GYM_BRANDING.name} is ready.\n\nView Tax Invoice: ${origin}/invoices/${row.id}\n\nStay fit, stay strong!\n- Team ${GYM_BRANDING.shortName}`
        );
        return (
          <a
            href={`https://wa.me/91${phone}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center size-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
            title="Send WhatsApp Invoice"
          >
            <MessageCircle className="size-4" />
          </a>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Delete",
      cellContentGetRow: (row: any) => (
        <Button
          variant="destructive"
          size="icon"
          className="cursor-pointer size-8 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.id);
          }}
          title="Delete Sale Record"
        >
          <Trash2 className="size-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Sales & Service Invoices
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums font-mono">
              {filteredSales.length} Transactions
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track membership packages sold, GST invoices, and collection payments
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/sales/new"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.2]" />
            <span>Record New Sale</span>
          </Link>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: `All Invoices (${salesList.length})` },
          { key: "pending", label: `Pending Collections (${pendingSales.length})` },
          { key: "expiring", label: `Expiring Soon (7d) (${expiringSales.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key as SalesFilter)}
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

      {/* Sales Table */}
      <DataTable
        dataRows={filteredSales}
        actionColumns={actionColumns}
        columns={columns}
        isLoading={isLoading}
        onItemClick={(row) => window.open(`/invoices/${row.id}`, "_blank")}
      />
    </div>
  );
}
