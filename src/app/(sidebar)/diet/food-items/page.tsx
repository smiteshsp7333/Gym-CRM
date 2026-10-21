"use client";

import { DeleteFoodItem, FoodItemResponse, GetAllFoodItems } from "@/action/food-item.action";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { Trash2, Apple } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreatFoodItem } from "./Create-food";

type Props = {};

const columns = [
  {
    accessorKey: "name",
    header: "Food Item",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#ccff00]">
          <Apple className="size-4" />
        </div>
        <span className="font-bold text-zinc-100">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "calories",
    header: "Calories",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-semibold text-zinc-200">
        {row.original.calories} kcal
      </span>
    ),
  },
  {
    accessorKey: "protein",
    header: "Protein",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-bold text-[#ccff00]">
        {row.original.protein || 0}g
      </span>
    ),
  },
  {
    accessorKey: "carbs",
    header: "Carbs",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-bold text-cyan-400">
        {row.original.carbs || 0}g
      </span>
    ),
  },
  {
    accessorKey: "fats",
    header: "Fats",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs font-bold text-amber-400">
        {row.original.fats || 0}g
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
      await DeleteFoodItem(rowId);
      toast.success("Food item deleted successfully");
      window.location.reload();
    },
  },
];

const FoodItemsCatalogPage = (props: Props) => {
  const [serviceList, setServiceList] = useState<FoodItemResponse[]>([]);
  const { showLoading, hideLoading, isLoading } = useLoading();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await GetAllFoodItems();
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
            Nutrition & Food Items Catalog
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums font-mono">
              {serviceList.length} Items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage calorie breakdowns, protein, carbs, and healthy fats for customized diet plans
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreatFoodItem />
        </div>
      </div>

      <DataTable
        dataRows={serviceList}
        columns={columns}
        actionColumns={DeleteColumn}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FoodItemsCatalogPage;