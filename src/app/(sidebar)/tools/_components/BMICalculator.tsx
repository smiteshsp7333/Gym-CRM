"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Info, Sparkles, HeartPulse, CheckCircle2 } from "lucide-react";

interface BMIRange {
  range: string;
  classification: string;
  color: string;
  accentHex: string;
  advice: string;
}

const bmiRanges: BMIRange[] = [
  {
    range: "< 18.5",
    classification: "Underweight",
    color: "bg-cyan-500",
    accentHex: "#06b6d4",
    advice: "Caloric surplus and progressive strength resistance training recommended.",
  },
  {
    range: "18.5 - 24.9",
    classification: "Optimal Fitness",
    color: "bg-[#ccff00]",
    accentHex: "#ccff00",
    advice: "Excellent body composition. Maintain workout frequency and balanced macronutrients.",
  },
  {
    range: "25 - 29.9",
    classification: "Overweight",
    color: "bg-amber-400",
    accentHex: "#fbbf24",
    advice: "Moderate caloric deficit combined with HIIT and strength training recommended.",
  },
  {
    range: "30 - 34.9",
    classification: "Obesity Class I",
    color: "bg-orange-500",
    accentHex: "#f97316",
    advice: "Structured cardiovascular regimen and dietary counseling recommended.",
  },
  {
    range: "35 - 39.9",
    classification: "Obesity Class II",
    color: "bg-rose-500",
    accentHex: "#f43f5e",
    advice: "Supervised athletic conditioning and medical lifestyle evaluation recommended.",
  },
  {
    range: "> 40",
    classification: "Obesity Class III",
    color: "bg-red-600",
    accentHex: "#dc2626",
    advice: "Clinical health consultation and specialized mobility training required.",
  },
];

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(74);
  const [height, setHeight] = useState<number>(176);
  const [bmi, setBMI] = useState<number>(23.9);
  const [status, setStatus] = useState<BMIRange>(bmiRanges[1]);

  useEffect(() => {
    const heightInM = height / 100;
    const val = weight / (heightInM * heightInM);
    const rounded = parseFloat(val.toFixed(1));
    setBMI(rounded);

    if (val < 18.5) setStatus(bmiRanges[0]);
    else if (val < 25) setStatus(bmiRanges[1]);
    else if (val < 30) setStatus(bmiRanges[2]);
    else if (val < 35) setStatus(bmiRanges[3]);
    else if (val < 40) setStatus(bmiRanges[4]);
    else setStatus(bmiRanges[5]);
  }, [weight, height]);

  // Ideal weight range for this height
  const minIdeal = Math.round(18.5 * Math.pow(height / 100, 2));
  const maxIdeal = Math.round(24.9 * Math.pow(height / 100, 2));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Sliders (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-[#ccff00]" />
            Body Mass Index Analyzer
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Adjust the height and body weight sliders below to calculate biometric classification.
          </p>
        </div>

        {/* Weight Slider */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
              Body Weight
            </Label>
            <span className="text-base font-extrabold text-[#ccff00] font-mono bg-[#ccff00]/10 px-3 py-0.5 rounded-full border border-[#ccff00]/20">
              {weight} kg
            </span>
          </div>
          <Slider
            min={35}
            max={180}
            step={1}
            value={[weight]}
            onValueChange={(val) => setWeight(val[0])}
            className="py-2 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
            <span>35 kg</span>
            <span>Ideal: {minIdeal}-{maxIdeal} kg</span>
            <span>180 kg</span>
          </div>
        </div>

        {/* Height Slider */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
              Stature / Height
            </Label>
            <span className="text-base font-extrabold text-cyan-400 font-mono bg-cyan-500/10 px-3 py-0.5 rounded-full border border-cyan-500/20">
              {height} cm ({Math.floor(height / 30.48)}&apos; {Math.round((height % 30.48) / 2.54)}&quot;)
            </span>
          </div>
          <Slider
            min={130}
            max={220}
            step={1}
            value={[height]}
            onValueChange={(val) => setHeight(val[0])}
            className="py-2 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
            <span>130 cm</span>
            <span>Average: 172 cm</span>
            <span>220 cm</span>
          </div>
        </div>

        {/* Multi-Segment Color Scale Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            <span>WHO Classification Scale</span>
            <span className="font-mono text-zinc-300">BMI {bmi}</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5 h-2.5 rounded-full overflow-hidden p-0.5 bg-zinc-900 border border-zinc-800">
            {bmiRanges.map((r, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${r.color} ${
                  status.classification === r.classification ? "opacity-100 ring-2 ring-white" : "opacity-35"
                }`}
                title={r.classification}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Result Circular Gauge Card (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0d0f15] border border-zinc-800 text-center relative overflow-hidden shadow-inner">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          Biometric Score
        </div>

        {/* Circular Display */}
        <div className="relative w-44 h-44 flex items-center justify-center my-2">
          {/* Outer SVG Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              className="stroke-zinc-800 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={status.accentHex}
              fill="none"
              strokeWidth="8"
              strokeDasharray="314"
              strokeDashoffset={Math.max(0, 314 - (Math.min(bmi, 45) / 45) * 314)}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Inner Metrics */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white font-mono tracking-tight">
              {bmi}
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold uppercase">
              kg / m²
            </span>
          </div>
        </div>

        {/* Classification Pill */}
        <div
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide shadow-md"
          style={{
            backgroundColor: `${status.accentHex}20`,
            color: status.accentHex === "#ccff00" ? "#ccff00" : status.accentHex,
            border: `1px solid ${status.accentHex}50`,
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {status.classification}
        </div>

        {/* Dynamic Fitness Advice */}
        <p className="mt-4 text-xs text-zinc-400 leading-relaxed px-2">
          {status.advice}
        </p>

        {/* Recommended Target Range */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80 w-full flex items-center justify-between text-xs text-zinc-400">
          <span>Healthy Target Range:</span>
          <span className="font-bold text-zinc-200 font-mono">
            {minIdeal} - {maxIdeal} kg
          </span>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;