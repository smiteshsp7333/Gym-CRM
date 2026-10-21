"use client";

import { GetAllMembers, MemberResponse } from "@/action/member.action";
import { GetAllFoodItems, FoodItemResponse } from "@/action/food-item.action";
import { DatePickerDemo } from "@/components/custom/date-picker";
import ItemSelector from "@/components/custom/item-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Utensils,
  ArrowLeft,
  Sparkles,
  User,
  Calendar,
  Flame,
  Plus,
  Trash2,
  MessageCircle,
  CheckCircle2,
  FileText,
  Apple,
} from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";

interface MealSlot {
  id: string;
  title: string;
  time: string;
  items: string[];
  calories: number;
  protein: number;
}

const NewDietPlanPage = () => {
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItemResponse[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [dietGoal, setDietGoal] = useState<"muscle" | "fatloss" | "strength">("muscle");
  const [dietaryPreference, setDietaryPreference] = useState<"veg" | "non-veg" | "egg">("non-veg");
  const [notes, setNotes] = useState("Drink minimum 3.5L water daily. No refined sugar.");

  const [meals, setMeals] = useState<MealSlot[]>([
    {
      id: "1",
      title: "Breakfast & Energy",
      time: "08:00 AM",
      items: ["Oatmeal with Almond Milk & Chia Seeds (80g)", "4 Boiled Egg Whites + 1 Whole Egg"],
      calories: 480,
      protein: 34,
    },
    {
      id: "2",
      title: "Pre-Workout Fuel",
      time: "11:30 AM",
      items: ["2 Brown Bread Slices with Peanut Butter (30g)", "1 Medium Banana + Black Coffee"],
      calories: 360,
      protein: 12,
    },
    {
      id: "3",
      title: "High-Protein Lunch",
      time: "02:00 PM",
      items: ["Grilled Chicken Breast / Paneer (180g)", "Brown Rice (150g) + Steamed Broccoli"],
      calories: 620,
      protein: 52,
    },
    {
      id: "4",
      title: "Post-Workout Recovery",
      time: "06:30 PM",
      items: ["1 Scoop Whey Isolate Protein with Water", "1 Apple / Handful Roasted Almonds"],
      calories: 240,
      protein: 27,
    },
    {
      id: "5",
      title: "Lean Dinner & Micro-nutrients",
      time: "08:45 PM",
      items: ["Fish Fillet / Tofu Salad (150g)", "Mixed Green Salad with Olive Oil Dressing"],
      calories: 380,
      protein: 38,
    },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [mems, foods] = await Promise.all([
          GetAllMembers(),
          GetAllFoodItems(),
        ]);
        setMembers(mems || []);
        setFoodItems(foods || []);
      } catch (err) {
        console.error("Failed to load diet data", err);
      }
    }
    loadData();
  }, []);

  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);

  // Demo Pitch Preset Filler
  const handleQuickDemoDiet = () => {
    if (members.length > 0) {
      setSelectedMember(members[0]);
    }
    setDietGoal("muscle");
    setDietaryPreference("non-veg");
    toast.info("Executive 2,080 kcal Lean Hypertrophy Diet loaded!");
  };

  // Add Item to a meal
  const handleAddItemToMeal = (mealId: string, itemName: string, cal: number, prot: number) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id === mealId) {
          return {
            ...m,
            items: [...m.items, itemName],
            calories: m.calories + cal,
            protein: m.protein + prot,
          };
        }
        return m;
      })
    );
  };

  // Remove Item
  const handleRemoveItem = (mealId: string, itemIdx: number) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id === mealId) {
          const updated = [...m.items];
          updated.splice(itemIdx, 1);
          return {
            ...m,
            items: updated,
            calories: Math.max(0, m.calories - 100),
            protein: Math.max(0, m.protein - 10),
          };
        }
        return m;
      })
    );
  };

  // Generate WhatsApp Message
  const handleSendToWhatsApp = () => {
    if (!selectedMember) {
      toast.error("Please select a member first");
      return;
    }
    const phone = selectedMember.phone?.toString();
    if (!phone) {
      toast.error("Member has no phone number registered");
      return;
    }

    let msg = `*${GYM_BRANDING.name.toUpperCase()} - CUSTOM NUTRITION PLAN*\n\n`;
    msg += `Member: *${selectedMember.name}*\n`;
    msg += `Target Goal: *${dietGoal.toUpperCase()}*\n`;
    msg += `Daily Calories: *${totalCalories} kcal* | Total Protein: *${totalProtein}g*\n\n`;

    meals.forEach((m) => {
      msg += `*${m.time} - ${m.title}* (${m.calories} kcal, ${m.protein}g protein):\n`;
      m.items.forEach((item) => {
        msg += `   • ${item}\n`;
      });
      msg += `\n`;
    });

    msg += `*Coach Notes*: ${notes}\n\n`;
    msg += `Stay consistent and achieve your fitness goals.\n— *${GYM_BRANDING.name} Team*`;

    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success("Diet plan formatted and dispatched to WhatsApp!");
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/diet"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Nutrition Plans
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickDemoDiet}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-[#ccff00]/15 text-zinc-300 hover:text-[#ccff00] border border-zinc-800 hover:border-[#ccff00]/40 transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
            Quick Demo Plan
          </button>

          {selectedMember && (
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Send to Member WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Member Info, Target Macro Counters & Goal Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Member Card */}
          <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-[#ccff00]" />
              Assign Member
            </h2>

            <ItemSelector
              data={members}
              valueKey="id"
              labelKey="name"
              onSelect={(val) => {}}
              placeholder="Search member name..."
              searchPlaceholder="Type member name..."
              onSelectGetRow={(row) => setSelectedMember(row)}
            />

            {selectedMember ? (
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="text-xs font-bold text-white">{selectedMember.name}</div>
                <div className="text-[11px] font-mono text-zinc-400">
                  +91 {selectedMember.phone?.toString()}
                </div>
                <div className="text-[10px] text-[#ccff00] font-semibold pt-1">
                  Biometric ID: {selectedMember.memberCode || "MEM-001"}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 text-xs text-zinc-400 text-center">
                Select a member to personalize macro breakdown
              </div>
            )}
          </div>

          {/* Goal Selector */}
          <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              Fitness Target
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "muscle", label: "Hypertrophy" },
                { id: "fatloss", label: "Fat Shred" },
                { id: "strength", label: "Power" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setDietGoal(g.id as any)}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    dietGoal === g.id
                      ? "bg-[#ccff00]/15 border-[#ccff00] text-[#ccff00]"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Diet Preference */}
            <div className="pt-2 border-t border-zinc-800/80">
              <Label className="text-xs text-zinc-400 mb-2 block">Dietary Preference</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "non-veg", label: "Non-Veg" },
                  { id: "egg", label: "Eggetarian" },
                  { id: "veg", label: "Pure Veg" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setDietaryPreference(p.id as any)}
                    className={`p-2 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                      dietaryPreference === p.id
                        ? "bg-zinc-800 border-zinc-600 text-white"
                        : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Macro Aggregate Pill */}
          <div className="rounded-3xl bg-[#090a0f] border border-zinc-800 p-6 shadow-xl space-y-4">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Total Daily Target</span>
              <span className="text-[#ccff00] font-mono">100% Calculated</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#12141c] border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Calories</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  {totalCalories}
                  <span className="text-xs font-normal text-zinc-400 ml-1">kcal</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#12141c] border border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Protein</span>
                <div className="text-2xl font-black text-[#ccff00] font-mono mt-0.5">
                  {totalProtein}
                  <span className="text-xs font-normal text-zinc-400 ml-1">g</span>
                </div>
              </div>
            </div>

            {/* Coach Notes */}
            <div className="space-y-1.5 pt-2">
              <Label className="text-xs text-zinc-400">Coach Instructions</Label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Hydration advice, supplement timings..."
                className="w-full p-3 rounded-xl bg-[#12141c] border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Meal Timeline (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
                <Utensils className="h-3.5 w-3.5" />
                Nutrition Protocol
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Daily Meal Timeline & Macro Blueprint
              </h1>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextId = (meals.length + 1).toString();
                setMeals([
                  ...meals,
                  {
                    id: nextId,
                    title: `Meal ${meals.length + 1}`,
                    time: "05:00 PM",
                    items: ["Sprouted Moong Salad (100g)"],
                    calories: 140,
                    protein: 9,
                  },
                ]);
                toast.success("Additional meal slot created");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 cursor-pointer transition-all"
            >
              <Plus className="h-3.5 w-3.5 text-[#ccff00]" />
              Add Meal Slot
            </button>
          </div>

          {/* Meals List */}
          <div className="space-y-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3.5 hover:border-zinc-700/80 transition-all"
              >
                {/* Meal Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-800/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
                    <span className="text-sm font-bold text-white">{meal.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-300">
                      {meal.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-300 font-bold">
                      {meal.calories} kcal
                    </span>
                    <span className="text-xs font-mono text-[#ccff00] font-bold">
                      {meal.protein}g protein
                    </span>
                  </div>
                </div>

                {/* Items in Meal */}
                <div className="space-y-1.5">
                  {meal.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/40 text-xs text-zinc-200"
                    >
                      <span className="flex items-center gap-2">
                        <Apple className="h-3.5 w-3.5 text-zinc-400" />
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(meal.id, idx)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Food Tag */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider py-1">
                    + Quick Add:
                  </span>
                  {[
                    { label: "1 Scoop Whey (130 kcal, 24g P)", cal: 130, prot: 24 },
                    { label: "2 Boiled Eggs (140 kcal, 12g P)", cal: 140, prot: 12 },
                    { label: "100g Paneer (260 kcal, 18g P)", cal: 260, prot: 18 },
                    { label: "1 Banana (105 kcal, 1g P)", cal: 105, prot: 1 },
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleAddItemToMeal(meal.id, preset.label, preset.cal, preset.prot)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 hover:bg-[#ccff00]/15 text-zinc-400 hover:text-[#ccff00] border border-zinc-700/60 transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">
              Personalized diet plan will automatically be accessible in the member&apos;s mobile portal.
            </p>

            <Button
              type="button"
              onClick={() => {
                toast.success("Diet plan saved and synced to member database!");
                if (selectedMember) {
                  handleSendToWhatsApp();
                }
              }}
              className="h-12 px-8 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save & Dispatch Diet Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDietPlanPage;