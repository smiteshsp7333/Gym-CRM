"use client";

import { DeleteServiceById, GetAllServices, ServiceResponse } from "@/action/service.action";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { Trash2, PackagePlus, Layers } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { GYM_BRANDING } from "@/config/branding";

type Props = {};

const columns = [
  {
    accessorKey: "name",
    header: "Plan Name",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-[#ccff00]">
          <Layers className="size-4" />
        </div>
        <div>
          <span className="font-bold text-zinc-100">{row.original.name}</span>
          <span className="block text-[11px] text-zinc-400 font-mono">
            {row.original.duration} {row.original.duration === 1 ? "Month" : "Months"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description / Inclusions",
    cell: ({ row }: any) => (
      <span className="text-xs text-zinc-400 max-w-sm truncate block">
        {row.original.description || "General membership privileges"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-bold text-emerald-400">
        {GYM_BRANDING.currency}{Number(row.original.price).toLocaleString("en-IN")}
      </span>
    ),
  },
];

const DeleteColumn = [
  {
    accessorKey: "id",
    header: "Action",
    cellContent: (
      <Button variant="destructive" size={"icon"} className="cursor-pointer size-8 rounded-lg">
        <Trash2 className="size-3.5" />
      </Button>
    ),
    onClick: async (rowId: any) => {
      await DeleteServiceById(rowId);
      toast.success("Service deleted successfully");
    },
  },
];

const ServiceCatalogPage = (props: Props) => {
  const [serviceList, setServiceList] = React.useState<ServiceResponse[]>([]);
  const { showLoading, hideLoading, isLoading } = useLoading();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await GetAllServices();
        setServiceList(data || []);
      } catch (err) {
        console.error(err);
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
            Gym Services & Membership Plans
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums font-mono">
              {serviceList.length} Packages
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure membership tiers, personal training, and group class packages with INR pricing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/services/new"
            prefetch={true}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer"
          >
            <PackagePlus className="size-3.5 stroke-[2.2]" />
            <span>Add New Service</span>
          </Link>
        </div>
      </div>

      <DataTable dataRows={serviceList} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default ServiceCatalogPage;