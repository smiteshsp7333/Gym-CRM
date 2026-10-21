"use client";

import React from "react";
import Link from "next/link";
import {
  Utensils,
  Plus,
  Apple,
  Sparkles,
  Flame,
  CheckCircle2,
  Share2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GYM_BRANDING } from "@/config/branding";
import { toast } from "sonner";

interface DietTemplate {
  id: string;
  title: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealsCount: number;
  description: string;
  tag: string;
}

const DIET_TEMPLATES: DietTemplate[] = [
  {
    id: "1",
    title: "Executive Clean Bulk & Hypertrophy",
    category: "Muscle Gain",
    calories: 2650,
    protein: 185,
    carbs: 290,
    fats: 65,
    mealsCount: 5,
    description: "Designed for progressive athletic overload, lean muscle accretion, and optimal post-workout nitrogen retention.",
    tag: "High Protein",
  },
  {
    id: "2",
    title: "Metabolic Fat Shred & Conditioning",
    category: "Weight Loss",
    calories: 1850,
    protein: 165,
    carbs: 140,
    fats: 45,
    mealsCount: 4,
    description: "Moderate caloric deficit with high thermic protein ratio and strategic pre-workout carbohydrate timing.",
    tag: "Lean Shred",
  },
  {
    id: "3",
    title: "Pure Vegetarian Athletic Power",
    category: "Vegetarian",
    calories: 2250,
    protein: 145,
    carbs: 260,
    fats: 58,
    mealsCount: 5,
    description: "Curated Indian vegetarian plan utilizing paneer, soy, lentils, sprouts, and plant isolates for maximum recovery.",
    tag: "Pure Veg",
  },
  {
    id: "4",
    title: "Keto Athletic Recomposition",
    category: "Low Carb",
    calories: 2100,
    protein: 155,
    carbs: 35,
    fats: 145,
    mealsCount: 4,
    description: "High-fat metabolic adaptation protocol with sustained ketone energy and minimal glycemic spikes.",
    tag: "Ketogenic",
  },
];

const DietHubPage: React.FC = () => {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
            <Utensils className="h-3.5 w-3.5" />
            Nutrition & Macro Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Diet Charts & Meal Protocols
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Prescribe tailored nutritional blueprints, macro splits, and dispatch to {GYM_BRANDING.name} members via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/diet/food-items">
            <Button
              variant="outline"
              className="rounded-full bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-2"
            >
              <Apple className="h-3.5 w-3.5 text-[#ccff00]" />
              Food Database
            </Button>
          </Link>

          <Link href="/diet/new">
            <Button className="rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ccff00]/10">
              <Plus className="h-4 w-4" />
              Create Custom Diet
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#12141c] border border-zinc-800/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center font-bold">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase font-semibold">Active Member Diets</span>
            <div className="text-xl font-extrabold text-white">28 Prescriptions</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141c] border border-zinc-800/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase font-semibold">Average Caloric Target</span>
            <div className="text-xl font-extrabold text-white">2,240 kcal / day</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12141c] border border-zinc-800/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase font-semibold">WhatsApp Delivery</span>
            <div className="text-xl font-extrabold text-white">100% Instant Sync</div>
          </div>
        </div>
      </div>

      {/* Curated Diet Blueprint Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-wide">
            Curated Gym Nutrition Blueprints
          </h2>
          <span className="text-xs text-zinc-400 font-mono">Ready to assign or customize</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DIET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-all space-y-5"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] text-[10px] font-bold uppercase tracking-wider">
                    {tmpl.tag}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {tmpl.mealsCount} Meals / Day
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">{tmpl.title}</h3>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{tmpl.description}</p>
              </div>

              {/* Macro Pills Bar */}
              <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 text-center font-mono">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase">Energy</div>
                  <div className="text-xs font-bold text-zinc-100">{tmpl.calories} kcal</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase">Protein</div>
                  <div className="text-xs font-bold text-[#ccff00]">{tmpl.protein}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase">Carbs</div>
                  <div className="text-xs font-bold text-cyan-400">{tmpl.carbs}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase">Fats</div>
                  <div className="text-xs font-bold text-amber-400">{tmpl.fats}g</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Loaded blueprint: "${tmpl.title}". Opening diet builder...`);
                    window.location.href = `/diet/new`;
                  }}
                  className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Use This Blueprint
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <Link href="/diet/new">
                  <span className="text-xs text-zinc-400 hover:text-white transition-colors">
                    Assign to Member →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietHubPage;