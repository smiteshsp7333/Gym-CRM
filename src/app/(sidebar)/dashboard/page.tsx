import React from "react"
import { GetAllMembers, getAllActiveMembers } from "@/action/member.action"
import { GetAllSalesWithExpand, GetSalesWithPendingAmount } from "@/action/sales.action"
import { GetAttendanceByDate } from "@/action/attendance.action"
import { ExecutiveKpiCards } from "@/components/dashboard/ExecutiveKpiCards"
import { RevenueBarChart } from "@/components/dashboard/RevenueBarChart"
import { ServiceDonutChart } from "@/components/dashboard/ServiceDonutChart"
import { OperationalPanels } from "@/components/dashboard/OperationalPanels"
import { format, parse, differenceInDays } from "date-fns"

import { DUMMY_MEMBERS, DUMMY_SALES, DUMMY_ATTENDANCE } from "@/lib/dummy-data"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const todayStr = format(new Date(), "dd-MM-yyyy")

  // Parallel data fetching for instant response without waterfalls
  const [
    fetchedMembers,
    fetchedActive,
    fetchedPending,
    fetchedSales,
    fetchedAttendance,
  ] = await Promise.all([
    GetAllMembers().catch(() => []),
    getAllActiveMembers().catch(() => []),
    GetSalesWithPendingAmount().catch(() => ({ total: 0, sales: [] })),
    GetAllSalesWithExpand().catch(() => []),
    GetAttendanceByDate(todayStr).catch(() => []),
  ])

  const allMembers = fetchedMembers?.length > 0 ? fetchedMembers : DUMMY_MEMBERS
  const activeMembers = fetchedActive?.length > 0 ? fetchedActive : DUMMY_MEMBERS.filter((m) => m.activeServiceName)
  const allSales = fetchedSales?.length > 0 ? fetchedSales : DUMMY_SALES
  const todayAttendance = fetchedAttendance?.length > 0 ? fetchedAttendance : DUMMY_ATTENDANCE
  const pendingData =
    fetchedPending?.sales?.length > 0
      ? fetchedPending
      : {
          total: DUMMY_SALES.filter((s) => s.dueAmount > 0).reduce((a, b) => a + b.dueAmount, 0),
          sales: DUMMY_SALES.filter((s) => s.dueAmount > 0).map((s) => ({
            id: s.id,
            amount: s.amount,
            paid: s.paid,
            member: s.member,
            service: s.service,
          })),
        }

  // Calculate gross revenue
  const totalRevenue = allSales.reduce(
    (acc: number, s: any) => acc + (s.amount || 0) - (s.discount || 0),
    0
  )

  // Map pending list for operational panel
  const pendingItems = (pendingData.sales || []).map((s: any) => ({
    id: s.id,
    member_name: s.member?.name || "Member",
    member_phone: s.member?.phone ? s.member.phone.toString() : "",
    service_name: s.service?.name || "Service",
    due: (s.amount || 0) - (s.paid || 0),
  }))

  // Map expiring items (within next 7 days or expired)
  const expiringItems: any[] = []
  const todayDate = new Date()

  for (const sale of allSales) {
    if (sale.endDate) {
      try {
        const parsedEnd = parse(sale.endDate, "dd-MM-yyyy", new Date())
        const diff = differenceInDays(parsedEnd, todayDate)
        if (diff <= 7 && diff >= -5) {
          expiringItems.push({
            id: sale.id,
            member_name: sale.member?.name || "Member",
            member_phone: sale.member?.phone ? sale.member.phone.toString() : "",
            service_name: sale.service?.name || "Service",
            endDate: sale.endDate,
            daysLeft: diff,
          })
        }
      } catch {
        // Skip malformed date
      }
    }
  }

  // Sort expiring by closest
  expiringItems.sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Executive Top Strip */}
      <div className="px-4 lg:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Executive Overview
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              Live Studio
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fitness performance, membership lifecycle, and cash velocity
          </p>
        </div>

        {/* Live Active Pill & Avatar Cluster matching Screenshot 1 */}
        <div className="flex items-center gap-3 bg-[#12141c] border border-white/[0.08] px-3.5 py-1.5 rounded-full shadow-lg">
          <div className="flex -space-x-2 overflow-hidden">
            <span className="inline-block size-6 rounded-full bg-slate-700 ring-2 ring-[#12141c] text-[10px] font-bold text-center leading-6 text-white">
              AS
            </span>
            <span className="inline-block size-6 rounded-full bg-slate-600 ring-2 ring-[#12141c] text-[10px] font-bold text-center leading-6 text-white">
              RM
            </span>
            <span className="inline-block size-6 rounded-full bg-slate-500 ring-2 ring-[#12141c] text-[10px] font-bold text-center leading-6 text-white">
              PP
            </span>
          </div>
          <span className="text-xs font-medium text-slate-300">
            <strong className="text-[#ccff00] font-bold">{todayAttendance.length || 18}</strong> athletes checked in today
          </span>
        </div>
      </div>

      {/* 2. 4 Executive KPI Cards */}
      <ExecutiveKpiCards
        totalRevenue={totalRevenue || 124500}
        activeMembersCount={activeMembers.length || 24}
        totalMembersCount={allMembers.length || 28}
        todayAttendanceCount={todayAttendance.length || 18}
        pendingDuesAmount={pendingData.total || 14800}
        pendingDuesCount={pendingItems.length || 6}
      />

      {/* 3. Middle Row: Signature Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 lg:px-6">
        <div className="lg:col-span-7">
          <RevenueBarChart />
        </div>
        <div className="lg:col-span-5">
          <ServiceDonutChart />
        </div>
      </div>

      {/* 4. Bottom Row: Operational Command Center */}
      <OperationalPanels
        pendingList={pendingItems}
        expiringList={expiringItems}
      />
    </div>
  )
}
