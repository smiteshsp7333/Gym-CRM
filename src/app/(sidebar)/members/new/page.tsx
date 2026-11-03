"use client";

import { AddMember, MemberInput } from "@/action/member.action";
import { DatePickerDemo } from "@/components/custom/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Shield,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";
import { GYM_BRANDING } from "@/config/branding";
import { format } from "date-fns";
import { addStoreMember, markEnquiryConverted } from "@/lib/gym-store";

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

function NewMemberInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillName = searchParams.get("name") || "";
  const prefillPhone = searchParams.get("phone") || "";
  const leadId = searchParams.get("lead_id") || "";

  const { showLoading, hideLoading } = useLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<MemberInput>({
    name: prefillName,
    phone: prefillPhone,
    email: "",
    memberCode: "",
    gender: "male",
    DOB: "15-01-2000",
    DOJ: format(new Date(), "dd-MM-yyyy"),
    address: GYM_BRANDING.city,
  });

  useEffect(() => {
    if (prefillName || prefillPhone) {
      setFormState((prev) => ({
        ...prev,
        name: prefillName || prev.name,
        phone: prefillPhone || prev.phone,
      }));
      toast.info(`Lead details prefilled for ${prefillName || "Athlete"}!`);
    }
  }, [prefillName, prefillPhone]);

  const handleInputChange = (e: any, field: keyof FormState) => {
    const val = field === "phone" ? e.replace(/\D/g, "") : e;
    setFormState((prev) => ({ ...prev, [field]: val }));
  };

  const handleGenderChange = (value: Gender) => {
    setFormState((prev) => ({ ...prev, gender: value }));
  };

  // Demo auto-fill for client pitches
  const handleQuickDemoFill = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormState({
      name: "Smitesh Pokharkar",
      phone: `7710${randomNum}`,
      email: `smitesh.p${randomNum}@gmail.com`,
      memberCode: `MEM-${randomNum}`,
      gender: "male",
      DOB: "28-08-2002",
      DOJ: format(new Date(), "dd-MM-yyyy"),
      address: `Shivaji Nagar, ${GYM_BRANDING.city}`,
    });
    toast.info("Sample prospective athlete loaded. Ready to enroll!");
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.DOB || !formState.DOJ) {
      toast.error("Please fill all the required fields");
      return;
    }
    const cleanPhone = formState.phone.toString().replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);
    showLoading();

    try {
      // 1. Add to unified store
      const newMember = addStoreMember({
        ...formState,
        phone: cleanPhone,
      });

      // 2. If this came from an enquiry lead, mark it converted
      if (leadId) {
        markEnquiryConverted(leadId);
      }

      // 3. Trigger server action in background
      try {
        AddMember({
          ...formState,
          phone: cleanPhone,
        }).catch((err) => console.warn("Background AddMember fallback:", err));
      } catch {}

      toast.success(`Athlete ${formState.name} enrolled successfully! Redirecting to issue membership plan...`);
      
      // 4. Seamless connection: prompt to issue plan immediately
      setTimeout(() => {
        window.location.href = `/sales/new?member_id=${newMember.id}`;
      }, 700);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while enrolling the member");
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

      {/* Main Enrollment Card */}
      <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="border-b border-zinc-800/80 pb-5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
            <User className="h-3.5 w-3.5" />
            Athlete Onboarding
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Enroll New Member
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create gym membership profile with biometric ID, phone access, and club records.
          </p>
        </div>

        <form onSubmit={handleOnSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                Full Name <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="relative">
                <Input
                  required
                  placeholder="e.g. Smitesh Pokharkar"
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleInputChange(e.target.value, "name")}
                  className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                Mobile Number <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="relative">
                <Input
                  required
                  maxLength={10}
                  placeholder="10-digit phone number"
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => handleInputChange(e.target.value, "phone")}
                  className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm font-mono"
                />
                <Phone className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  placeholder="athlete@example.com"
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleInputChange(e.target.value, "email")}
                  className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
                />
                <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                Gender <span className="text-[#ccff00]">*</span>
              </Label>
              <RadioGroup
                value={formState.gender}
                onValueChange={(val) => handleGenderChange(val as Gender)}
                className="grid grid-cols-3 gap-2 pt-0.5"
              >
                {(["male", "female", "other"] as Gender[]).map((gender) => (
                  <label
                    key={gender}
                    className={`flex items-center justify-center h-11 rounded-xl border text-xs font-semibold capitalize cursor-pointer transition-all ${
                      formState.gender === gender
                        ? "bg-[#ccff00]/15 border-[#ccff00] text-[#ccff00]"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <RadioGroupItem value={gender} className="sr-only" />
                    {gender}
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                Date of Birth <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800">
                <DatePickerDemo
                  defaultDate={formState.DOB}
                  onDateChange={(e) => handleInputChange(e, "DOB")}
                />
              </div>
            </div>

            {/* Date of Joining */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                Joining Date <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800">
                <DatePickerDemo
                  defaultDate={formState.DOJ}
                  onDateChange={(e) => handleInputChange(e, "DOJ")}
                />
              </div>
            </div>

            {/* Residential Area / City */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                City / Residential Area
              </Label>
              <div className="relative">
                <Input
                  placeholder="e.g. Indiranagar, Bengaluru"
                  type="text"
                  value={formState.address}
                  onChange={(e) => handleInputChange(e.target.value, "address")}
                  className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
                />
                <MapPin className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-500">
              Default member portal password will be generated as <code className="text-zinc-400 font-mono">Test@12345</code>.
            </p>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 px-8 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/20 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Enrolling Athlete..." : "Confirm & Enroll Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewMemberPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading Member Onboarding...</div>}>
      <NewMemberInner />
    </Suspense>
  );
}
