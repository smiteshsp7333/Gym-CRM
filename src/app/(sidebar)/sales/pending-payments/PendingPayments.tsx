"use client";

import { GetSalesWithPendingAmount } from "@/action/sales.action";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PayPendingDialog } from "./PayPendingButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GYM_BRANDING } from "@/config/branding";

type Props = {};

const columns = [
  {
    accessorKey: "member_name",
    header: "Member Name",
    cell: ({ row }: any) => (
      <span className="font-bold text-zinc-100">{row.original.member_name}</span>
    ),
  },
  {
    accessorKey: "member_phone",
    header: "Phone",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs text-zinc-300">
        +91 {row.original.member_phone?.toString()}
      </span>
    ),
  },
  {
    accessorKey: "service_name",
    header: "Membership Service",
    cell: ({ row }: any) => (
      <span className="text-xs text-zinc-300">{row.original.service_name}</span>
    ),
  },
  {
    accessorKey: "due",
    header: "Pending Due (₹)",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-bold text-rose-400">
        ₹{Number(row.original.due).toLocaleString("en-IN")}
      </span>
    ),
  },
];

import { DUMMY_SALES } from "@/lib/dummy-data";

const PendingPayments = ({}: Props) => {
  const dummyPendingList = DUMMY_SALES.filter((s) => s.dueAmount > 0).map((s) => ({
    id: s.id,
    member_name: s.member_name,
    member_phone: s.member_phone,
    service_name: s.service_name,
    due: s.dueAmount,
  }));
  const dummyTotal = dummyPendingList.reduce((acc, s) => acc + s.due, 0);

  const [data, setData] = useState<any>({
    total: dummyTotal,
    sales: dummyPendingList,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const pendingPayments = await GetSalesWithPendingAmount();
        if (pendingPayments && Array.isArray(pendingPayments.sales) && pendingPayments.sales.length > 0) {
          setData(pendingPayments);
        } else {
          setData({ total: dummyTotal, sales: dummyPendingList });
        }
      } catch (error) {
        console.warn("Using dummy pending payments for testing:", error);
        setData({ total: dummyTotal, sales: dummyPendingList });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const actions = [
    {
      accessorKey: "id",
      header: "Nudge",
      cellContent: (
        <Button className="cursor-pointer size-8 rounded-lg bg-[#25D366] text-black hover:bg-[#20ba59]">
          <MessageCircle className="size-3.5" />
        </Button>
      ),
      onClickGetRow: (row: any) => {
        const message = `Hi ${row.member_name}, your payment for ${row.service_name} of ₹${row.due} is due. Thank you for choosing ${GYM_BRANDING.name}. Stay healthy, stay strong!%0A%0A- Team ${GYM_BRANDING.shortName}`;
        window.open(
          `https://api.whatsapp.com/send?phone=91${row.member_phone}&text=${encodeURIComponent(message)}`
        );
      },
    },
    {
      accessorKey: "id",
      header: "Settle",
      cellContent: <Button className="cursor-pointer">Pay</Button>,
      cellContentGetRow: (row: any) => (
        <PayPendingDialog
          sale_id={row.id}
          sale={row}
          onSuccess={() => window.location.reload()}
        />
      ),
    },
  ];

  return (
    <Card className="rounded-3xl bg-[#12141c] border border-white/[0.08] shadow-2xl p-6">
      <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span>Pending Payments & Unpaid Balances</span>
            <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Outstanding membership dues requiring payment follow-up
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/25">
          <span className="text-xs text-rose-300 font-medium">Total Outstanding:</span>
          <span className="text-lg font-bold text-rose-400 tabular-nums font-mono">
            ₹{(data?.total || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          dataRows={data?.sales || []}
          isLoading={isLoading}
          columns={columns}
          actionColumns={actions}
        />
      </CardContent>
    </Card>
  );
};

export default PendingPayments;