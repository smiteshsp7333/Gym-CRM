"use client";
import { AddAttendance, GetAttendanceByDate } from "@/action/attendance.action";
import { GetAllMembers } from "@/action/member.action";
import ItemSelector from "@/components/custom/item-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLoading } from "@/hooks/use-loading";
import { format, set } from "date-fns";
import { Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {};

const page = (props: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const [memberList, setMemberList] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedMember, setSelectedMember] = React.useState<string>();
  const [attendanceList, setAttendanceList] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      const data = await GetAllMembers();
      setMemberList(data);
    }
    fetchData();
    fetchTodaysAttendance();
  }, []);
  useEffect(() => {
    async function fetchData() {
      await fetchTodaysAttendance();
    }
    fetchData();
  }, [refresh]);
  async function fetchTodaysAttendance() {
    const data = await GetAttendanceByDate(format(new Date(), "dd-MM-yyyy"));
    console.log(data);
    setAttendanceList(data);
  }
  const handleCheckIn = async () => {
    showLoading();
    setRefresh(!refresh);
    if (!selectedMember) return;
    const newAttendance = {
      member_id: selectedMember,
      date: format(new Date(), "dd-MM-yyyy"),
      time: format(new Date(), "HH:mm:ss"),
    };
    const data = await AddAttendance(newAttendance);
    if (data.id) {
      toast.success("Attendance added successfully");
    }
    hideLoading();
  };

  function convertToAmPm(timeStr: string) {
    const [hour, minute, sec] = timeStr.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12; // convert 0 to 12
    return `${h.toString().padStart(2, "0")}:${minute} ${ampm}`;
  }
  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Attendance & Floor Activity
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 tabular-nums">
              {attendanceList.length} Athletes Checked In
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric & manual athlete check-in logger
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/attendance/history">
            <Button variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white flex items-center gap-2">
              <Clock className="size-4 text-[#ccff00]" />
              <span>Attendance History</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Check-in Terminal Card */}
      <div className="p-6 rounded-3xl bg-[#12141c] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-2/3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Instant Athlete Check-In
          </label>
          <ItemSelector
            data={memberList}
            valueKey="id"
            labelKey="name"
            onSelect={(id) => setSelectedMember(id)}
            placeholder="Select or search athlete by name..."
            searchPlaceholder="Type member name..."
          />
        </div>
        <Button
          onClick={handleCheckIn}
          disabled={!selectedMember}
          className="w-full md:w-auto h-11 px-8 rounded-full bg-[#ccff00] text-black font-semibold text-sm hover:bg-[#b6f904] shadow-md shadow-[#ccff00]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="size-4" />
          <span>Mark Check-In</span>
        </Button>
      </div>

      {/* Today's Log Card */}
      <Card className="rounded-3xl bg-[#12141c] border border-white/[0.08] shadow-2xl p-6">
        <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-white">Today's Check-in Feed</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Live chronological stream of floor entries</p>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
            {format(new Date(), "dd MMMM yyyy")}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/[0.04]">
            {attendanceList.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No check-ins marked yet today. Use the terminal above to log an athlete.
              </div>
            ) : (
              attendanceList.map((attendance, index) => (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-white/[0.03] transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-xs font-bold text-slate-500 tabular-nums w-6">
                      #{index + 1}
                    </span>
                    <div className="size-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                      {(attendance.member?.name || "MB").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{attendance.member?.name}</p>
                      <span className="text-[11px] text-slate-400">Gym Athlete</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 tabular-nums">
                      <span className="size-1.5 rounded-full bg-[#ccff00]"></span>
                      {attendance.time ? convertToAmPm(attendance.time) : "Checked in"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
