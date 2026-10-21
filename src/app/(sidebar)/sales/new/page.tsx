"use client";

import { GetAllMembers, MemberResponse } from "@/action/member.action";
import { AddSales, SalesInput } from "@/action/sales.action";
import { GetAllServices, ServiceResponse } from "@/action/service.action";
import { DatePickerDemo } from "@/components/custom/date-picker";
import ItemSelector from "@/components/custom/item-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoading } from "@/hooks/use-loading";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  ArrowLeft,
  Sparkles,
  Receipt,
  User,
  Package,
  Calendar,
  CheckCircle2,
  Wallet,
  Coins,
  QrCode,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";
import { format } from "date-fns";

const NewSalePage = () => {
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [paymentMode, setPaymentMode] = useState<"UPI" | "Cash" | "Card">("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showLoading, hideLoading } = useLoading();
  const [formState, setFormState] = useState<SalesInput>({
    member_id: "",
    service_id: "",
    description: "Annual Gym Membership",
    discount: 0,
    amount: 0,
    paid: 0,
    startDate: format(new Date(), "dd-MM-yyyy"),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [memData, srvData] = await Promise.all([
          GetAllMembers(),
          GetAllServices(),
        ]);
        setMembers(memData || []);
        setServices(srvData || []);
      } catch (err) {
        console.error("Failed to load members/services", err);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e: any, field: keyof SalesInput) => {
    setFormState((prev) => ({ ...prev, [field]: e }));
  };

  // Demo auto-fill for client pitch
  const handleQuickDemoSale = () => {
    if (members.length === 0 || services.length === 0) {
      toast.error("Loading membership data... please wait");
      return;
    }
    const sampleMember = members[0];
    const sampleService = services[0];

    setSelectedMember(sampleMember);
    setSelectedService(sampleService);

    const price = sampleService.price || 12000;
    const discount = 1000;
    const paid = price - discount;

    setFormState({
      member_id: sampleMember.id,
      service_id: sampleService.id,
      description: `${sampleService.name} - Full Payment`,
      discount,
      amount: price,
      paid,
      startDate: format(new Date(), "dd-MM-yyyy"),
    });

    toast.info("Sample sale loaded with live pricing & discount!");
  };

  const netCharge = Math.max(0, formState.amount - formState.discount);
  const balanceDue = Math.max(0, netCharge - formState.paid);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formState.member_id ||
      !formState.service_id ||
      formState.amount <= 0 ||
      !formState.startDate
    ) {
      toast.error("Please select a member, service package, and start date");
      return;
    }

    if (formState.paid < 0) {
      toast.error("Amount paid cannot be negative");
      return;
    }

    setIsSubmitting(true);
    showLoading();

    try {
      const response = await AddSales(formState);
      if (response?.id) {
        toast.success("Sale invoice processed successfully!");
        window.location.href = `/sales`;
      } else {
        toast.error("Failed to record sale");
      }
    } catch {
      toast.error("An error occurred while creating the sale");
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Demo Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/sales"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sales Ledger
        </Link>

        <button
          type="button"
          onClick={handleQuickDemoSale}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-[#ccff00]/15 text-zinc-300 hover:text-[#ccff00] border border-zinc-800 hover:border-[#ccff00]/40 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#ccff00]" />
          Quick Demo Sale
        </button>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Intake (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="pb-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-2">
                <Receipt className="h-3.5 w-3.5" />
                POS Billing
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Process New Membership Sale
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Assign membership packages, apply discounts, and generate instant receipt.
              </p>
            </div>
          </div>

          <form onSubmit={handleOnSubmit} className="space-y-5">
            {/* Member Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#ccff00]" />
                Select Member <span className="text-[#ccff00]">*</span>
              </Label>
              <ItemSelector
                data={members}
                valueKey="id"
                labelKey="name"
                onSelect={(value) => handleInputChange(value, "member_id")}
                placeholder="Choose or search member name..."
                searchPlaceholder="Search member name or phone..."
                onSelectGetRow={(row) => setSelectedMember(row)}
              />
              {selectedMember && (
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
                  <span>Selected: <strong>{selectedMember.name}</strong></span>
                  <span className="font-mono text-zinc-400">+91 {selectedMember.phone?.toString()}</span>
                </div>
              )}
            </div>

            {/* Service / Package Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-[#ccff00]" />
                Select Plan / Service <span className="text-[#ccff00]">*</span>
              </Label>
              <ItemSelector
                data={services}
                valueKey="id"
                labelKey="name"
                onSelect={(value) => handleInputChange(value, "service_id")}
                placeholder="Select membership tier..."
                searchPlaceholder="Search service tiers..."
                onSelectGetRow={(row) => {
                  setSelectedService(row);
                  setFormState((prev) => ({
                    ...prev,
                    amount: row.price || 0,
                    paid: row.price || 0,
                    description: `${row.name} Plan`,
                  }));
                }}
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#ccff00]" />
                Membership Activation Date <span className="text-[#ccff00]">*</span>
              </Label>
              <div className="rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800">
                <DatePickerDemo
                  defaultDate={formState.startDate}
                  onDateChange={(e) => handleInputChange(e, "startDate")}
                />
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-[#ccff00]" />
                Payment Method
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { mode: "UPI", icon: QrCode },
                  { mode: "Cash", icon: Coins },
                  { mode: "Card", icon: CreditCard },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode as any)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMode === mode
                        ? "bg-[#ccff00]/15 border-[#ccff00] text-[#ccff00]"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Description / Memo */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Invoice Remarks / Notes</Label>
              <Input
                placeholder="e.g. Annual Gym + Cardio, paid via GPay"
                type="text"
                value={formState.description}
                onChange={(e) => handleInputChange(e.target.value, "description")}
                className="h-11 rounded-xl bg-zinc-900/80 border-zinc-800 focus:border-[#ccff00] text-zinc-100 placeholder-zinc-500 text-sm"
              />
            </div>
          </form>
        </div>

        {/* Right Column: Live POS Calculation Receipt (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="pb-4 border-b border-zinc-800/80 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#ccff00]" />
                Billing Summary
              </h2>
              <span className="text-xs font-mono text-zinc-400">{paymentMode}</span>
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-4 text-sm">
              {/* Gross Plan Amount */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs">Standard Package Price</span>
                <span className="font-mono text-zinc-200 font-semibold text-base">
                  {GYM_BRANDING.currency}{formState.amount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Discount Input */}
              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-zinc-400">Discount Offered ({GYM_BRANDING.currency})</Label>
                  <span className="text-xs font-mono text-rose-400">
                    -{GYM_BRANDING.currency}{formState.discount.toLocaleString("en-IN")}
                  </span>
                </div>
                <Input
                  type="number"
                  min="0"
                  value={formState.discount || 0}
                  onChange={(e) => handleInputChange(Number(e.target.value), "discount")}
                  className="h-10 rounded-xl bg-zinc-900 border-zinc-700/80 focus:border-[#ccff00] text-zinc-100 text-sm font-mono"
                />
              </div>

              {/* Net Payable */}
              <div className="p-3.5 rounded-2xl bg-[#090a0f] border border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 uppercase">Net Payable</span>
                <span className="text-lg font-black text-white font-mono">
                  {GYM_BRANDING.currency}{netCharge.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Amount Paid Now Input */}
              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-zinc-400 font-medium">
                    Amount Paid Today ({GYM_BRANDING.currency})
                  </Label>
                  <span className="text-xs font-mono text-emerald-400">
                    +{GYM_BRANDING.currency}{(formState.paid || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <Input
                  type="number"
                  min="0"
                  value={formState.paid || 0}
                  onChange={(e) => handleInputChange(Number(e.target.value), "paid")}
                  className="h-10 rounded-xl bg-zinc-900 border-zinc-700/80 focus:border-[#ccff00] text-zinc-100 text-sm font-mono"
                />
              </div>

              {/* Balance Due Pill */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  balanceDue > 0
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {balanceDue > 0 ? (
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-[#ccff00]" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {balanceDue > 0 ? "Pending Balance Due" : "Full Payment Settled"}
                  </span>
                </div>
                <span className="text-base font-black font-mono">
                  {GYM_BRANDING.currency}{balanceDue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Final Checkout Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleOnSubmit}
                disabled={isSubmitting || formState.amount <= 0}
                className="w-full h-12 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ccff00]/20 transition-all active:scale-[0.98] disabled:opacity-40"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isSubmitting ? "Generating Invoice..." : "Confirm & Issue Invoice"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSalePage;