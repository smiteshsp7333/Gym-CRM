"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";
import { AddEnquiry, EnquiryInput } from "@/action/enquiries.action";
import { DatePickerDemo } from "@/components/custom/date-picker";
import { useLoading } from "@/hooks/use-loading";
import { capitalizeWords } from "@/lib/utils";
import {
  UserPlus,
  ArrowLeft,
  Sparkles,
  Phone,
  MessageSquare,
  Calendar,
  Instagram,
  PhoneCall,
  Footprints,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";
import { format } from "date-fns";

const NewEnquiryPage = () => {
  const { showLoading, hideLoading } = useLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<EnquiryInput>({
    name: "",
    phone: BigInt(0),
    followupDate: format(new Date(Date.now() + 86400000 * 2), "dd-MM-yyyy"),
    message: "Interested in annual strength training + cardio",
    type: "walkin",
  });

  const handleInputChange = (e: any, field: keyof EnquiryInput) => {
    setFormState((prev) => ({ ...prev, [field]: e }));
  };

  const handleQuickDemoEnquiry = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormState({
      name: "Aditya Verma",
      phone: BigInt(`9892${random}`),
      followupDate: format(new Date(Date.now() + 86400000 * 2), "dd-MM-yyyy"),
      message: "Looking for personal training & weight loss package for 6 months",
      type: "instagram",
    });
    toast.info("Sample hot lead generated! Ready to register.");
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) {
      toast.error("Please fill in lead name and phone number");
      return;
    }
    if (formState.phone.toString().length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);
    showLoading();

    try {
      const response = await AddEnquiry(formState);
      if (response?.id) {
        toast.success(`Enquiry from ${formState.name} saved to pipeline!`);
        window.location.href = `/enquiries`;
      } else {
        toast.error("Failed to add enquiry");
      }
    } catch {
      toast.error("An error occurred while saving enquiry");
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  const enquiryTypes = [
    { type: "walkin", label: "Walk-in Lead", icon: Footprints },
    { type: "call", label: "Direct Call", icon: PhoneCall },
    { type: "instagram", label: "Instagram Ad", icon: Instagram },
    { type: "whatsapp", label: "WhatsApp Chat", icon: MessageCircle },
  ];

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/enquiries"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Enquiries CRM
        </Link>

        <button
          type="button"
          onClick={handleQuickDemoEnquiry}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-[#ccff00]/15 text-zinc-300 hover:text-[#ccff00] border border-zinc-800 hover:border-[#ccff00]/40 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
          Quick Demo Lead
        </button>
      </div>

      {/* Main Intake Card */}
      <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="pb-6 border-b border-zinc-800/80 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
              <UserPlus className="h-3.5 w-3.5" />
              Lead Capture
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Capture Prospective Gym Lead
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Record walk-ins, social inquiries, and schedule automated WhatsApp follow-ups.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            {GYM_BRANDING.name} CRM
          </span>
        </div>

        <form onSubmit={handleOnSubmit} className="mt-6 space-y-6">
          {/* Source Channel Pills */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Lead Acquisition Channel</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {enquiryTypes.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange(type, "type")}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formState.type === type
                      ? "bg-[#ccff00]/15 border-[#ccff00] text-[#ccff00]"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Lead Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Prospect Full Name <span className="text-[#ccff00]">*</span>
              </Label>
              <Input
                placeholder="e.g. Aditya Verma"
                type="text"
                required
                value={formState.name}
                onChange={(e) =>
                  handleInputChange(capitalizeWords(e.target.value), "name")
                }
                className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                WhatsApp / Mobile Number <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                  required
                  value={formState.phone ? formState.phone.toString() : ""}
                  onChange={(e) => handleInputChange(BigInt(e.target.value || "0"), "phone")}
                  className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm font-mono pr-10"
                />
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Follow-up Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#ccff00]" />
              Scheduled Follow-Up / Free Trial Date
            </Label>
            <div className="rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800">
              <DatePickerDemo
                defaultDate={formState.followupDate || ""}
                onDateChange={(e) => handleInputChange(e, "followupDate")}
              />
            </div>
          </div>

          {/* Message / Requirements */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
              Fitness Goals & Package Interest
            </Label>
            <Input
              placeholder="e.g. Looking for weight loss plan, requested trial class on Friday"
              type="text"
              value={formState.message || ""}
              onChange={(e) => handleInputChange(e.target.value, "message")}
              className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">
              Lead will automatically appear in your active Retention & Follow-ups radar.
            </p>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Saving Lead..." : "Save Prospect Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEnquiryPage;