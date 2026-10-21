"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BMICalculator from "./_components/BMICalculator";
import BMRCalculator from "./_components/BMRCalculator";
import WHRCalculator from "./_components/WHRCalculator";
import { Activity, Flame, Scale, Sparkles } from "lucide-react";
import { GYM_BRANDING } from "@/config/branding";

const FitnessToolsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="h-3.5 w-3.5" />
            Sports Science Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Biometric & Fitness Calculators
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Real-time body composition, basal metabolic rate, and waist-to-hip ratio analytics for {GYM_BRANDING.name} members.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
          Instant Diagnosis Engine
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="bmi" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-1.5 rounded-2xl bg-[#12141c] border border-zinc-800 h-14">
          <TabsTrigger
            value="bmi"
            className="rounded-xl data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-bold text-xs font-semibold text-zinc-400 transition-all flex items-center justify-center gap-2"
          >
            <Scale className="h-4 w-4" />
            Body Mass Index (BMI)
          </TabsTrigger>

          <TabsTrigger
            value="bmr"
            className="rounded-xl data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-bold text-xs font-semibold text-zinc-400 transition-all flex items-center justify-center gap-2"
          >
            <Flame className="h-4 w-4" />
            Basal Metabolic Rate (BMR)
          </TabsTrigger>

          <TabsTrigger
            value="whr"
            className="rounded-xl data-[state=active]:bg-[#ccff00] data-[state=active]:text-black data-[state=active]:font-bold text-xs font-semibold text-zinc-400 transition-all flex items-center justify-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Waist-to-Hip (WHR)
          </TabsTrigger>
        </TabsList>

        {/* BMI Tab */}
        <TabsContent value="bmi" className="mt-0">
          <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-10 shadow-xl">
            <BMICalculator />
          </div>
        </TabsContent>

        {/* BMR Tab */}
        <TabsContent value="bmr" className="mt-0">
          <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-10 shadow-xl">
            <BMRCalculator />
          </div>
        </TabsContent>

        {/* WHR Tab */}
        <TabsContent value="whr" className="mt-0">
          <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-10 shadow-xl">
            <WHRCalculator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FitnessToolsPage;