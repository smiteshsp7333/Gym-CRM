"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { GYM_BRANDING } from "@/config/branding";
import { getStoreSaleById } from "@/lib/gym-store";
import { GetSaleWithExpand } from "@/action/sales.action";
import { Printer, Share2, ArrowLeft, MessageCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function InvoicePage({ params }: { params: any }) {
  const unwrappedParams = React.use(params);
  const { sale_id } = unwrappedParams as { sale_id: string };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [sale, setSale] = useState<any>(null);

  useEffect(() => {
    // 1. Check unified store
    const local = getStoreSaleById(sale_id);
    if (local) {
      setSale(local);
      return;
    }

    // 2. Fallback to server action
    async function load() {
      try {
        const data = await GetSaleWithExpand(sale_id);
        if (data) setSale(data);
      } catch (err) {
        console.error("Failed to load invoice data:", err);
      }
    }
    load();
  }, [sale_id]);

  const totalAmount = Number(sale?.amount || 15000);
  const discount = Number(sale?.discount || 0);
  const netPaid = Number(sale?.paid || 0);
  const netPayable = Math.max(0, totalAmount - discount);
  const balanceDue = Math.max(0, netPayable - netPaid);

  // Auto-calculated 18% GST (CGST 9% + SGST 9%)
  const basePrice = Math.round(netPayable / 1.18);
  const totalTax = netPayable - basePrice;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  const invoiceNo = `INV-2026-${(sale?.id || "001").slice(-5).toUpperCase()}`;

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const text = encodeURIComponent(
        `Dear ${sale?.member?.name || "Member"},\n\nYour official membership Tax Invoice from ${GYM_BRANDING.name} has been issued.\n\nInvoice No: ${invoiceNo}\nPlan: ${sale?.service?.name || "Membership Plan"}\nAmount: ₹${netPayable.toLocaleString("en-IN")}\n\nView and download invoice here:\n${url}\n\nThank you for choosing ${GYM_BRANDING.name}!\n- Team ${GYM_BRANDING.shortName}`
      );
      window.open(`https://wa.me/91${sale?.member?.phone || ""}?text=${text}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Controls (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl shadow-xl">
          <Link
            href="/sales"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sales Ledger
          </Link>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => reactToPrintFn()}
              className="h-9 px-4 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#ccff00]/20"
            >
              <Printer className="size-3.5" />
              <span>Print Tax Invoice</span>
            </Button>

            <Button
              onClick={handleShareWhatsApp}
              className="h-9 px-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="size-3.5" />
              <span>Send on WhatsApp</span>
            </Button>
          </div>
        </div>

        {/* Official Printable Tax Invoice Document */}
        <div
          ref={contentRef}
          className="bg-white text-zinc-900 rounded-2xl shadow-2xl p-8 sm:p-12 border border-zinc-200 print:border-none print:shadow-none print:p-0"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-zinc-200 pb-8 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-12 w-auto object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-zinc-900">
                    {GYM_BRANDING.name}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Fitness & Performance Club
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-600 max-w-sm mt-1">{GYM_BRANDING.fullAddress}</p>
              <p className="text-xs text-zinc-600 mt-0.5">
                Phone: +91 {GYM_BRANDING.phone} | Email: {GYM_BRANDING.email}
              </p>
              <p className="text-xs font-mono font-semibold text-zinc-700 mt-1">
                GSTIN: 29AAACF1234M1Z8
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                Official Tax Invoice
              </span>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight font-mono">
                {invoiceNo}
              </h2>
              <p className="text-xs text-zinc-600 mt-1">
                Issue Date: <strong>{sale?.startDate || "Today"}</strong>
              </p>
              <p className="text-xs text-zinc-600">
                Payment Mode: <strong className="uppercase">{sale?.paymentMode || "UPI"}</strong>
              </p>
            </div>
          </div>

          {/* Billed To / Athlete Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-zinc-200 text-xs">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Billed To (Athlete / Member)
              </h3>
              <p className="text-base font-black text-zinc-900">
                {sale?.member?.name || sale?.member_name || "Gym Athlete"}
              </p>
              <p className="text-zinc-600 font-mono mt-0.5">
                Member ID: {sale?.member?.memberCode || "MEM-1001"}
              </p>
              <p className="text-zinc-600 font-mono">
                Phone: +91 {sale?.member?.phone || sale?.member_phone || "9820110001"}
              </p>
              <p className="text-zinc-600 mt-0.5">
                Address: {sale?.member?.address || "Indiranagar, Bengaluru"}
              </p>
            </div>

            <div className="sm:text-right">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Membership Duration
              </h3>
              <p className="text-base font-bold text-zinc-900">
                {sale?.service?.name || sale?.service_name || "Annual Fitness Package"}
              </p>
              <p className="text-zinc-600 font-mono mt-0.5">
                Period: <strong>{sale?.startDate}</strong> to <strong>{sale?.endDate}</strong>
              </p>
              <p className="text-emerald-700 font-semibold mt-1 flex items-center sm:justify-end gap-1">
                <ShieldCheck className="size-3.5" />
                Active Club Access Granted
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-zinc-900 text-zinc-900 uppercase font-black tracking-wider text-[11px]">
                  <th className="py-3 text-left">Description</th>
                  <th className="py-3 text-center">Duration</th>
                  <th className="py-3 text-right">Base Amount</th>
                  <th className="py-3 text-right">GST (18%)</th>
                  <th className="py-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                <tr>
                  <td className="py-4">
                    <p className="font-bold text-zinc-900 text-sm">
                      {sale?.service?.name || sale?.service_name || "Gym Membership Plan"}
                    </p>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      {sale?.description || "Access to strength equipment, cardio zone & locker facilities"}
                    </p>
                  </td>
                  <td className="py-4 text-center font-mono">
                    {sale?.service?.duration || 6} Months
                  </td>
                  <td className="py-4 text-right font-mono tabular-nums">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 text-right font-mono tabular-nums text-zinc-600">
                    ₹{totalTax.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 text-right font-mono font-bold text-zinc-900 text-sm tabular-nums">
                    ₹{netPayable.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Calculation & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-t border-zinc-200 pt-6 gap-6">
            <div className="text-xs text-zinc-600 max-w-sm space-y-1.5">
              <h4 className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider">
                GST Tax Summary
              </h4>
              <div className="flex justify-between border-b border-zinc-100 pb-1">
                <span>Central GST (CGST 9%):</span>
                <span className="font-mono">₹{cgst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-1">
                <span>State GST (SGST 9%):</span>
                <span className="font-mono">₹{sgst.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[10px] text-zinc-400 pt-1">
                Prices inclusive of applicable goods and services tax under Indian law.
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Gross Package Price:</span>
                <span className="font-mono tabular-nums">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Special Discount Applied:</span>
                  <span className="font-mono tabular-nums">-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-900 font-black text-sm border-t border-zinc-300 pt-2">
                <span>Net Invoice Total:</span>
                <span className="font-mono tabular-nums">₹{netPayable.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Amount Paid:</span>
                <span className="font-mono tabular-nums">₹{netPaid.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-zinc-900 font-black text-sm border-t-2 border-zinc-900 pt-2">
                <span>Balance Due:</span>
                <span className={`font-mono tabular-nums ${balanceDue > 0 ? "text-amber-600" : "text-emerald-700"}`}>
                  {balanceDue > 0 ? `₹${balanceDue.toLocaleString("en-IN")}` : "₹0 (Settled)"}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Footer */}
          <div className="border-t border-zinc-200 mt-8 pt-6 text-[10px] text-zinc-500 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-zinc-700">Terms & Conditions:</h4>
            <p>1. Membership is non-refundable and non-transferable under standard club policies.</p>
            <p>2. Athletes must follow gym safety rules and check in at the front desk before every session.</p>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
              <span className="italic">Authorized Signatory - {GYM_BRANDING.name}</span>
              <span className="font-mono">Generated electronically • No physical stamp required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
