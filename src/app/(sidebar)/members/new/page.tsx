"use client";

import { DatePickerDemo } from "@/components/custom/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { AddMember, MemberInput } from "@/action/member.action";
import { toast } from "sonner";
import {
  UserPlus,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useLoading } from "@/hooks/use-loading";
import { capitalizeWords } from "@/lib/utils";
import { GYM_BRANDING } from "@/config/branding";
import { format } from "date-fns";

type Gender = "male" | "female" | "other";

interface FormState {
  name: string;
  phone: string;
  email: string;
  gender: string;
  DOB: string;
  DOJ: string;
  address: string;
}

const NewMemberPage = () => {
  const { showLoading, hideLoading } = useLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<MemberInput>({
    name: "",
    phone: 0,
    email: "",
    memberCode: "",
    gender: "male",
    DOB: "15-01-2000",
    DOJ: format(new Date(), "dd-MM-yyyy"),
    address: GYM_BRANDING.city,
  });

  const handleInputChange = (e: any, field: keyof FormState) => {
    setFormState((prev) => ({ ...prev, [field]: e }));
  };

  const handleGenderChange = (value: Gender) => {
    setFormState((prev) => ({ ...prev, gender: value }));
  };

  // Demo auto-fill for client pitches
  const handleQuickDemoFill = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormState({
      name: "Vikram Malhotra",
      phone: parseInt(`9810${randomNum}`),
      email: `vikram.m${randomNum}@gmail.com`,
      memberCode: `MEM-${randomNum}`,
      gender: "male",
      DOB: "22-06-1997",
      DOJ: format(new Date(), "dd-MM-yyyy"),
      address: `12th Main, ${GYM_BRANDING.city}`,
    });
    toast.info("Sample prospective member loaded. Ready to enroll!");
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.DOB || !formState.DOJ) {
      toast.error("Please fill all the required fields");
      return;
    }
    if (formState.phone.toString().length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);
    showLoading();

    try {
      const response = await AddMember(formState);
      if (response?.id) {
        toast.success(`Member ${formState.name} enrolled successfully!`);
        window.location.href = `/members/${response.id}`;
      } else {
        toast.error("Failed to enroll member");
      }
    } catch (err) {
      toast.error("An error occurred while enrolling the member");
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Members List
        </Link>

        <button
          type="button"
          onClick={handleQuickDemoFill}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-[#ccff00]/15 text-zinc-300 hover:text-[#ccff00] border border-zinc-800 hover:border-[#ccff00]/40 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
          Quick Demo Member
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-radial from-[#ccff00]/5 to-transparent pointer-events-none opacity-40" />

        {/* Card Header */}
        <div className="flex items-start justify-between pb-6 border-b border-zinc-800/80 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
              <UserPlus className="h-3.5 w-3.5" />
              Member Onboarding
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enroll New Member
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Create gym membership profile with biometric ID, phone access, and club records.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            {GYM_BRANDING.name}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleOnSubmit} className="mt-6 space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Full Name <span className="text-[#ccff00]">*</span>
              </Label>
              <Input
                placeholder="e.g. Vikram Malhotra"
                type="text"
                required
                value={formState.name}
                onChange={(e) =>
                  handleInputChange(capitalizeWords(e.target.value), "name")
                }
                className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Mobile Number <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                  required
                  value={formState.phone ? formState.phone.toString() : ""}
                  onChange={(e) => handleInputChange(e.target.value, "phone")}
                  className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm font-mono pr-10"
                />
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Email Address</Label>
              <div className="relative">
                <Input
                  placeholder="vikram@domain.com"
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleInputChange(e.target.value, "email")}
                  className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm pr-10"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Gender <span className="text-[#ccff00]">*</span>
              </Label>
              <RadioGroup
                className="grid grid-cols-3 gap-2"
                value={formState.gender}
                onValueChange={handleGenderChange}
              >
                {["male", "female", "other"].map((g) => (
                  <label
                    key={g}
                    className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold capitalize cursor-pointer transition-all ${
                      formState.gender === g
                        ? "bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <RadioGroupItem value={g} className="sr-only" />
                    {g}
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Dates: DOB & DOJ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Date of Birth <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800">
                <DatePickerDemo
                  defaultDate={formState.DOB}
                  onDateChange={(e) => handleInputChange(e, "DOB")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Joining Date <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800">
                <DatePickerDemo
                  defaultDate={formState.DOJ}
                  onDateChange={(e) => handleInputChange(e, "DOJ")}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-300">City / Residential Area</Label>
            <div className="relative">
              <Input
                placeholder="Locality, Sector, City"
                type="text"
                value={formState.address}
                onChange={(e) => handleInputChange(e.target.value, "address")}
                className="h-12 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm pr-10"
              />
              <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400 text-center sm:text-left">
              Default member portal password will be generated as <code className="text-[#ccff00]">Test@12345</code>.
            </p>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Enrolling Member..." : "Confirm & Enroll Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMemberPage;
