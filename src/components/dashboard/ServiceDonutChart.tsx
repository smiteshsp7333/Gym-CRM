"use client"

import React, { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface ServiceSlice {
  name: string
  value: number
  color: string
  percentage: number
}

const serviceDistribution: ServiceSlice[] = [
  { name: "Annual Premium", value: 52000, percentage: 42, color: "#ccff00" }, // Neon Lime
  { name: "Personal Training", value: 32000, percentage: 26, color: "#06b6d4" }, // Cyan
  { name: "Quarterly Regular", value: 22000, percentage: 18, color: "#f59e0b" }, // Amber
  { name: "Zumba & HIIT", value: 12500, percentage: 10, color: "#f43f5e" }, // Rose
  { name: "Monthly / Yoga", value: 6000, percentage: 4, color: "#a855f7" }, // Purple
]

export function ServiceDonutChart() {
  const [hoveredSlice, setHoveredSlice] = useState<ServiceSlice | null>(null)
  const totalAmount = serviceDistribution.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="rounded-3xl bg-[#12141c] border border-white/[0.08] p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">Revenue Mix & Plans</h3>
          <p className="text-xs text-slate-400">Distribution across active programs</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-medium">
          5 Categories
        </span>
      </div>

      {/* Donut Chart with Center Display */}
      <div className="relative w-full h-56 my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ServiceSlice
                  return (
                    <div className="rounded-2xl bg-[#090a0f] border border-white/20 px-3 py-1.5 shadow-xl text-xs backdrop-blur-md">
                      <span className="font-semibold text-white">{data.name}: </span>
                      <span className="text-[#ccff00] font-bold">₹{data.value.toLocaleString("en-IN")}</span>
                      <span className="text-slate-400"> ({data.percentage}%)</span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={serviceDistribution}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredSlice(serviceDistribution[index])}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              {serviceDistribution.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={entry.color}
                  stroke="#12141c"
                  strokeWidth={3}
                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total / Hover Badge matching Screenshot 1 & 2 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xs text-slate-400 font-medium">
            {hoveredSlice ? hoveredSlice.name : "Total Program Sales"}
          </span>
          <span className="text-2xl font-extrabold text-white tracking-tight tabular-nums mt-0.5">
            ₹{(hoveredSlice ? hoveredSlice.value : totalAmount).toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] font-semibold text-[#ccff00] mt-0.5">
            {hoveredSlice ? `${hoveredSlice.percentage}% of gross` : "100% Active"}
          </span>
        </div>
      </div>

      {/* Multi-Color Legend Pills */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.04]">
        {serviceDistribution.slice(0, 4).map((item) => (
          <div
            key={item.name}
            onMouseEnter={() => setHoveredSlice(item)}
            onMouseLeave={() => setHoveredSlice(null)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            ></span>
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-slate-300 truncate max-w-[90px]">{item.name}</span>
              <span className="font-semibold text-white">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
