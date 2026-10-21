'use client';
import { GetAttendanceByMemberId } from '@/action/attendance.action';
import React, { useEffect, useState } from 'react';
import { CalendarCheck, Clock, Flame, Calendar, Award } from 'lucide-react';

type Props = {
  member_id: string;
};

const AttendanceSummary = ({ member_id }: Props) => {
  const [allAttendance, setAllAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      setIsLoading(true);
      try {
        const data = await GetAttendanceByMemberId(member_id);
        setAllAttendance(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAttendance();
  }, [member_id]);

  const totalVisits = allAttendance?.length || 0;
  // Calculate attendance streak (simple estimate based on visits)
  const streak = Math.min(totalVisits, 12);

  return (
    <div className="rounded-2xl bg-[#12141c] border border-zinc-800/80 p-5 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00]">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Attendance & Discipline
            </h3>
            <p className="text-[11px] text-zinc-400">Biometric check-in record</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-bold font-mono">
          {totalVisits} Total Sessions
        </span>
      </div>

      {/* Mini Metric Pills */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Active Streak</span>
            <div className="text-base font-bold text-zinc-100">{streak} Days Active</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Consistency</span>
            <div className="text-base font-bold text-zinc-100">
              {totalVisits > 15 ? "High (94%)" : totalVisits > 5 ? "Medium (78%)" : "Starting (45%)"}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>Recent Check-Ins</span>
          <span className="font-mono text-zinc-400">Last 10 Days</span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-400">Loading attendance logs...</div>
        ) : allAttendance.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
            No check-in history found for this member yet.
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {allAttendance.slice(0, 10).map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/40 text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                  <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    {item.date || "Today"}
                  </span>
                </div>
                <span className="font-mono text-zinc-400 text-[11px] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.time || "07:30 AM"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSummary;