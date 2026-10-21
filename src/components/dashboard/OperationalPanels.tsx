"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { GYM_BRANDING } from "@/config/branding";

interface PendingItem {
  id: string;
  member_name: string;
  member_phone: string | number;
  service_name: string;
  due: number;
}

interface ExpiringItem {
  id: string;
  member_name: string;
  member_phone: string | number;
  service_name: string;
  endDate: string;
  daysLeft: number;
}

interface OperationalPanelsProps {
  pendingList: PendingItem[];
  expiringList: ExpiringItem[];
}

export function OperationalPanels({ pendingList, expiringList }: OperationalPanelsProps) {
  const topPending = pendingList.slice(0, 4);
  const topExpiring = expiringList.slice(0, 4);

  const handleWhatsAppNudge = (item: PendingItem) => {
    const msg = `Hi ${item.member_name}, your payment for ${item.service_name} of ₹${item.due} is pending at ${GYM_BRANDING.name}. Please settle at your earliest convenience. Thank you! - Team ${GYM_BRANDING.shortName}`;
    window.open(`https://api.whatsapp.com/send?phone=91${item.member_phone}&text=${encodeURIComponent(msg)}`);
  };

  const handleRenewalNudge = (item: ExpiringItem) => {
    const msg = `Hi ${item.member_name}, your ${item.service_name} membership at ${GYM_BRANDING.name} is ending on ${item.endDate}. Please renew today to maintain workout continuity! - Team ${GYM_BRANDING.shortName}`;
    window.open(`https://api.whatsapp.com/send?phone=91${item.member_phone}&text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
      {/* 1. Pending Dues Recovery Stream */}
      <div className="rounded-3xl bg-[#12141c] border border-white/[0.08] p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertCircle className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Pending Dues Recovery</h3>
                <p className="text-xs text-slate-400">1-click WhatsApp collection reminders</p>
              </div>
            </div>
            <span className="size-6 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center border border-rose-500/30 font-mono">
              {pendingList.length}
            </span>
          </div>

          <div className="space-y-2.5 my-3">
            {topPending.length > 0 ? (
              topPending.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                      {item.member_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.member_name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">{item.service_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-400 tabular-nums">₹{item.due.toLocaleString("en-IN")}</p>
                      <span className="text-[10px] text-slate-500">Unpaid balance</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppNudge(item)}
                      title="Send WhatsApp Payment Nudge"
                      className="size-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black flex items-center justify-center border border-[#25D366]/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">No pending dues! All accounts settled.</p>
            )}
          </div>
        </div>

        <Link href="/sales/pending-payments" prefetch={true} className="block pt-3 border-t border-white/[0.04]">
          <span className="text-xs font-semibold text-[#ccff00] hover:underline flex items-center justify-between">
            <span>View all pending dues ({pendingList.length})</span>
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
      </div>

      {/* 2. Expiring Memberships Retention Radar */}
      <div className="rounded-3xl bg-[#12141c] border border-white/[0.08] p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Membership Retention Radar</h3>
                <p className="text-xs text-slate-400">Expiring in the next 0 to 7 days</p>
              </div>
            </div>
            <span className="size-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30 font-mono">
              {expiringList.length}
            </span>
          </div>

          <div className="space-y-2.5 my-3">
            {topExpiring.length > 0 ? (
              topExpiring.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
                      {item.member_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.member_name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">{item.service_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        {item.daysLeft <= 0 ? "Expires Today" : `Ends in ${item.daysLeft}d`}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{item.endDate}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRenewalNudge(item)}
                      title="Send WhatsApp Renewal Reminder"
                      className="size-8 rounded-full bg-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00] hover:text-black flex items-center justify-center border border-[#ccff00]/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">No memberships expiring this week!</p>
            )}
          </div>
        </div>

        <Link href="/sales/followups" prefetch={true} className="block pt-3 border-t border-white/[0.04]">
          <span className="text-xs font-semibold text-[#ccff00] hover:underline flex items-center justify-between">
            <span>Open Follow-ups Radar ({expiringList.length})</span>
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default OperationalPanels;
