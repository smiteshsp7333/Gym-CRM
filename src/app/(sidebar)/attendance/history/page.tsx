"use client";

import { GetAttendanceByDate } from "@/action/attendance.action";
import { DatePickerDemo } from "@/components/custom/date-picker";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  ArrowLeft,
  CalendarCheck2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { GYM_BRANDING } from "@/config/branding";

const AttendanceHistoryPage = () => {
  const [date, setDate] = useState(format(new Date(), "dd-MM-yyyy"));
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await GetAttendanceByDate(date);
        setAttendanceList(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [date]);

  function convertToAmPm(timeStr: string) {
    if (!timeStr) return "—";
    const [hour, minute] = timeStr.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${minute} ${ampm}`;
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/attendance"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Live Terminal
            </Link>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold uppercase tracking-wider">
              Archives
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Attendance History & Logs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Audit historic check-in logs and biometric terminal entries for {GYM_BRANDING.name}.
          </p>
        </div>

        {/* Date Filter & Count Pill */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <DatePickerDemo defaultDate={date} onDateChange={(newDate) => setDate(newDate)} />
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#12141c] border border-zinc-800 flex items-center gap-2 text-xs font-mono font-bold text-[#ccff00]">
            <Users className="h-4 w-4" />
            {attendanceList.length} Checked In
          </div>
        </div>
      </div>

      {/* Attendance Table Card */}
      <div className="rounded-3xl bg-[#12141c] border border-zinc-800/80 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CalendarCheck2 className="h-4 w-4 text-[#ccff00]" />
            Logs for {date}
          </h2>
          <span className="text-xs font-mono text-zinc-500">Live DB Records</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-zinc-400">
            Loading biometric archives...
          </div>
        ) : attendanceList.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 mx-auto">
              <CalendarDays className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-300">
              No attendance records found for {date}
            </p>
            <p className="text-xs text-zinc-500">
              Select another calendar date or log a check-in from the attendance kiosk.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {attendanceList.map((record, index) => (
              <div
                key={record.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-xs"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 text-zinc-500 font-mono text-[11px] font-bold">
                    #{index + 1}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-200">
                    {record.member?.name?.[0]?.toUpperCase() || "M"}
                  </div>
                  <div>
                    <Link
                      href={`/members/${record.member?.id}`}
                      className="text-sm font-bold text-white hover:text-[#ccff00] transition-colors"
                    >
                      {record.member?.name}
                    </Link>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      +91 {record.member?.phone?.toString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {convertToAmPm(record.time)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistoryPage;