"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, TrendingUp, TrendingDown, Plus, AlertTriangle, CheckCircle2,
  Info, ChevronDown, DollarSign, Target, Activity, Zap, X, Loader2,
  UtensilsCrossed, Home, Car, Tv, Bolt, Heart, ShoppingBag, Package,
  RotateCcw, ArrowRight, Sparkles, BarChart3, ToggleLeft, ToggleRight,
} from "lucide-react";
import { useFinance } from "@/lib/finance";
import { useUser } from "@/lib/user";
import { monteCarloRetirement } from "@/lib/math";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtCompact = (v: number) => {
  const a = Math.abs(v), s = v < 0 ? "-" : "";
  if (a >= 1_000_000) return `${s}$${(a / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000) return `${s}$${(a / 1_000).toFixed(0)}k`;
  return `${s}$${a.toLocaleString()}`;
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value, className = "" }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const frame = useRef<number | null>(null);
  useEffect(() => {
    const start = prev.current, end = value;
    if (start === end) return;
    const t0 = performance.now(), dur = 900;
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
  return <span className={className}>${Math.round(display).toLocaleString()}</span>;
}

// ─── Ring chart ───────────────────────────────────────────────────────────────
function RingChart({ pct, size = 72, color = "#10b981" }: { pct: number; size?: number; color?: string }) {
  const r = (size - 12) / 2, circ = 2 * Math.PI * r;
  const dash = Math.min(1, pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={10} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.2, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}

// ─── Category config ──────────────────────────────────────────────────────────
const CATS = [
  { name: "Food",          icon: UtensilsCrossed, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/25" },
  { name: "Housing",       icon: Home,            color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/25" },
  { name: "Transport",     icon: Car,             color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/25" },
  { name: "Entertainment", icon: Tv,              color: "text-pink-400",   bg: "bg-pink-500/10 border-pink-500/25" },
  { name: "Utilities",     icon: Bolt,            color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/25" },
  { name: "Healthcare",    icon: Heart,           color: "text-rose-400",   bg: "bg-rose-500/10 border-rose-500/25" },
  { name: "Shopping",      icon: ShoppingBag,     color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/25" },
  { name: "Other",         icon: Package,         color: "text-slate-400",  bg: "bg-slate-700/30 border-slate-700" },
];
const CAT_COLORS = ["#10b981","#06b6d4","#8b5cf6","#f59e0b","#f43f5e"];

function getMarketTip(v: number) {
  if (v < 25) return "Extreme fear — historically a buying opportunity for patient investors.";
  if (v < 45) return "Fear detected — consider dollar-cost averaging into positions.";
  if (v < 55) return "Neutral sentiment — stay the course with your current strategy.";
  if (v < 75) return "Greed building — stick to your DCA plan, avoid chasing momentum.";
  return "Extreme greed — markets overheated, consider rebalancing your portfolio now.";
}

// ─── AI Insight card ──────────────────────────────────────────────────────────
interface Insight {
  id: number; type: "warning" | "success" | "info";
  title: string; message: string; recommendation: string;
  impact: string; severity: "high" | "medium" | "low";
}
function InsightCard({ insight, idx }: { insight: Insight; idx: number }) {
  const [open, setOpen] = useState(false);
  const c = {
    warning: { border: "border-amber-500/25",   icon: "text-amber-400",   badge: "bg-amber-500/15 text-amber-300" },
    success: { border: "border-emerald-500/25",  icon: "text-emerald-400", badge: "bg-emerald-500/15 text-emerald-300" },
    info:    { border: "border-blue-500/25",     icon: "text-blue-400",    badge: "bg-blue-500/15 text-blue-300" },
  }[insight.type];
  const Icon = insight.type === "warning" ? AlertTriangle : insight.type === "success" ? CheckCircle2 : Info;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`rounded-xl border ${c.border} overflow-hidden bg-slate-900/40`}>
      <button onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="font-semibold text-white text-sm">{insight.title}</p>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${c.badge}`}>
              {insight.severity}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{insight.message}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className={`px-4 pb-4 border-t ${c.border} space-y-3`}>
              <div className="pt-3 bg-gradient-to-r from-emerald-500/8 to-blue-500/8 border border-white/5 rounded-xl p-3">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Brain className="w-3 h-3" /> AI Recommendation
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.recommendation}</p>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <DollarSign className="w-3 h-3 text-emerald-400 flex-shrink-0" />{insight.impact}
              </p>
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

  const [entryType, setEntryType] = useState<"expense" | "income">("expense");
  const [entryName, setEntryName] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryCat, setEntryCat] = useState("Food");
  const [adding, setAdding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Forecast
  const [simYears, setSimYears] = useState(20);
  const [simGoal, setSimGoal] = useState(1_000_000);
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState<null | { successProbability: number; medianEnding: number; paths: {year:number;p10:number;p50:number;p90:number}[] }>(null);
  const [whatIfOn, setWhatIfOn] = useState(false);
  const [extraMonthly, setExtraMonthly] = useState(200);
  const [whatIfResult, setWhatIfResult] = useState<null | { successProbability: number; medianEnding: number }>(null);

  // Market pulse
  const [pulse, setPulse] = useState(62);
  useEffect(() => {
    const id = setInterval(() => setPulse(p => Math.max(15, Math.min(92, p + (Math.random() - 0.48) * 2.5))), 4000);
    return () => clearInterval(id);
  }, []);

  const {
    netWorth, monthlyIncome, totalExpenses, netCashFlow, savingsRate,
    spendingPercent, transactions, portfolioValue, portfolioUnrealizedPnL,
    emergencyFundCurrent, emergencyFundTarget, annualReturn, initialInvestment, isLoaded,
  } = finance;

  const lastTx = transactions.length > 0 ? [...transactions].reverse()[0] : null;

  const spendByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [transactions]);

  const insights = useMemo((): Insight[] => {
    const list: Insight[] = [];
    if (monthlyIncome > 0) {
      if (savingsRate >= 20) {
        list.push({ id: 1, type: "success", severity: "low",
          title: "Savings Rate On Track",
          message: `Saving ${savingsRate.toFixed(0)}% of income — beating the 20% benchmark.`,
          recommendation: "Funnel the excess into a low-cost index fund (VTI). At this rate, compound growth accelerates significantly in year 5.",
          impact: `Maintaining this adds ~${fmtCompact(netCashFlow * 12)} to your portfolio annually`,
        });
      } else if (savingsRate < 10) {
        list.push({ id: 1, type: "warning", severity: "high",
          title: "Low Savings Rate",
          message: `Only ${savingsRate.toFixed(0)}% of income saved. Target: 20%+.`,
          recommendation: "Review your top 2 expense categories and cut 15% each. Automate a savings transfer on payday before discretionary spending starts.",
          impact: `Reaching 20% would free ${fmtCompact(monthlyIncome * 0.2 - Math.max(0, netCashFlow))}/month for investing`,
        });
      }
    }
    const ePct = emergencyFundTarget > 0 ? (emergencyFundCurrent / emergencyFundTarget) * 100 : 100;
    if (ePct < 70 && emergencyFundTarget > 0) {
      list.push({ id: 2, type: "warning", severity: "medium",
        title: "Emergency Fund Gap",
        message: `Fund covers ${ePct.toFixed(0)}% of your 6-month target.`,
        recommendation: "Park funds in a high-yield savings account (4–5% APY). Even $200/month reaches the goal in under a year.",
        impact: `${fmtCompact(emergencyFundTarget - emergencyFundCurrent)} needed to reach full 6-month cushion`,
      });
    }
    if (portfolioUnrealizedPnL > 500) {
      list.push({ id: 3, type: "success", severity: "low",
        title: "Portfolio Gaining",
        message: `Up ${fmtCompact(portfolioUnrealizedPnL)} in unrealized gains.`,
        recommendation: "Rebalance if any position has drifted more than 5% from your target allocation. Trim gains tax-efficiently inside a Roth IRA.",
        impact: `${portfolioValue > 0 ? ((portfolioUnrealizedPnL / (portfolioValue - portfolioUnrealizedPnL)) * 100).toFixed(1) : 0}% return on cost basis`,
      });
    } else if (portfolioUnrealizedPnL < -500) {
      list.push({ id: 3, type: "info", severity: "medium",
        title: "Tax-Loss Opportunity",
        message: `${fmtCompact(Math.abs(portfolioUnrealizedPnL))} in unrealized losses.`,
        recommendation: "Sell losing positions to harvest the loss, buy a similar asset immediately to stay invested. Saves 15–20% in capital gains taxes.",
        impact: `Potential tax saving: ${fmtCompact(Math.abs(portfolioUnrealizedPnL) * 0.2)}`,
      });
    }
    list.push({ id: 5, type: "info", severity: "low",
      title: "Tax-Advantaged Accounts",
      message: "Maximising 401(k) and Roth IRA beats taxable investing every time.",
      recommendation: "Priority: (1) Capture full employer 401k match, (2) Max HSA $4,300/yr triple tax-free, (3) Max Roth IRA $7,000/yr, (4) Max 401k $23,500.",
      impact: "Reduces your tax bill by $3,000–$8,000+ per year depending on income bracket",
    });
    return list;
  }, [savingsRate, monthlyIncome, emergencyFundCurrent, emergencyFundTarget, portfolioUnrealizedPnL, portfolioValue, netCashFlow]);

  const handleAdd = () => {
    const amount = parseFloat(entryAmount);
    if (!amount || amount <= 0 || !entryName.trim()) return;
    setAdding(true);
    setTimeout(() => {
      if (entryType === "expense") {
        finance.addTransaction({ name: entryName.trim(), category: entryCat, amount, date: new Date().toISOString().split("T")[0], type: "expense" });
      } else {
        finance.update({ monthlyIncome: finance.monthlyIncome + amount });
      }
      setEntryName(""); setEntryAmount(""); setAdding(false);
    }, 250);
  };

  const runSim = (withExtra = false) => {
    const base = Math.max(portfolioValue, initialInvestment, 0);
    const mc = Math.max(0, netCashFlow) + (withExtra ? extraMonthly : 0);
    return monteCarloRetirement({
      initial: base, monthlyContribution: mc,
      annualReturn: (annualReturn || 8) / 100, annualVolatility: 0.15,
      years: simYears, goal: simGoal, trials: 3000,
    });
  };

  const handleRunSim = () => {
    setSimRunning(true);
    setTimeout(() => {
      setSimResult(runSim(false));
      if (whatIfOn) setWhatIfResult(runSim(true));
      setSimRunning(false);
    }, 40);
  };

  useEffect(() => {
    if (simResult && whatIfOn) {
      const r = runSim(true);
      setWhatIfResult(r);
    }
    if (!whatIfOn) setWhatIfResult(null);
  }, [whatIfOn, extraMonthly, simResult]);

  // Sim chart
  const simChart = useMemo(() => {
    if (!simResult) return null;
    const { paths } = simResult;
    const w = 280, h = 90, pad = 8;
    const max = Math.max(...paths.flatMap(p => [p.p10, p.p50, p.p90]), simGoal);
    const step = (w - pad * 2) / Math.max(1, paths.length - 1);
    const toY = (v: number) => h - pad - (v / max) * (h - pad * 2);
    const line = (get: (p: typeof paths[0]) => number) =>
      paths.map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${toY(get(p))}`).join(" ");
    return { p10: line(p => p.p10), p50: line(p => p.p50), p90: line(p => p.p90), goalY: toY(simGoal), w, h };
  }, [simResult, simGoal]);

  // Preview chart (before running)
  const previewChart = useMemo(() => {
    const w = 280, h = 70, pad = 8;
    const base = Math.max(portfolioValue, initialInvestment, 500);
    const r1 = (annualReturn || 8) / 100 / 12;
    const r2 = (((annualReturn || 8) + 4) / 100) / 12;
    const mc = Math.max(0, netCashFlow);
    const pts1: number[] = [], pts2: number[] = [];
    let v1 = base, v2 = base;
    for (let i = 0; i <= Math.min(simYears, 30); i++) {
      pts1.push(v1); pts2.push(v2);
      for (let m = 0; m < 12; m++) { v1 = v1 * (1 + r1) + mc; v2 = v2 * (1 + r2) + mc; }
    }
    const max = Math.max(...pts2, simGoal, 1);
    const n = pts1.length;
    const step = (w - pad * 2) / Math.max(1, n - 1);
    const toY = (v: number) => h - pad - (v / max) * (h - pad * 2);
    const line = (pts: number[]) => pts.map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${toY(v)}`).join(" ");
    return { p1: line(pts1), p2: line(pts2), goalY: toY(simGoal), w, h };
  }, [simYears, simGoal, portfolioValue, initialInvestment, annualReturn, netCashFlow]);

  const emergencyPct = emergencyFundTarget > 0 ? Math.min(100, (emergencyFundCurrent / emergencyFundTarget) * 100) : 0;
  const pulseColor = pulse < 30 ? "#f43f5e" : pulse < 55 ? "#eab308" : pulse < 75 ? "#10b981" : "#06b6d4";
  const pulseLabel = pulse < 30 ? "Extreme Fear" : pulse < 55 ? "Fear / Neutral" : pulse < 75 ? "Greed" : "Extreme Greed";

  const portfolioSet = portfolioValue > 0 || initialInvestment > 0;

  if (!isLoaded) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
    </div>
  );

  return (
    <div className="space-y-7 pb-24">

      {/* ══ HERO NET WORTH ═══════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-7 lg:p-9">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
            {firstName ? `${firstName}'s` : "Your"} Total Net Worth
          </p>
          <Counter value={netWorth} className="text-5xl sm:text-6xl font-black text-white tracking-tight tabular-nums" />

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {savingsRate > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${savingsRate >= 20
                ? "bg-emerald-500/12 text-emerald-300 border-emerald-500/20"
                : "bg-amber-500/12 text-amber-300 border-amber-500/20"}`}>
                <TrendingUp className="w-3 h-3" />
                {savingsRate.toFixed(0)}% savings rate{savingsRate >= 20 ? " 🎉" : ""}
              </div>
            )}
            {netCashFlow !== 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${netCashFlow >= 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                {netCashFlow >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {fmtCompact(Math.abs(netCashFlow))}/mo net
              </div>
            )}
            <button onClick={() => setShowSettings(!showSettings)}
              className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-800 rounded-lg px-3 py-1 hover:border-slate-700">
              {showSettings ? "Done" : "Settings"}
            </button>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                  {[
                    { label: "Monthly Income ($)", key: "monthlyIncome" as const },
                    { label: "Annual Return (%)", key: "annualReturn" as const },
                    { label: "Portfolio Value ($)", key: "initialInvestment" as const },
                    { label: "Emergency Target ($)", key: "emergencyFundTarget" as const },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">{f.label}</label>
                      <input type="number" defaultValue={finance[f.key] || ""}
                        placeholder="0"
                        onBlur={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 0) finance.update({ [f.key]: v }); }}
                        className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ══ KPI ROW ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Monthly Income", value: monthlyIncome, color: "text-emerald-400", sub: "take-home" },
          { label: "Monthly Spend", value: totalExpenses, color: totalExpenses > monthlyIncome * 0.8 && monthlyIncome > 0 ? "text-rose-400" : "text-white", sub: `${spendingPercent.toFixed(0)}% of income` },
          { label: "Net Cash Flow", value: netCashFlow, color: netCashFlow >= 0 ? "text-emerald-400" : "text-rose-400", sub: "income − expenses" },
        ].map(({ label, value, color, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-[11px] text-slate-500 font-medium mb-1">{label}</p>
            <p className={`text-xl font-bold tracking-tight ${color}`}>{fmtCompact(value)}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ══ MAIN GRID ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── ACTION COLUMN ── */}
        <div className="space-y-5">

          {/* Add Transaction */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-5 pt-5 pb-1">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Add Transaction
              </h2>
              {/* Toggle */}
              <div className="flex rounded-xl bg-slate-950/70 p-1 gap-1 mb-4">
                {(["expense", "income"] as const).map(t => (
                  <button key={t} onClick={() => setEntryType(t)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${entryType === t
                      ? t === "expense"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-500 hover:text-slate-300"}`}>
                    {t === "expense" ? "− Expense" : "+ Income"}
                  </button>
                ))}
              </div>

              {/* Name */}
              <input placeholder={entryType === "expense" ? "e.g. Coffee, Rent, Uber…" : "e.g. Salary, Freelance…"}
                value={entryName} onChange={e => setEntryName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/40 transition-colors mb-3" />

              {/* Amount */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                <input type="number" min="0" placeholder="0"
                  value={entryAmount} onChange={e => setEntryAmount(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/40 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>

              {/* Category icons */}
              {entryType === "expense" && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {CATS.map(cat => {
                    const Icon = cat.icon;
                    const active = entryCat === cat.name;
                    return (
                      <button key={cat.name} onClick={() => setEntryCat(cat.name)}
                        className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${active ? `${cat.bg} ${cat.color}` : "border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] font-semibold leading-none">{cat.name.length > 7 ? cat.name.slice(0, 6) + "…" : cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Primary CTA — full-width prominent */}
              <button onClick={handleAdd}
                disabled={!entryAmount || !entryName.trim() || adding}
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 text-sm font-black tracking-wide transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_-6px_rgba(16,185,129,0.4)] mb-2">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add {entryType === "expense" ? "Expense" : "Income"}
              </button>

              {/* Repeat last — secondary, subtle */}
              {lastTx && entryType === "expense" && (
                <button onClick={() => {
                  finance.addTransaction({ name: lastTx.name, category: lastTx.category, amount: lastTx.amount, date: new Date().toISOString().split("T")[0], type: "expense" });
                }}
                  className="w-full py-2 rounded-xl border border-slate-800 text-slate-500 text-xs font-semibold hover:border-slate-700 hover:text-slate-300 transition-colors flex items-center justify-center gap-2 mb-4">
                  <RotateCcw className="w-3 h-3" /> Repeat: {lastTx.name} · ${lastTx.amount}
                </button>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
                <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">{transactions.length}</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto">
                {[...transactions].reverse().slice(0, 10).map(tx => {
                  const cat = CATS.find(c => c.name === tx.category);
                  const Icon = cat?.icon || Package;
                  return (
                    <div key={tx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] group transition-colors">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${cat?.bg || "border-slate-700 bg-slate-800/40"}`}>
                        <Icon className={`w-3.5 h-3.5 ${cat?.color || "text-slate-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{tx.name}</p>
                        <p className="text-[10px] text-slate-500">{tx.category}</p>
                      </div>
                      <span className="text-sm font-mono font-semibold text-rose-400">−${tx.amount.toLocaleString()}</span>
                      <button onClick={() => finance.deleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-rose-400 transition-all ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {spendByCategory.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2.5">Spend by category</p>
                  <div className="space-y-2">
                    {spendByCategory.map(([cat, amt], i) => (
                      <div key={cat} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: CAT_COLORS[i] }} />
                        <span className="text-xs text-slate-400 flex-1">{cat}</span>
                        <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0}%`, background: CAT_COLORS[i] }} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 w-9 text-right">
                          {totalExpenses > 0 ? ((amt / totalExpenses) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Emergency Fund */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-4">
              <RingChart pct={emergencyPct} size={72}
                color={emergencyPct >= 100 ? "#10b981" : emergencyPct >= 60 ? "#f59e0b" : "#f43f5e"} />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-0.5">Emergency Fund</h3>
                <p className="text-xs text-slate-400 mb-3">
                  {fmtCompact(emergencyFundCurrent)} of {emergencyFundTarget > 0 ? fmtCompact(emergencyFundTarget) : "—"} goal
                </p>
                <div className="flex gap-2">
                  <button onClick={() => finance.update({ emergencyFundCurrent: Math.max(0, emergencyFundCurrent - 500) })}
                    className="flex-1 py-1.5 text-xs border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors">− $500</button>
                  <button onClick={() => finance.update({ emergencyFundCurrent: emergencyFundCurrent + 500 })}
                    className="flex-1 py-1.5 text-xs border border-emerald-500/25 bg-emerald-500/8 rounded-lg text-emerald-300 hover:bg-emerald-500/15 transition-colors">+ $500</button>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio — only shows when set up */}
          {!portfolioSet ? (
            <button onClick={() => setShowSettings(true)}
              className="w-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-5 text-left hover:border-slate-600 hover:bg-slate-900/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800/60 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                  <BarChart3 className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">Set up portfolio</p>
                  <p className="text-xs text-slate-600">Add your starting investment value in settings →</p>
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" /> Portfolio
              </h3>
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 mb-0.5">Value</p>
                  <p className="text-lg font-bold text-blue-400">{fmtCompact(portfolioValue || initialInvestment)}</p>
                </div>
                {portfolioUnrealizedPnL !== 0 && (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-0.5">Unrealized P&L</p>
                    <p className={`text-lg font-bold ${portfolioUnrealizedPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {portfolioUnrealizedPnL >= 0 ? "+" : ""}{fmtCompact(portfolioUnrealizedPnL)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── ANALYSIS COLUMN ── */}
        <div className="space-y-5">

          {/* AI Insights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <Brain className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <h2 className="text-sm font-bold text-white">AI Insights</h2>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/15">
                {insights.length} active
              </span>
            </div>
            {insights.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                <Sparkles className="w-7 h-7 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Add income and expenses to unlock AI insights.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {insights.map((ins, i) => <InsightCard key={ins.id} insight={ins} idx={i} />)}
              </div>
            )}
          </div>

          {/* Market Sentiment */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Market Sentiment
            </h2>
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0" style={{ width: 88, height: 88 }}>
                <svg width={88} height={88} className="-rotate-90">
                  <circle cx={44} cy={44} r={34} fill="none" stroke="#1e293b" strokeWidth={9} />
                  <motion.circle cx={44} cy={44} r={34} fill="none" stroke={pulseColor} strokeWidth={9}
                    strokeLinecap="round"
                    animate={{ strokeDasharray: `${(pulse / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}` }}
                    transition={{ duration: 1, ease: "easeOut" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black" style={{ color: pulseColor }}>{Math.round(pulse)}</span>
                  <span className="text-[9px] text-slate-500">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm mb-1.5" style={{ color: pulseColor }}>{pulseLabel}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{getMarketTip(pulse)}</p>
                <p className="text-[10px] text-slate-600 mt-2">Fear & Greed Index · Live</p>
              </div>
            </div>
          </div>

          {/* Wealth Forecast */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-1">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" /> Wealth Forecast
              </h2>
              <span className="text-[10px] text-slate-500">Monte Carlo</span>
            </div>

            {/* Live preview */}
            <div className="px-5 py-2">
              <svg viewBox={`0 0 ${previewChart.w} ${previewChart.h}`} className="w-full">
                <line x1={8} y1={previewChart.goalY} x2={previewChart.w - 8} y2={previewChart.goalY}
                  stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1} opacity={0.4} />
                <path d={previewChart.p1} fill="none" stroke="#475569" strokeWidth={1.5} opacity={0.35} />
                <path d={previewChart.p2} fill="none" stroke="#10b981" strokeWidth={2} opacity={0.25} />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-700 -mt-0.5">
                <span>Conservative</span><span className="text-amber-700/70">Goal line</span><span>Optimistic</span>
              </div>
            </div>

            <div className="px-5 pb-5 space-y-4">
              {/* Sliders */}
              {[
                { label: "Years", val: simYears, set: (v: number) => { setSimYears(v); setSimResult(null); }, min: 5, max: 50, step: 1, display: `${simYears} yrs` },
                { label: "Goal", val: simGoal, set: (v: number) => { setSimGoal(v); setSimResult(null); }, min: 100_000, max: 5_000_000, step: 50_000, display: fmtCompact(simGoal) },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</label>
                    <span className="text-xs font-bold text-white tabular-nums">{s.display}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                    onChange={e => s.set(Number(e.target.value))}
                    className="w-full h-1.5 appearance-none bg-slate-800 rounded-full outline-none accent-blue-500 cursor-pointer" />
                </div>
              ))}

              {/* What If toggle */}
              <div className={`rounded-xl border transition-all ${whatIfOn ? "border-purple-500/25 bg-purple-500/8" : "border-slate-800"} p-3`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">What If I save more?</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Add extra monthly savings to see the impact</p>
                  </div>
                  <button onClick={() => setWhatIfOn(!whatIfOn)}
                    className={`transition-colors ${whatIfOn ? "text-purple-400" : "text-slate-600 hover:text-slate-400"}`}>
                    {whatIfOn ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>
                <AnimatePresence>
                  {whatIfOn && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-purple-500/15">
                        <div className="flex justify-between mb-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Extra per month</label>
                          <span className="text-xs font-bold text-purple-300">+{fmtCompact(extraMonthly)}/mo</span>
                        </div>
                        <input type="range" min={50} max={2000} step={50} value={extraMonthly}
                          onChange={e => setExtraMonthly(Number(e.target.value))}
                          className="w-full h-1.5 appearance-none bg-slate-800 rounded-full outline-none accent-purple-500 cursor-pointer" />
                        {simResult && whatIfResult && (
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-slate-400">Success probability</span>
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <span className={simResult.successProbability >= 0.75 ? "text-emerald-400" : "text-amber-400"}>
                                {(simResult.successProbability * 100).toFixed(0)}%
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-600" />
                              <span className="text-purple-400">{(whatIfResult.successProbability * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        )}
                        {simResult && whatIfResult && (
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-slate-400">Median outcome</span>
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <span className="text-slate-400">{fmtCompact(simResult.medianEnding)}</span>
                              <ArrowRight className="w-3 h-3 text-slate-600" />
                              <span className="text-purple-400">{fmtCompact(whatIfResult.medianEnding)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={handleRunSim} disabled={simRunning}
                className="w-full py-2.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-300 text-sm font-bold hover:bg-blue-500/15 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {simRunning
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Simulating…</>
                  : <><Activity className="w-4 h-4" />Run Simulation</>}
              </button>

              {simResult && simChart && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className={`rounded-xl border p-3 text-center ${
                    simResult.successProbability >= 0.75 ? "border-emerald-500/20 bg-emerald-500/8"
                      : simResult.successProbability >= 0.5 ? "border-amber-500/20 bg-amber-500/8"
                      : "border-rose-500/20 bg-rose-500/8"}`}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Goal Probability</p>
                    <p className={`text-4xl font-black mt-0.5 ${simResult.successProbability >= 0.75 ? "text-emerald-400" : simResult.successProbability >= 0.5 ? "text-amber-400" : "text-rose-400"}`}>
                      {(simResult.successProbability * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-400">Median: {fmtCompact(simResult.medianEnding)}</p>
                  </div>
                  <svg viewBox={`0 0 ${simChart.w} ${simChart.h}`} className="w-full">
                    <line x1={8} y1={simChart.goalY} x2={simChart.w - 8} y2={simChart.goalY} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1} />
                    <path d={simChart.p10} fill="none" stroke="#f43f5e" strokeWidth={1.5} opacity={0.6} strokeDasharray="3 3" />
                    <path d={simChart.p90} fill="none" stroke="#06b6d4" strokeWidth={1.5} opacity={0.6} strokeDasharray="3 3" />
                    <path d={simChart.p50} fill="none" stroke="#10b981" strokeWidth={2.5} />
                  </svg>
                  <div className="flex justify-center gap-4 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-400 inline-block rounded" />P10 worst</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" />Median</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-400 inline-block rounded" />P90 best</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


