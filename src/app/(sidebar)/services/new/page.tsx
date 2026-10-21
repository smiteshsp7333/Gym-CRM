"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";
import { AddService, ServiceInput } from "@/action/service.action";
import {
  PackagePlus,
  ArrowLeft,
  Sparkles,
  Clock,
  CheckCircle2,
  Tag,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";

const NewServicePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<ServiceInput>({
    name: "",
    description: "Full gym floor access, cardio zone, locker room & steam bath",
    price: 15000,
    duration: 12,
  });

  const handleInputChange = (e: any, field: keyof ServiceInput) => {
    setFormState((prev) => ({ ...prev, [field]: e }));
  };

  const handleQuickDemoService = () => {
    setFormState({
      name: "12-Month Elite Strength & Cardio VIP",
      description: "Full gym floor access, 2 free PT sessions, locker access, nutrition consultation & steam bath.",
      price: 18000,
      duration: 12,
    });
    toast.info("Elite membership tier loaded!");
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || formState.price <= 0 || formState.duration <= 0) {
      toast.error("Please enter a valid plan name, price, and duration");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AddService(formState);
      if (response?.id) {
        toast.success(`Membership plan "${formState.name}" created!`);
        window.location.href = `/services`;
      } else {
        toast.error("Failed to create service plan");
      }
    } catch {
      toast.error("An error occurred while creating service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const durationPresets = [1, 3, 6, 12, 24];

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Service Catalog
        </Link>

        <button
          type="button"
          onClick={handleQuickDemoService}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-[#ccff00]/15 text-zinc-300 hover:text-[#ccff00] border border-zinc-800 hover:border-[#ccff00]/40 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
          Quick Demo Plan
        </button>
      </div>

      {/* Main Intake Card */}
      <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="pb-6 border-b border-zinc-800/80 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
              <PackagePlus className="h-3.5 w-3.5" />
              Service & Plan Tier Setup
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Membership Service
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Configure membership tiers, duration months, and pricing in {GYM_BRANDING.currency}.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            {GYM_BRANDING.name}
          </span>
        </div>

        <form onSubmit={handleOnSubmit} className="mt-6 space-y-6">
          {/* Plan Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-300">
              Plan / Service Name <span className="text-[#ccff00]">*</span>
            </Label>
            <Input
              placeholder="e.g. 12-Month All Access Fitness"
              type="text"
              required
              value={formState.name}
              onChange={(e) => handleInputChange(e.target.value, "name")}
              className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Price */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Package Price ({GYM_BRANDING.currency}) <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                  {GYM_BRANDING.currency}
                </span>
                <Input
                  placeholder="15000"
                  type="number"
                  min="1"
                  required
                  value={formState.price || ""}
                  onChange={(e) => handleInputChange(Number(e.target.value), "price")}
                  className="h-12 pl-9 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm font-mono"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Duration (Months) <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="12"
                  type="number"
                  min="1"
                  required
                  value={formState.duration || ""}
                  onChange={(e) => handleInputChange(Number(e.target.value), "duration")}
                  className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Quick Duration Preset Pills */}
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Quick Duration Presets</Label>
            <div className="flex flex-wrap gap-2">
              {durationPresets.map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => handleInputChange(months, "duration")}
                  className={`px-3 py-1.5 rounded-full border text-xs font-mono font-semibold transition-all cursor-pointer ${
                    formState.duration === months
                      ? "bg-[#ccff00]/15 border-[#ccff00] text-[#ccff00]"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {months} {months === 1 ? "Month" : "Months"}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-300">
              Perks, Inclusions & Description
            </Label>
            <textarea
              rows={3}
              value={formState.description || ""}
              onChange={(e) => handleInputChange(e.target.value, "description")}
              placeholder="e.g. Access to gym floor, cardio equipment, steam bath, 1 free consultation"
              className="w-full p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">
              New plan will be instantly available in the POS Billing and Checkout screen.
            </p>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Publishing Plan..." : "Publish Membership Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewServicePage;