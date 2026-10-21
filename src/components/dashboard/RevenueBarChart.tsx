"use client"

import React, { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { TrendingUp } from "lucide-react"

interface DayData {
  day: string
  amount: number
  attendance: number
  dateStr: string
}

const weeklyData: DayData[] = [
  { day: "Mon", amount: 14000, attendance: 16, dateStr: "14 Oct" },
  { day: "Tue", amount: 8500, attendance: 18, dateStr: "15 Oct" },
  { day: "Wed", amount: 18500, attendance: 22, dateStr: "16 Oct" },
  { day: "Thu", amount: 12000, attendance: 19, dateStr: "17 Oct" },
  { day: "Fri", amount: 9500, attendance: 17, dateStr: "18 Oct" },
  { day: "Sat", amount: 22500, attendance: 25, dateStr: "19 Oct" }, // Peak!
  { day: "Sun", amount: 7000, attendance: 14, dateStr: "20 Oct" },
]

const monthlyData: DayData[] = [
  { day: "May", amount: 48000, attendance: 210, dateStr: "May 2026" },
  { day: "Jun", amount: 62000, attendance: 280, dateStr: "Jun 2026" },
  { day: "Jul", amount: 74000, attendance: 340, dateStr: "Jul 2026" },
  { day: "Aug", amount: 89000, attendance: 390, dateStr: "Aug 2026" },
  { day: "Sep", amount: 110000, attendance: 430, dateStr: "Sep 2026" },
  { day: "Oct", amount: 124500, attendance: 480, dateStr: "Oct 2026" }, // Peak!
]

// Custom Floating Tooltip matching Screenshot 1 ($3,256.32 pill badge)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: DayData = payload[0].payload
    return (
      <div className="relative rounded-2xl bg-[#0b0c12] border border-[#ccff00]/40 px-3.5 py-2 shadow-2xl shadow-black/80 backdrop-blur-md">
        <div className="text-[11px] font-medium text-slate-400">{data.dateStr}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-base font-bold text-[#ccff00] tabular-nums">
            ₹{data.amount.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-slate-300 bg-white/10 px-1.5 py-0.5 rounded-full">
            {data.attendance} check-ins
          </span>
        </div>
      </div>
    )
  }
  return null
}

export function RevenueBarChart() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week")
  const [activeIndex, setActiveIndex] = useState<number>(5) // default Sat or Oct

  const currentData = timeframe === "week" ? weeklyData : monthlyData
  const peakIndex = timeframe === "week" ? 5 : 5
  const totalAmount = currentData.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="rounded-3xl bg-[#12141c] border border-white/[0.08] p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
      {/* Chart Top Header matching Screenshot 1 & 2 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Revenue & Activity Velocity</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cash flow & attendance volume tracking
          </p>
        </div>

        {/* Timeframe Toggle Pills */}
        <div className="flex items-center bg-[#090a0f] border border-white/[0.08] p-1 rounded-full text-xs">
          <button
            onClick={() => {
              setTimeframe("week")
              setActiveIndex(5)
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              timeframe === "week"
                ? "bg-[#ccff00] text-black font-semibold shadow-sm shadow-[#ccff00]/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => {
              setTimeframe("month")
              setActiveIndex(5)
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              timeframe === "month"
                ? "bg-[#ccff00] text-black font-semibold shadow-sm shadow-[#ccff00]/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Past 6 Months
          </button>
        </div>
      </div>

      {/* Main Metric Display & Peak Floating Pill preview */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
          ₹{totalAmount.toLocaleString("en-IN")}
        </span>
        <span className="text-xs text-slate-400">
          {timeframe === "week" ? "weekly throughput" : "H2 gross collections"}
        </span>
        <span className="ml-auto hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 text-xs font-bold">
          <TrendingUp className="size-3.5 text-[#ccff00]" />
          Peak: ₹{(currentData[peakIndex]?.amount || 0).toLocaleString("en-IN")}
        </span>
      </div>

      {/* Recharts Capsule Bar Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            onMouseMove={(state: any) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex)
              }
            }}
          >
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
            <Bar
              dataKey="amount"
              radius={[14, 14, 14, 14]}
              barSize={timeframe === "week" ? 34 : 40}
            >
              {currentData.map((entry, index) => {
                const isSelected = index === activeIndex
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isSelected ? "#ccff00" : "#202432"}
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      filter: isSelected ? "drop-shadow(0px 0px 8px rgba(204, 255, 0, 0.45))" : "none",
                    }}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/[0.04]">
        <span>Hover any capsule to inspect individual day collection</span>
        <span className="text-[#ccff00] font-medium">Sat Peak: +84% above avg</span>
      </div>
    </div>
  )
}
