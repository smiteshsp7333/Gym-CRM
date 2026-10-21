"use client";

import { AddFoodItem, FoodItemInput } from "@/action/food-item.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoading } from "@/hooks/use-loading";
import { Plus, Apple, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export function CreatFoodItem() {
  const { showLoading, hideLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<FoodItemInput>({
    name: "",
    calories: 150,
    protein: 20,
    carbs: 10,
    fats: 4,
    recipe: "",
  });

  const handleInputChange = (e: any, field: keyof FoodItemInput) => {
    setFormState((prev) => ({ ...prev, [field]: e }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || formState.calories === null) {
      toast.error("Please enter item name and calories");
      return;
    }
    if (formState.calories <= 0) {
      toast.error("Calories must be greater than zero");
      return;
    }

    showLoading();
    try {
      const response = await AddFoodItem(formState);
      if (response?.id) {
        toast.success(`Food item "${formState.name}" added to catalog!`);
        setOpen(false);
        window.location.reload();
      } else {
        toast.error("Failed to add food item");
      }
    } catch {
      toast.error("Error creating food item");
    } finally {
      hideLoading();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#ccff00] text-black font-bold text-xs hover:bg-[#b8e600] shadow-md shadow-[#ccff00]/25 transition-all cursor-pointer"
        >
          <Plus className="size-3.5 stroke-[2.2]" />
          <span>Add Food Item</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] rounded-3xl bg-[#12141c] border border-zinc-800 p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Apple className="size-4.5 text-[#ccff00]" />
            New Nutrition Food Item
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Define macronutrient values (grams) and calorie density per serving
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-300">
              Food Name <span className="text-[#ccff00]">*</span>
            </Label>
            <Input
              placeholder="e.g. Boiled Chicken Breast (150g)"
              required
              value={formState.name}
              onChange={(e) => handleInputChange(e.target.value, "name")}
              className="h-10 rounded-xl bg-zinc-900 border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Calories (kcal) <span className="text-[#ccff00]">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                required
                value={formState.calories || ""}
                onChange={(e) => handleInputChange(Number(e.target.value), "calories")}
                className="h-10 rounded-xl bg-zinc-900 border-zinc-800 text-sm text-zinc-100 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Protein (g)</Label>
              <Input
                type="number"
                min="0"
                value={formState.protein || 0}
                onChange={(e) => handleInputChange(Number(e.target.value), "protein")}
                className="h-10 rounded-xl bg-zinc-900 border-zinc-800 text-sm text-zinc-100 font-mono text-[#ccff00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Carbs (g)</Label>
              <Input
                type="number"
                min="0"
                value={formState.carbs || 0}
                onChange={(e) => handleInputChange(Number(e.target.value), "carbs")}
                className="h-10 rounded-xl bg-zinc-900 border-zinc-800 text-sm text-zinc-100 font-mono text-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Fats (g)</Label>
              <Input
                type="number"
                min="0"
                value={formState.fats || 0}
                onChange={(e) => handleInputChange(Number(e.target.value), "fats")}
                className="h-10 rounded-xl bg-zinc-900 border-zinc-800 text-sm text-zinc-100 font-mono text-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-300">Preparation / Recipe Note</Label>
            <Input
              placeholder="e.g. Steamed with salt and olive oil"
              value={formState.recipe || ""}
              onChange={(e) => handleInputChange(e.target.value, "recipe")}
              className="h-10 rounded-xl bg-zinc-900 border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#ccff00]"
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#ccff00]/20 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="size-4" />
              Save Food Item
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatFoodItem;
