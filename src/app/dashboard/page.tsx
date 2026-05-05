"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Target,
  Activity,
  ArrowUpRight,
  Zap,
  Brain,
  X,
  RotateCcw,
  Play,
  Loader2,
} from "lucide-react";
import { useFinance } from "@/lib/finance";
import { useUser } from "@/lib/user";
import { monteCarloRetirement } from "@/lib/math";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  v < 0
    ? `-$${Math.abs(v).toLocaleString()}`
    : `$${v.toLocaleString()}`;

const fmtCompact = (v: number) => {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return fmt(v);
};

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({
  value,
  prefix = "$",
  decimals = 0,
  className = "",
}: {
  value: number;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    if (start === end) return;
    const t0 = performance.now();
    const dur = 700;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(2, -10 * p);
      setDisplay(start + (end - start) * ease);
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else prev.current = end;
    };
    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [value]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}{formatted}
    </span>
  );
}

// ─── Donut chart ─────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
  const r = 54;
  const cx = 64;
  const cy = 64;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 128 128" className="w-full max-w-[140px] mx-auto">
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const gap = circ - dash;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={18}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: "64px 64px" }}
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r={42} fill="#0f172a" />
    </svg>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────
function Spark({ data, color = "#10b981" }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const w = 80, h = 28, pad = 2;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const toY = (v: number) => h - pad - ((v - min) / range) * (h - pad * 2);
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${toY(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={pad + (data.length - 1) * step} cy={toY(data[data.length - 1])} r={2.5} fill={color} />
    </svg>
  );
}

// ─── Market Pulse Gauge ───────────────────────────────────────────────────────
function PulseGauge({ value }: { value: number }) {
  const label = value < 30 ? "Fear" : value < 55 ? "Neutral" : value < 75 ? "Greed" : "Extreme Greed";
  const color = value < 30 ? "#f43f5e" : value < 55 ? "#eab308" : value < 75 ? "#10b981" : "#06b6d4";
  const angle = -90 + (value / 100) * 180;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 120 70" className="w-full max-w-[160px]">
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#1e293b" strokeWidth={10} strokeLinecap="round" />
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round" opacity={0.3} />
        <motion.line x1="60" y1="65" x2="60" y2="22" stroke={color} strokeWidth={2.5} strokeLinecap="round"
          animate={{ rotate: angle }} initial={{ rotate: -90 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "60px 65px" }} />
        <circle cx={60} cy={65} r={4} fill={color} />
      </svg>
      <div className="text-center">
        <div className="font-mono text-xl font-bold" style={{ color }}>{Math.round(value)}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

// ─── AI Insight Card ──────────────────────────────────────────────────────────
interface Insight {
  id: number;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  recommendation: string;
  impact: string;
  severity: "high" | "medium" | "low";
}

function InsightCard({ insight, idx }: { insight: Insight; idx: number }) {
  const [open, setOpen] = useState(false);
  const colors = {
    warning: { border: "border-amber-500/30", bg: "bg-amber-500/8", icon: "text-amber-400", badge: "bg-amber-500/15 text-amber-300" },
    success: { border: "border-emerald-500/30", bg: "bg-emerald-500/8", icon: "text-emerald-400", badge: "bg-emerald-500/15 text-emerald-300" },
    info: { border: "border-blue-500/30", bg: "bg-blue-500/8", icon: "text-blue-400", badge: "bg-blue-500/15 text-blue-300" },
  }[insight.type];

  const Icon = insight.type === "warning" ? AlertTriangle : insight.type === "success" ? CheckCircle2 : Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className={`rounded-xl border ${colors.border} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors`}
      >
        <span className={`mt-0.5 flex-shrink-0 ${colors.icon}`}>
          <Icon className="w-4 h-4" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-white text-sm">{insight.title}</p>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${colors.badge}`}>
              {insight.severity}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{insight.message}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform mt-0.5 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 space-y-3 border-t ${colors.border}`}>
              <div className="pt-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-white/5 p-3 mt-0">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Brain className="w-3 h-3" /> AI Recommendation
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.recommendation}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                <span>{insight.impact}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const finance = useFinance();
  const { firstName } = useUser();

  // ── Local state for the add-money form ──
  const [entryType, setEntryType] = useState<"income" | "expense">("expense");
  const [entryName, setEntryName] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryCategory, setEntryCategory] = useState("Food");
  const [adding, setAdding] = useState(false);

  // ── Local state for settings ──
  const [showSettings, setShowSettings] = useState(false);
  const [incomeDraft, setIncomeDraft] = useState("");
  const [returnDraft, setReturnDraft] = useState("");

  // ── Monte Carlo ──
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState<null | {
    successProbability: number;
    medianEnding: number;
    paths: { year: number; p10: number; p50: number; p90: number }[];
  }>(null);
  const [simYears, setSimYears] = useState(20);
  const [simGoal, setSimGoal] = useState(1_000_000);

  // ── Market pulse drift ──
  const [pulse, setPulse] = useState(58);
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(p => Math.max(15, Math.min(92, p + (Math.random() - 0.48) * 3)));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // ── Derived ──
  const {
    netWorth, monthlyIncome, totalExpenses, netCashFlow,
    savingsRate, spendingPercent, transactions, sectors, portfolioValue,
    portfolioUnrealizedPnL, emergencyFundCurrent, emergencyFundTarget,
    annualReturn, projectionYears, initialInvestment,
    isLoaded,
  } = finance;

  const spendByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [transactions]);

  const categoryColors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#f43f5e"];

  const donutSegments = spendByCategory.map(([ label, amt ], i) => ({
    label,
    pct: totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0,
    color: categoryColors[i] || "#475569",
  }));

  const balanceTrend = useMemo(() => {
    const base = initialInvestment || 0;
    return Array.from({ length: 6 }, (_, i) => base + netCashFlow * i);
  }, [initialInvestment, netCashFlow]);

  // ── AI Insights derived from real data ──
  const insights = useMemo((): Insight[] => {
    const list: Insight[] = [];

    if (savingsRate >= 20) {
      list.push({
        id: 1, type: "success", severity: "low",
        title: "Savings Rate On Track",
        message: `You're saving ${savingsRate.toFixed(0)}% of your income — above the 20% benchmark.`,
        recommendation: "Funnel excess savings into a low-cost index fund (VTI or VXUS). At this rate, compound growth will accelerate significantly within 5 years.",
        impact: `Maintaining this adds ~${fmtCompact(netCashFlow * 12)} to your portfolio annually`,
      });
    } else if (monthlyIncome > 0 && savingsRate < 10) {
      list.push({
        id: 1, type: "warning", severity: "high",
        title: "Low Savings Rate",
        message: `Only ${savingsRate.toFixed(0)}% of income is being saved. Target is 20%+.`,
        recommendation: "Review your top 3 expense categories and reduce discretionary spend by 10%. Automate transfers to savings on payday.",
        impact: `Reaching 20% would free ${fmtCompact((monthlyIncome * 0.2 - netCashFlow) || 0)}/month for investing`,
      });
    }

    const emergencyPct = emergencyFundTarget > 0
      ? (emergencyFundCurrent / emergencyFundTarget) * 100
      : 100;
    if (emergencyPct < 70) {
      list.push({
        id: 2, type: "warning", severity: "medium",
        title: "Emergency Fund Gap",
        message: `Your emergency fund covers ${emergencyPct.toFixed(0)}% of your 6-month target.`,
        recommendation: "Prioritize topping up your emergency fund before investing more. Park it in a high-yield savings account earning 4-5% APY.",
        impact: `${fmtCompact(emergencyFundTarget - emergencyFundCurrent)} needed to reach full protection`,
      });
    }

    if (portfolioUnrealizedPnL > 0) {
      list.push({
        id: 3, type: "success", severity: "low",
        title: "Portfolio Gaining",
        message: `Your portfolio is up ${fmtCompact(portfolioUnrealizedPnL)} in unrealized gains.`,
        recommendation: "Consider rebalancing if any sector has drifted more than 5% from your target allocation. Lock in gains by trimming high-risk positions.",
        impact: `Current gain: ${portfolioValue > 0 ? ((portfolioUnrealizedPnL / (portfolioValue - portfolioUnrealizedPnL)) * 100).toFixed(1) : 0}% return on cost`,
      });
    } else if (portfolioUnrealizedPnL < -500) {
      list.push({
        id: 3, type: "info", severity: "medium",
        title: "Tax-Loss Opportunity",
        message: `You have ${fmtCompact(Math.abs(portfolioUnrealizedPnL))} in unrealized losses.`,
        recommendation: "Consider tax-loss harvesting: sell losing positions to offset capital gains, then immediately buy a similar asset. Saves 15-20% in taxes.",
        impact: `Potential tax saving: ${fmtCompact(Math.abs(portfolioUnrealizedPnL) * 0.2)} at 20% cap gains rate`,
      });
    }

    const highRiskSectors = sectors.filter(s => s.risk > 65);
    if (highRiskSectors.length >= 2) {
      list.push({
        id: 4, type: "warning", severity: "medium",
        title: "Concentrated Risk",
        message: `${highRiskSectors.length} sectors show high volatility (risk score > 65).`,
        recommendation: "Shift 10-15% of high-risk sector exposure into bonds or a stable ETF like BND. Diversification reduces drawdown risk without sacrificing much upside.",
        impact: "Reduces portfolio volatility by an estimated 8-12%",
      });
    }

    if (monthlyIncome > 0) {
      list.push({
        id: 5, type: "info", severity: "low",
        title: "Tax-Advantaged Account Check",
        message: "Maximizing 401(k) and Roth IRA before taxable investing can save thousands yearly.",
        recommendation: "Step 1: Get full employer match. Step 2: Max HSA ($4,300/yr triple tax-free). Step 3: Max Roth IRA ($7,000/yr). Step 4: Increase 401(k) to $23,500 limit.",
        impact: "Could reduce your tax bill by $3,000–$8,000+ per year depending on income",
      });
    }

    return list;
  }, [savingsRate, monthlyIncome, emergencyFundCurrent, emergencyFundTarget,
      portfolioUnrealizedPnL, portfolioValue, sectors, netCashFlow]);

  // ── Add entry ──
  const handleAddEntry = () => {
    const amount = parseFloat(entryAmount);
    if (!amount || amount <= 0 || !entryName.trim()) return;
    setAdding(true);
    setTimeout(() => {
      if (entryType === "expense") {
        finance.addTransaction({
          name: entryName.trim(),
          category: entryCategory,
          amount,
          date: new Date().toISOString().split("T")[0],
          type: "expense",
        });
      } else {
        finance.update({ monthlyIncome: finance.monthlyIncome + amount });
      }
      setEntryName("");
      setEntryAmount("");
      setAdding(false);
    }, 300);
  };

  // ── Run Monte Carlo ──
  const runSim = () => {
    setSimRunning(true);
    setTimeout(() => {
      const r = monteCarloRetirement({
        initial: portfolioValue || initialInvestment || 0,
        monthlyContribution: Math.max(0, netCashFlow),
        annualReturn: (annualReturn || 8) / 100,
        annualVolatility: 0.15,
        years: simYears,
        goal: simGoal,
        trials: 5000,
      });
      setSimResult(r);
      setSimRunning(false);
    }, 50);
  };

  // ── Sim chart SVG ──
  const simChart = useMemo(() => {
    if (!simResult) return null;
    const paths = simResult.paths;
    const w = 280, h = 100, pad = 10;
    const all = paths.flatMap(p => [p.p10, p.p50, p.p90]);
    const max = Math.max(...all, simGoal);
    const step = (w - pad * 2) / Math.max(1, paths.length - 1);
    const toY = (v: number) => h - pad - (v / max) * (h - pad * 2);
    const line = (getter: (p: typeof paths[0]) => number) =>
      paths.map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${toY(getter(p))}`).join(" ");
    const goalY = toY(simGoal);
    return { p10: line(p => p.p10), p50: line(p => p.p50), p90: line(p => p.p90), goalY, w, h, pad };
  }, [simResult, simGoal]);

  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <span className="text-sm">Loading your dashboard…</span>
        </div>
      </div>
    );
  }

  const greeting = firstName ? `Hey, ${firstName}` : "Dashboard";
  const isEmptyState = monthlyIncome === 0 && transactions.length === 0;

  return (
    <div className="space-y-6 pb-20">

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-sm text-slate-400 mb-1">{greeting} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <div className="flex items-baseline gap-3">
            <Counter
              value={netWorth}
              className="text-4xl font-black text-white tracking-tight"
            />
            {netCashFlow !== 0 && (
              <span className={`text-sm font-semibold flex items-center gap-1 ${netCashFlow >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {netCashFlow >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {fmtCompact(netCashFlow)}/mo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total net worth</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
        >
          Settings
        </button>
      </motion.div>

      {/* ── Settings panel ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Monthly Income</label>
                <input
                  type="number"
                  placeholder="e.g. 6000"
                  value={incomeDraft}
                  onChange={e => setIncomeDraft(e.target.value)}
                  onBlur={() => {
                    const v = parseFloat(incomeDraft);
                    if (!isNaN(v) && v >= 0) finance.update({ monthlyIncome: v });
                  }}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Expected Return %</label>
                <input
                  type="number"
                  placeholder="e.g. 8"
                  value={returnDraft}
                  onChange={e => setReturnDraft(e.target.value)}
                  onBlur={() => {
                    const v = parseFloat(returnDraft);
                    if (!isNaN(v) && v >= 0 && v <= 30) finance.update({ annualReturn: v });
                  }}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Starting Portfolio ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  defaultValue={initialInvestment || ""}
                  onBlur={e => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= 0) finance.update({ initialInvestment: v });
                  }}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Emergency Fund Target ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 18000"
                  defaultValue={finance.emergencyFundTarget || ""}
                  onBlur={e => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= 0) finance.update({ emergencyFundTarget: v });
                  }}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state prompt ── */}
      {isEmptyState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Start by adding your income and expenses</p>
            <p className="text-xs text-slate-400 mt-0.5">Use the form below to log your first transaction — AI insights will activate automatically.</p>
          </div>
        </motion.div>
      )}

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Monthly Income",
            value: monthlyIncome,
            sub: "gross take-home",
            color: "text-emerald-400",
            icon: TrendingUp,
            spark: balanceTrend,
            sparkColor: "#10b981",
          },
          {
            label: "Monthly Spend",
            value: totalExpenses,
            sub: `${spendingPercent.toFixed(0)}% of income`,
            color: totalExpenses > monthlyIncome * 0.8 ? "text-rose-400" : "text-slate-200",
            icon: TrendingDown,
            spark: [],
            sparkColor: "#f43f5e",
          },
          {
            label: "Net Cash Flow",
            value: netCashFlow,
            sub: `${savingsRate.toFixed(0)}% savings rate`,
            color: netCashFlow >= 0 ? "text-emerald-400" : "text-rose-400",
            icon: Activity,
            spark: [],
            sparkColor: netCashFlow >= 0 ? "#10b981" : "#f43f5e",
          },
          {
            label: "Portfolio Value",
            value: portfolioValue,
            sub: portfolioUnrealizedPnL !== 0 ? `${portfolioUnrealizedPnL >= 0 ? "+" : ""}${fmtCompact(portfolioUnrealizedPnL)} unrealized` : "invested assets",
            color: "text-blue-400",
            icon: Target,
            spark: [],
            sparkColor: "#06b6d4",
          },
        ].map(({ label, value, sub, color, icon: Icon, spark, sparkColor }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-slate-500 font-medium">{label}</p>
              {spark.length > 0 && <Spark data={spark} color={sparkColor} />}
            </div>
            <p className={`text-xl font-bold tracking-tight ${color}`}>{fmtCompact(value)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main 3-col layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Cash Flow Manager */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Transaction
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {/* Type toggle */}
              <div className="flex rounded-lg bg-slate-950/60 p-1 gap-1">
                {(["expense", "income"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setEntryType(t)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      entryType === t
                        ? t === "expense"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {t === "expense" ? "− Expense" : "+ Income"}
                  </button>
                ))}
              </div>

              {/* Name */}
              <input
                placeholder={entryType === "expense" ? "e.g. Grocery Store" : "e.g. Freelance payment"}
                value={entryName}
                onChange={e => setEntryName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-colors"
              />

              {/* Amount */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={entryAmount}
                  onChange={e => setEntryAmount(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddEntry()}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg pl-7 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Category (only for expense) */}
              {entryType === "expense" && (
                <select
                  value={entryCategory}
                  onChange={e => setEntryCategory(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                >
                  {["Food", "Housing", "Transportation", "Entertainment", "Utilities", "Healthcare", "Shopping", "Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}

              <button
                onClick={handleAddEntry}
                disabled={!entryAmount || !entryName.trim() || adding}
                className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-bold transition-all hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add {entryType === "expense" ? "Expense" : "Income"}
              </button>
            </div>
          </div>

          {/* Recent transactions */}
          {transactions.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
                <span className="text-[10px] text-slate-500">{transactions.length} total</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-[280px] overflow-y-auto">
                {[...transactions].reverse().slice(0, 8).map(tx => (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] group transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{tx.name}</p>
                      <p className="text-[10px] text-slate-500">{tx.category}</p>
                    </div>
                    <span className="text-sm font-mono text-rose-400 font-semibold">
                      −${tx.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => finance.deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency fund */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Emergency Fund</h2>
              <span className="text-xs font-mono text-slate-400">
                {emergencyFundTarget > 0 ? `${Math.min(100, (emergencyFundCurrent / emergencyFundTarget * 100)).toFixed(0)}%` : "—"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, emergencyFundTarget > 0 ? (emergencyFundCurrent / emergencyFundTarget * 100) : 0)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${emergencyFundCurrent >= emergencyFundTarget ? "bg-emerald-500" : "bg-amber-500"}`}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{fmtCompact(emergencyFundCurrent)} saved</span>
              <span>Goal: {fmtCompact(emergencyFundTarget)}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => finance.update({ emergencyFundCurrent: Math.max(0, emergencyFundCurrent - 500) })}
                className="flex-1 py-1.5 text-xs border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
              >
                − $500
              </button>
              <button
                onClick={() => finance.update({ emergencyFundCurrent: emergencyFundCurrent + 500 })}
                className="flex-1 py-1.5 text-xs border border-emerald-500/30 bg-emerald-500/10 rounded-lg text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                + $500
              </button>
            </div>
          </div>
        </div>

        {/* CENTER: AI Insights */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <h2 className="text-sm font-semibold text-white">AI Financial Insights</h2>
            </div>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
              {insights.length} active
            </span>
          </div>

          {insights.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Add your income and expenses to unlock AI insights tailored to your financial data.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} idx={i} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Wealth Forecast + Market */}
        <div className="space-y-4">

          {/* Monte Carlo */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Wealth Forecast
              </h2>
              <span className="text-[10px] text-slate-500">Monte Carlo</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Years</label>
                  <input
                    type="number"
                    value={simYears}
                    min={1} max={50}
                    onChange={e => setSimYears(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Goal ($)</label>
                  <input
                    type="number"
                    value={simGoal}
                    step={50000}
                    onChange={e => setSimGoal(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <button
                onClick={runSim}
                disabled={simRunning}
                className="w-full py-2.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {simRunning
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Running 5,000 simulations…</>
                  : <><Play className="w-4 h-4" />Run Simulation</>
                }
              </button>

              {simResult && simChart && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className={`rounded-lg border p-3 text-center ${
                    simResult.successProbability >= 0.75 ? "border-emerald-500/30 bg-emerald-500/8" :
                    simResult.successProbability >= 0.5 ? "border-amber-500/30 bg-amber-500/8" :
                    "border-rose-500/30 bg-rose-500/8"
                  }`}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Success Probability</p>
                    <p className={`text-3xl font-black mt-1 ${
                      simResult.successProbability >= 0.75 ? "text-emerald-400" :
                      simResult.successProbability >= 0.5 ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {(simResult.successProbability * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Median ending: {fmtCompact(simResult.medianEnding)}
                    </p>
                  </div>
                  <svg viewBox={`0 0 ${simChart.w} ${simChart.h}`} className="w-full">
                    <line x1={simChart.pad} y1={simChart.goalY} x2={simChart.w - simChart.pad} y2={simChart.goalY}
                      stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1} />
                    <path d={simChart.p10} fill="none" stroke="#f43f5e" strokeWidth={1.5} opacity={0.6} strokeDasharray="3 3" />
                    <path d={simChart.p90} fill="none" stroke="#06b6d4" strokeWidth={1.5} opacity={0.6} strokeDasharray="3 3" />
                    <path d={simChart.p50} fill="none" stroke="#10b981" strokeWidth={2.5} />
                  </svg>
                  <div className="flex justify-center gap-4 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-400 inline-block" />Worst</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block" />Median</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-400 inline-block" />Best</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Market Pulse */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Market Sentiment
            </h2>
            <PulseGauge value={pulse} />
            <p className="text-center text-[10px] text-slate-500 mt-2">Fear & Greed Index · Live</p>
          </div>
        </div>
      </div>

      {/* ── Bottom: Spending + Asset Mix ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Spending Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            Spending Breakdown
          </h2>
          {spendByCategory.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No transactions yet</div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-36">
                <DonutChart segments={donutSegments} />
                <p className="text-center text-xs text-slate-500 mt-1 font-mono">{fmtCompact(totalExpenses)}</p>
              </div>
              <div className="flex-1 space-y-2">
                {spendByCategory.map(([cat, amt], i) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: categoryColors[i] }} />
                    <span className="text-xs text-slate-400 flex-1 truncate">{cat}</span>
                    <span className="text-xs font-mono font-semibold text-slate-200">{fmtCompact(amt)}</span>
                    <span className="text-[10px] text-slate-500 w-10 text-right">
                      {totalExpenses > 0 ? ((amt / totalExpenses) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Asset Allocation */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            Sector Allocation
          </h2>
          <div className="space-y-2">
            {sectors.slice(0, 6).map(s => {
              const riskColor = s.risk < 35 ? "#10b981" : s.risk < 60 ? "#f59e0b" : "#f43f5e";
              return (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20 truncate">{s.name}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.weight}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: riskColor }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{s.weight}%</span>
                  <span className={`text-[10px] font-mono w-12 text-right ${s.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {s.change >= 0 ? "+" : ""}{s.change.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-4 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Low risk</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Medium</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
