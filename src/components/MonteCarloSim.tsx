"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Target, Loader2 } from "lucide-react";
import { monteCarloRetirement, MonteCarloResult } from "@/lib/math";

interface Props {
  initialBalance: number;
  monthlyContribution: number;
  annualReturn: number;
}

export default function MonteCarloSim({
  initialBalance,
  monthlyContribution,
  annualReturn,
}: Props) {
  const [years, setYears] = useState(30);
  const [goal, setGoal] = useState(1_000_000);
  const [volatility, setVolatility] = useState(15);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<MonteCarloResult | null>(null);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      const r = monteCarloRetirement({
        initial: initialBalance,
        monthlyContribution,
        annualReturn: annualReturn / 100,
        annualVolatility: volatility / 100,
        years,
        goal,
        trials: 10000,
      });
      setResult(r);
      setRunning(false);
    }, 50);
  };

  // Build SVG path for each percentile line.
  // Return null early if result isn't ready, so TypeScript knows it's defined inside.
  const chart = useMemo(() => {
    if (!result) return null;
    const r = result; // local non-null alias so TS narrows cleanly below
    const w = 600;
    const h = 200;
    const pad = 20;
    const allVals = r.paths.flatMap((p) => [p.p10, p.p50, p.p90]);
    const max = Math.max(...allVals, goal);
    const min = 0;
    const stepX = (w - pad * 2) / (r.paths.length - 1);
    const toY = (v: number) =>
      h - pad - ((v - min) / (max - min)) * (h - pad * 2);

    const makePath = (getY: (p: (typeof r.paths)[number]) => number) =>
      r.paths
        .map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * stepX} ${toY(getY(p))}`)
        .join(" ");

    return {
      p10: makePath((p) => p.p10),
      p50: makePath((p) => p.p50),
      p90: makePath((p) => p.p90),
      goalY: toY(goal),
      w,
      h,
      pad,
    };
  }, [result, goal]);

  // Cap the year index when reading endpoint stats so we never blow past the array
  const endingIndex = result
    ? Math.min(years, result.paths.length - 1)
    : 0;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Years" value={years} onChange={setYears} min={5} max={50} />
        <NumberField
          label="Goal ($)"
          value={goal}
          onChange={setGoal}
          min={10000}
          max={10_000_000}
          step={10000}
        />
        <NumberField
          label="Volatility (%)"
          value={volatility}
          onChange={setVolatility}
          min={5}
          max={40}
        />
      </div>

      <button
        onClick={run}
        disabled={running}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:bg-slate-700"
      >
        {running ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running 10,000 simulations...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Monte Carlo ({(10000).toLocaleString()} trials)
          </>
        )}
      </button>

      {/* Results */}
      {result && chart && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Probability card */}
          <div
            className={`rounded-xl border p-4 ${
              result.successProbability >= 0.75
                ? "border-emerald-500/30 bg-emerald-500/[0.08]"
                : result.successProbability >= 0.5
                ? "border-amber-500/30 bg-amber-500/[0.08]"
                : "border-rose-500/30 bg-rose-500/[0.08]"
            }`}
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Target className="h-3.5 w-3.5" />
              Probability of Success
            </div>
            <div
              className={`mt-1 font-mono text-3xl font-bold ${
                result.successProbability >= 0.75
                  ? "text-emerald-400"
                  : result.successProbability >= 0.5
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {(result.successProbability * 100).toFixed(1)}%
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {(result.successProbability * result.trials).toLocaleString()} of{" "}
              {result.trials.toLocaleString()} simulations reached your goal of $
              {goal.toLocaleString()}.
            </p>
          </div>

          {/* Percentile chart */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Projected Paths · P10 / P50 / P90
            </div>
            <svg
              viewBox={`0 0 ${chart.w} ${chart.h}`}
              className="h-auto w-full"
            >
              {/* Goal line */}
              <line
                x1={chart.pad}
                y1={chart.goalY}
                x2={chart.w - chart.pad}
                y2={chart.goalY}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <text
                x={chart.w - chart.pad}
                y={chart.goalY - 4}
                fill="#f59e0b"
                fontSize={9}
                textAnchor="end"
                fontFamily="monospace"
              >
                Goal · ${(goal / 1000).toFixed(0)}k
              </text>

              <path
                d={chart.p10}
                fill="none"
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                opacity={0.7}
              />
              <path
                d={chart.p90}
                fill="none"
                stroke="#06b6d4"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                opacity={0.7}
              />
              <path d={chart.p50} fill="none" stroke="#10b981" strokeWidth={2.5} />
            </svg>
            <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-rose-500" />
                P10 · ${Math.round(result.paths[endingIndex]?.p10 ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-emerald-500" />
                P50 · ${Math.round(result.paths[endingIndex]?.p50 ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-cyan-500" />
                P90 · ${Math.round(result.paths[endingIndex]?.p90 ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-[10px] leading-relaxed text-slate-500">
        Uses geometric Brownian motion with the given annual return & volatility.
        Each trial simulates {years * 12} monthly steps. Past performance doesn't
        predict future results.
      </p>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-2 py-1.5 font-mono text-xs text-white outline-none focus:border-emerald-500/50"
      />
    </div>
  );
}
