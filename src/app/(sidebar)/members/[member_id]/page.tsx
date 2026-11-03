"use client";

import { DatePickerDemo } from "@/components/custom/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useEffect, useState } from "react";
import { GetMemberById, MemberResponse, UpdateMemberById } from "@/action/member.action";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  Calendar,
  MapPin,
  ArrowLeft,
  MessageCircle,
  Save,
  CheckCircle2,
  Shield,
  User,
  Sparkles,
  CreditCard,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";
import AttendanceSummary from "./AttendanceSummary";
import { GYM_BRANDING } from "@/config/branding";
import { getStoreMemberById, updateStoreMember } from "@/lib/gym-store";

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

const MemberDetailPage = ({ params }: { params: any }) => {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { member_id } = unwrappedParams as { member_id: string };

  const [formState, setFormState] = useState<any>({
    id: "",
    name: "",
    email: "",
    memberCode: "",
    phone: "",
    address: "",
    DOB: "",
    gender: "male",
    DOJ: "",
    activeServiceName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const { showLoading, hideLoading, isLoading } = useLoading();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    showLoading();
    // 1. Fetch from unified store
    const localMember = getStoreMemberById(member_id);
    if (localMember) {
      setFormState({
        ...localMember,
        phone: localMember.phone ? localMember.phone.toString() : "",
        gender: localMember.gender || "male",
      });
      hideLoading();
      return;
    }

    // 2. Fallback to server action
    async function fetchData() {
      try {
        const data = await GetMemberById(member_id);
        if (data) {
          setFormState({
            ...data,
            phone: data.phone ? data.phone.toString() : "",
            gender: data.gender || "male",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        hideLoading();
      }
    }
    fetchData();
  }, [member_id, showLoading, hideLoading]);

  const handleInputChange = (e: any, field: keyof FormState) => {
    setFormState((prev: any) => ({ ...prev, [field]: e }));
  };

  const handleGenderChange = (value: Gender) => {
    setFormState((prev: any) => ({ ...prev, gender: value }));
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.DOB || !formState.DOJ) {
      toast.error("Please fill all the required fields");
      return;
    }
    if (formState.phone.toString().length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update in unified store
      updateStoreMember(member_id, formState);

      // 2. Background sync to server action
      try {
        await UpdateMemberById(member_id, formState as any);
      } catch {}

      toast.success("Member profile updated successfully");
    } catch {
      toast.error("Failed to update member");
    } finally {
      setIsSaving(false);
    }
  };

  const phoneStr = formState.phone ? formState.phone.toString() : "";
  const initials = formState.name
    ? formState.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GY";

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Members
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => router.push(`/sales/new?member_id=${member_id}`)}
            className="h-8 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs gap-1.5 cursor-pointer shadow-md shadow-[#ccff00]/20"
          >
            <CreditCard className="size-3.5" />
            <span>Issue / Renew Membership</span>
          </Button>

          {phoneStr && (
            <a
              href={`https://wa.me/91${phoneStr}?text=Hello%20${encodeURIComponent(
                formState.name
              )},%20greeting%20from%20${encodeURIComponent(GYM_BRANDING.name)}!`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold transition-all shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Member
            </a>
          )}
          {phoneStr && (
            <a
              href={`tel:+91${phoneStr}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold transition-all"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          )}
        </div>
      </div>

      {/* Member Executive Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#12141c] via-[#101218] to-[#0d0f15] border border-zinc-800/90 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-[#ccff00]/10 to-transparent pointer-events-none opacity-40" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* VIP Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1d202d] to-[#12141c] border-2 border-[#ccff00]/60 flex items-center justify-center text-2xl font-black text-[#ccff00] shadow-lg shadow-black/50">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ccff00] border-2 border-[#12141c]" />
              </span>
            </div>

            {/* Profile Identifiers */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {formState.name || "Member Profile"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00] text-[11px] font-mono font-bold">
                  {formState.memberCode || "MEM-ACTIVE"}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="h-3.5 w-3.5 text-zinc-400" />
                  +91 {phoneStr || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  {formState.email || "No email"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#ccff00]" />
                  Joined: {formState.DOJ || "Recently"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badges & Active Plan */}
          <div className="flex sm:flex-col items-end gap-2 text-right">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {formState.activeServiceName ? "Active Membership" : "Registered Athlete"}
            </span>
            {formState.activeServiceName && (
              <span className="text-xs font-bold text-[#ccff00] flex items-center gap-1.5">
                <Package className="size-3.5" />
                {formState.activeServiceName}
              </span>
            )}
            <span className="text-[11px] text-zinc-400 font-mono">
              Club: {GYM_BRANDING.name}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout: Edit Details Form & Attendance Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Edit Member Details (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-[#ccff00]" />
                Personal & Membership Dossier
              </h2>
              <p className="text-xs text-zinc-400">
                Update contact records, address, and biometric dates
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              * Required fields
            </span>
          </div>

          <form onSubmit={handleOnSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Full Name <span className="text-[#ccff00]">*</span>
              </Label>
              <Input
                placeholder="Full Name"
                type="text"
                value={formState.name}
                onChange={(e) => handleInputChange(e.target.value, "name")}
                className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
                Mobile Number <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="relative">
                <Input
                  maxLength={10}
                  placeholder="10 digit phone"
                  type="text"
                  value={phoneStr}
                  onChange={(e) => handleInputChange(e.target.value.replace(/\D/g, ""), "phone")}
                  className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm font-mono"
                />
                <Phone className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Email Address</Label>
              <div className="relative">
                <Input
                  placeholder="Email"
                  type="email"
                  value={formState.email || ""}
                  onChange={(e) => handleInputChange(e.target.value, "email")}
                  className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
                />
                <Mail className="absolute right-3.5 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">
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
                    className={`flex items-center justify-center h-10 rounded-xl border text-xs font-semibold capitalize cursor-pointer transition-all ${
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

            {/* Dates: DOB & DOJ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  Date of Joining <span className="text-[#ccff00]">*</span>
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
              <Label className="text-xs font-medium text-zinc-300">Residential Address</Label>
              <Input
                placeholder="Area, Street, City"
                type="text"
                value={formState.address || ""}
                onChange={(e) => handleInputChange(e.target.value, "address")}
                className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <p className="text-[11px] text-zinc-400">
                Changes will immediately sync with the member portal and check-in kiosk.
              </p>
              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 px-8 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#ccff00]/10"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Member"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Attendance & Discipline Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AttendanceSummary member_id={member_id} />
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;
