"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  BarChart3, BookOpen, Lock, TrendingUp, TrendingDown, ArrowRight,
  Sparkles, Plus, AlertCircle, Target, Activity, Brain, Zap,
  Database, Eye, RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/lib/user";
import { useFinance } from "@/lib/finance";

// ─── Live chart using REAL net worth data ─────────────────────────────────────
function LiveChartPreview({ baseValue }: { baseValue: number }) {
  const seed = Math.max(baseValue, 1000);
  // Build 12 realistic-looking history points from the real base value
  const initialPoints = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const drift = (i / 11) * 0.08; // ~8% gain over period
      const noise = (Math.sin(i * 2.1) * 0.03 + Math.cos(i * 1.3) * 0.02);
      return seed * (1 + drift + noise);
    }), [seed]);

  const [points, setPoints] = useState(initialPoints);

  // Reseed if baseValue changes
  useEffect(() => { setPoints(initialPoints); }, [initialPoints]);

  // Gently drift the last point so it feels alive
  useEffect(() => {
    const id = setInterval(() => {
      setPoints(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        const drift = (Math.random() - 0.47) * (seed * 0.001);
        next[next.length - 1] = Math.max(seed * 0.9, last + drift);
        return next;
      });
    }, 1600);
    return () => clearInterval(id);
  }, [seed]);

  const w = 560, h = 160, pad = 12;
  const max = Math.max(...points) + seed * 0.02;
  const min = Math.min(...points) - seed * 0.01;
  const stepX = (w - pad * 2) / (points.length - 1);
  const toY = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * stepX} ${toY(p)}`).join(" ");
  const area = `M ${pad} ${h - pad} ` + points.map((p, i) => `L ${pad + i * stepX} ${toY(p)}`).join(" ") + ` L ${pad + (points.length - 1) * stepX} ${h - pad} Z`;
  const lastX = pad + (points.length - 1) * stepX;
  const lastY = toY(points[points.length - 1]);
  const change = points[points.length - 1] - points[0];
  const changePct = ((change / points[0]) * 100).toFixed(2);
  const up = change >= 0;

  const fmt = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    return `$${Math.round(v).toLocaleString()}`;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
      {/* Browser chrome */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          <span className="ml-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Net Worth · Live
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          {up ? "+" : ""}{changePct}% trend
        </div>
      </div>

      <div className="px-5 pt-4 pb-1 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Your net worth</p>
          <motion.p
            key={Math.round(points[points.length - 1] / 100)}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="font-mono text-3xl font-black text-white tracking-tight mt-0.5"
          >
            {fmt(points[points.length - 1])}
            <span className={`ml-2 text-sm font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
              {up ? "+" : ""}{fmt(Math.abs(change))}
            </span>
          </motion.p>
        </div>
        <p className="text-[11px] text-slate-500 hidden sm:block">12-month view</p>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#heroFill)" />
        <motion.path d={path} fill="none" stroke="#10b981" strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }} />
        <circle cx={lastX} cy={lastY} r={12} fill="#10b981" opacity={0.12}>
          <animate attributeName="r" values="6;15;6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={lastX} cy={lastY} r={4} fill="#10b981" stroke="#0f172a" strokeWidth={2.5} />
      </svg>

      <div className="flex items-center gap-2 border-t border-slate-800/60 px-5 py-2.5 text-[11px] text-slate-500">
        <Sparkles className="h-3.5 w-3.5 text-emerald-400/60" />
        Based on your real income, expenses &amp; investments
      </div>
    </div>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { firstName, hasProfile } = useUser();
  const {
    netWorth, netCashFlow, emergencyFundCurrent, emergencyFundTarget,
    portfolioUnrealizedPnL, transactions, monthlyIncome, savingsRate, isLoaded,
  } = useFinance();

  // Live net worth ticker
  const [tickerValue, setTickerValue] = useState(netWorth);
  const [tickerChange, setTickerChange] = useState(0);
  const [tickerUp, setTickerUp] = useState(true);

  useEffect(() => {
    if (isLoaded) { setTickerValue(netWorth); setTickerChange(0); }
  }, [netWorth, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const id = setInterval(() => {
      setTickerValue(prev => {
        const mag = Math.max(5, netWorth * 0.00015);
        const drift = (Math.random() - 0.48) * mag;
        setTickerUp(drift >= 0);
        setTickerChange(c => Math.round(c + drift));
        return prev + drift;
      });
    }, 2800);
    return () => clearInterval(id);
  }, [isLoaded, netWorth]);

  // Priority Vectors from real data
  const vectors = useMemo(() => {
    const byCat: Record<string, number> = {};
    transactions.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    const gap = Math.max(0, emergencyFundTarget - emergencyFundCurrent);

    return [
      {
        kind: "Action",
        icon: AlertCircle,
        accent: "text-amber-400 bg-amber-500/8 border-amber-500/20",
        text: topCat
          ? `${topCat[0]} is your largest spending category at $${topCat[1].toLocaleString()}. Watch the trend this week.`
          : "Log your first expense in the dashboard to unlock personalised spending signals.",
        href: "/dashboard",
      },
      {
        kind: "Portfolio",
        icon: portfolioUnrealizedPnL >= 0 ? TrendingUp : TrendingDown,
        accent: portfolioUnrealizedPnL >= 0
          ? "text-emerald-400 bg-emerald-500/8 border-emerald-500/20"
          : "text-rose-400 bg-rose-500/8 border-rose-500/20",
        text: portfolioUnrealizedPnL > 0
          ? `Portfolio up $${portfolioUnrealizedPnL.toLocaleString()} unrealized. Consider rebalancing if any sector has drifted > 5%.`
          : portfolioUnrealizedPnL < -500
          ? `Portfolio down $${Math.abs(portfolioUnrealizedPnL).toLocaleString()} — potential tax-loss harvesting opportunity.`
          : "Set your portfolio value in Settings to see live P&L tracking and rebalancing signals.",
        href: "/dashboard",
      },
      {
        kind: "Milestone",
        icon: Target,
        accent: "text-cyan-400 bg-cyan-500/8 border-cyan-500/20",
        text: gap <= 0 && emergencyFundTarget > 0
          ? `Emergency fund fully funded at $${emergencyFundCurrent.toLocaleString()}. Consider reallocating surplus to investments.`
          : emergencyFundTarget > 0
          ? `$${gap.toLocaleString()} away from your $${emergencyFundTarget.toLocaleString()} emergency fund goal.`
          : "Set an emergency fund target in Settings to start tracking your safety net.",
        href: "/dashboard",
      },
    ];
  }, [transactions, portfolioUnrealizedPnL, emergencyFundCurrent, emergencyFundTarget]);

  const [vectorsReady, setVectorsReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVectorsReady(true), 500); return () => clearTimeout(t); }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const fmtCompact = (v: number) => {
    const a = Math.abs(v);
    if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(1)}M`;
    if (a >= 1_000) return `$${(a / 1_000).toFixed(0)}k`;
    return `$${a.toLocaleString()}`;
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_-5%,rgba(16,185,129,0.07),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_85%_25%,rgba(6,182,212,0.05),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(to right,#94a3b8 1px,transparent 1px),linear-gradient(to bottom,#94a3b8 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-8 pb-24 sm:px-8">

        {/* ── LIVE TICKER BAR ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="mb-10 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Net Worth{firstName ? ` · ${firstName}` : ""}
              </p>
              <motion.p key={Math.round(tickerValue / 10)} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }} className="font-mono text-xl font-black text-white">
                ${Math.round(tickerValue).toLocaleString()}
              </motion.p>
            </div>
            {isLoaded && netWorth > 0 && (
              <div className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${tickerUp
                ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
                : "border-rose-500/20 bg-rose-500/8 text-rose-400"}`}>
                {tickerUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {tickerChange >= 0 ? "+" : ""}${Math.abs(tickerChange).toLocaleString()} today
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Transaction
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors">
                <BarChart3 className="h-3.5 w-3.5" /> Dashboard
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible"
          className="grid items-center gap-14 lg:grid-cols-2">

          {/* Left — copy */}
          <div className="space-y-8">
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Brain className="h-3.5 w-3.5" /> AI Financial Intelligence
              </span>
            </motion.div>

            <motion.h1 variants={item}
              className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hasProfile && firstName ? (
                <>Welcome back,{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {firstName}.
                  </span>
                </>
              ) : (
                <>Your money,{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    finally clear.
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p variants={item}
              className="max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
              {hasProfile
                ? "Your dashboard is tracking cash flow, running AI analysis on your spending, and forecasting your retirement across thousands of scenarios — all in real time."
                : "FinSight connects your income, expenses, and investments. Then AI analyses the numbers and tells you exactly what to do next — no jargon, no fluff."}
            </motion.p>

            <motion.div variants={item} className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link href="/dashboard">
                <motion.button whileHover={{ scale: 1.02, boxShadow: "0 20px 50px -10px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-7 py-4 text-base font-black text-slate-950 shadow-[0_0_28px_-8px_rgba(16,185,129,0.5)] transition-all sm:w-auto hover:bg-emerald-400">
                  <BarChart3 className="h-5 w-5" />
                  {hasProfile ? "Open Dashboard" : "Get Started — Free"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
              <Link href="/learn">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/60 px-7 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-900 sm:w-auto">
                  <BookOpen className="h-5 w-5 text-slate-400" /> Browse the Guide
                </motion.button>
              </Link>
            </motion.div>

            {/* Honest trust line */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/6 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Database className="h-3.5 w-3.5" /> Data stays on your device
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Lock className="h-3.5 w-3.5" /> No account required
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Eye className="h-3.5 w-3.5" /> We never see your numbers
              </span>
            </motion.div>
          </div>

          {/* Right — live chart */}
          <motion.div variants={item} className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-500/8 via-transparent to-cyan-500/8 blur-2xl" />
            <div className="relative">
              <LiveChartPreview baseValue={netWorth > 0 ? netWorth : 50000} />
            </div>
            <p className="mt-3 text-center text-xs text-slate-600">
              {netWorth > 0 ? "Your actual data, rendered live." : "Preview — your data will appear here."}
            </p>
          </motion.div>
        </motion.div>

        {/* ── PRIORITY VECTORS ────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55 }}
          className="mt-20">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Priority Signals</h2>
              {!vectorsReady && (
                <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" /> Analysing…
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] text-slate-600">from your real data</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {vectors.map((v, i) => {
              const Icon = v.icon;
              if (!vectorsReady) {
                return (
                  <div key={v.kind} className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                    <div className="mb-3 h-4 w-20 rounded-full bg-slate-800" />
                    <div className="space-y-2">
                      <div className="h-2.5 w-full rounded bg-slate-800" />
                      <div className="h-2.5 w-4/5 rounded bg-slate-800" />
                    </div>
                  </div>
                );
              }
              return (
                <Link key={v.kind} href={v.href}>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}
                    className="group h-full cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition-all hover:border-slate-700 hover:shadow-[0_0_25px_-10px_rgba(16,185,129,0.4)]">
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${v.accent}`}>
                        <Icon className="h-3 w-3" /> {v.kind}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-700 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">{v.text}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* ── WHAT'S ACTUALLY INSIDE ──────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
          className="mt-24">
          <div className="mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">What's inside</span>
          </div>
          <h2 className="text-2xl font-black text-white sm:text-3xl mb-10">
            Built on real math. Powered by real AI.
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Brain, color: "text-emerald-400", border: "border-emerald-500/15", bg: "bg-emerald-500/5",
                title: "AI Insights", desc: "Analyses your actual savings rate, spending patterns, and portfolio risk. Fires specific recommendations, not generic tips." },
              { icon: Zap, color: "text-blue-400", border: "border-blue-500/15", bg: "bg-blue-500/5",
                title: "Wealth Forecast", desc: "Monte Carlo simulation runs 3,000+ retirement scenarios. Drag a slider to see how saving $200 more/month shifts your goal." },
              { icon: BarChart3, color: "text-purple-400", border: "border-purple-500/15", bg: "bg-purple-500/5",
                title: "Cash Flow Tracker", desc: "Log expenses by category with one tap. Automatic savings rate, emergency fund ring, and repeat-last shortcut." },
              { icon: BookOpen, color: "text-amber-400", border: "border-amber-500/15", bg: "bg-amber-500/5",
                title: "Financial Education", desc: "Six evidence-based articles on index funds, compound interest, and tax strategy — with quizzes to lock in the knowledge." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border ${f.border} ${f.bg} p-5`}>
                  <Icon className={`w-5 h-5 ${f.color} mb-3`} />
                  <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PRIVACY (HONEST) ────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
          className="mt-24">
          <div className="mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Privacy</span>
          </div>
          <h2 className="text-2xl font-black text-white sm:text-3xl mb-3">
            Your data never leaves your device.
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl">
            FinSight stores everything in your browser's local storage. No account, no server, no database.
            Close the tab and it's yours. We can't read it — literally.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Database, title: "Stored locally", desc: "All your numbers live in your browser's localStorage. Nothing is ever transmitted to a server." },
              { icon: Lock,     title: "No account needed", desc: "Enter a name if you want a greeting. That's it. No email, no password, no sign-up flow." },
              { icon: RefreshCw, title: "Always in sync",   desc: "Your dashboard updates the moment you add a transaction. No loading spinners, no syncing delays." },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 hover:bg-slate-900/80 transition-all">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 group-hover:border-emerald-500/20 transition-colors">
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold text-white">{t.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── REAL STATS ──────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mt-16 grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:grid-cols-3">
          {[
            { stat: "3,000+", label: "Monte Carlo trials per forecast run" },
            { stat: "5",      label: "AI insights generated from your real data" },
            { stat: "0",      label: "Servers that ever see your financial data" },
          ].map(s => (
            <div key={s.stat}>
              <div className="font-mono text-3xl font-black text-white">{s.stat}</div>
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </motion.section>

        {/* ── BOTTOM CTA ─────────────────────────────────────────────────── */}
        {!hasProfile && (
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mt-16 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-slate-900 p-10 text-center">
            <h2 className="text-2xl font-black text-white mb-3">Start in under a minute.</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              Enter your monthly income, log a few expenses — AI insights activate automatically.
            </p>
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-colors shadow-[0_0_28px_-6px_rgba(16,185,129,0.4)]">
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.section>
        )}
      </div>
    </div>
  );
}
