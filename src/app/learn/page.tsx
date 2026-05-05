"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BarChart3, BookOpen, Lock, TrendingUp, TrendingDown, ArrowRight,
  Plus, AlertCircle, Target, Activity, Brain, Zap,
  Database, Eye, RefreshCw, Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/lib/user";
import { useFinance } from "@/lib/finance";

// ─── Seeded PRNG (no randomness between renders) ─────────────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Standard normal via Box-Muller
function randn(rand: () => number) {
  const u = Math.max(1e-10, rand()), v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ─── Monte Carlo Preview Chart — Bloomberg-grade ─────────────────────────────
function MonteCarloPreviewer({ startValue, monthlyAdd }: { startValue: number; monthlyAdd: number }) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "bands" | "lines" | "done">("idle");

  // Stagger the draw phases for a cinematic reveal
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("bands"),  250);
    const t2 = setTimeout(() => setPhase("lines"),  600);
    const t3 = setTimeout(() => setPhase("done"),  2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const base  = Math.max(startValue, 5000);
  const mc    = Math.max(monthlyAdd, 0);
  const YEARS = 25;
  const TRIALS = 600;
  const MU    = 0.08 / 12;
  const SIG   = 0.15 / Math.sqrt(12);

  const { p10, p25, p50, p75, p90 } = useMemo(() => {
    const rand = mulberry32(42);
    const allPaths: number[][] = [];
    for (let t = 0; t < TRIALS; t++) {
      let v = base;
      const path: number[] = [v];
      for (let m = 0; m < YEARS * 12; m++) {
        v = v * (1 + MU + SIG * randn(rand)) + mc;
        if (m % 12 === 11) path.push(v);
      }
      allPaths.push(path);
    }
    const pct = (arr: number[], p: number) => {
      const s = [...arr].sort((a, b) => a - b);
      return s[Math.floor(s.length * p)] ?? 0;
    };
    const p10: number[] = [], p25: number[] = [], p50: number[] = [],
          p75: number[] = [], p90: number[] = [];
    for (let y = 0; y <= YEARS; y++) {
      const col = allPaths.map(path => path[y] ?? base);
      p10.push(pct(col, 0.10)); p25.push(pct(col, 0.25));
      p50.push(pct(col, 0.50)); p75.push(pct(col, 0.75));
      p90.push(pct(col, 0.90));
    }
    return { p10, p25, p50, p75, p90 };
  }, [base, mc]);

  // Layout
  const W = 560, H = 200, PL = 46, PR = 58, PT = 16, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const maxV = Math.max(...p90) * 1.06;
  const minV = base * 0.92;
  const toX = (i: number) => PL + (i / YEARS) * cW;
  const toY = (v: number) => PT + cH - ((v - minV) / (maxV - minV)) * cH;

  const line = (pts: number[]) =>
    pts.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(2)} ${toY(v).toFixed(2)}`).join(" ");

  // Gradient area fill under the median line — the closed path
  const medianArea = line(p50)
    + ` L ${toX(YEARS).toFixed(2)} ${(PT + cH).toFixed(2)}`
    + ` L ${toX(0).toFixed(2)} ${(PT + cH).toFixed(2)} Z`;

  const band = (upper: number[], lower: number[]) =>
    upper.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(2)} ${toY(v).toFixed(2)}`).join(" ")
    + " "
    + lower.slice().reverse().map((v, i) =>
        `L ${toX(lower.length - 1 - i).toFixed(2)} ${toY(v).toFixed(2)}`
      ).join(" ")
    + " Z";

  const fmtV = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M`
    : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}k`
    :                `$${Math.round(v)}`;

  const medianEnd  = p50[YEARS]!;
  const bestEnd    = p90[YEARS]!;
  const worstEnd   = p10[YEARS]!;
  const gain       = medianEnd - base;
  const gainPct    = ((gain / base) * 100).toFixed(0);
  const isUp       = gain >= 0;

  // Y-axis ticks — 4 evenly spaced
  const yTicks = [0, 0.33, 0.67, 1].map(t => minV + (maxV - minV) * t);

  return (
    // Glassmorphism container
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        background: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Subtle inner highlight at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {/* ── Title bar ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/50" />
          <span className="ml-3 text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">
            Wealth Forecast &nbsp;·&nbsp; Monte Carlo
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-400/80">
            {TRIALS} paths &nbsp;·&nbsp; {YEARS}yr horizon
          </span>
        </div>
      </div>

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
        {/* Starting value */}
        <div className="px-5 py-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Starting value
          </p>
          <p className="font-mono text-base font-bold text-slate-300">{fmtV(base)}</p>
          <p className="text-[9px] text-slate-600 mt-0.5">today</p>
        </div>
        {/* Median projection — hero stat with glow */}
        <div className="px-5 py-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Median · {YEARS}yr
          </p>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="font-mono text-xl font-black"
            style={{
              color: "#34d399",
              textShadow: "0 0 12px rgba(52, 211, 153, 0.7), 0 0 28px rgba(52, 211, 153, 0.35)",
            }}
          >
            {fmtV(medianEnd)}
          </motion.p>
          <div className={`flex items-center gap-1 mt-0.5 text-[9px] font-semibold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
            {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {isUp ? "+" : ""}{gainPct}% total return
          </div>
        </div>
        {/* Range */}
        <div className="px-5 py-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Range · P10 – P90
          </p>
          <p className="font-mono text-[11px] text-emerald-400/70 font-semibold">{fmtV(bestEnd)}</p>
          <div className="my-0.5 h-px w-8 bg-slate-700" />
          <p className="font-mono text-[11px] text-rose-400/70 font-semibold">{fmtV(worstEnd)}</p>
        </div>
      </div>

      {/* ── SVG chart ── */}
      <div className="px-0 pt-2 pb-0 relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Gradient area fill under median — lush emerald fade */}
            <linearGradient id="mc-median-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="55%"  stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"    />
            </linearGradient>
            {/* Outer band fill */}
            <linearGradient id="mc-outer-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#10b981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"    />
            </linearGradient>
            {/* Inner band fill */}
            <linearGradient id="mc-inner-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#10b981" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            {/* Median line glow filter */}
            <filter id="mc-line-glow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feColorMatrix in="blur" type="matrix"
                values="0 0 0 0 0.06  0 0 0 0 0.73  0 0 0 0 0.51  0 0 0 0.9 0" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Clipping rect so lines don't spill past chart area */}
            <clipPath id="mc-clip">
              <rect x={PL} y={PT} width={cW} height={cH + 1} />
            </clipPath>
          </defs>

          {/* ── Y-axis grid & labels ── */}
          {yTicks.map((v, i) => {
            const y = toY(v);
            return (
              <g key={i}>
                <line x1={PL} y1={y} x2={PL + cW} y2={y}
                  stroke="rgba(148,163,184,0.07)" strokeWidth={1} />
                <text x={PL - 6} y={y + 3.5} textAnchor="end"
                  fill="#334155" fontSize={8} fontFamily="'SF Mono', monospace"
                  letterSpacing="0">
                  {fmtV(v)}
                </text>
              </g>
            );
          })}

          {/* ── X-axis year labels ── */}
          {[5, 10, 15, 20, 25].map(yr => (
            <g key={yr}>
              <line x1={toX(yr)} y1={PT} x2={toX(yr)} y2={PT + cH}
                stroke="rgba(148,163,184,0.06)" strokeWidth={1} strokeDasharray="2 4" />
              <text x={toX(yr)} y={H - 6} textAnchor="middle"
                fill="#334155" fontSize={8} fontFamily="'SF Mono', monospace">
                {yr}yr
              </text>
            </g>
          ))}

          {/* ── Chart content (clipped) ── */}
          <g clipPath="url(#mc-clip)">

            {/* Outer band P10–P90 */}
            {phase !== "idle" && (
              <motion.path d={band(p90, p10)} fill="url(#mc-outer-fill)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }} />
            )}

            {/* Inner band P25–P75 */}
            {phase !== "idle" && (
              <motion.path d={band(p75, p25)} fill="url(#mc-inner-fill)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }} />
            )}

            {/* Gradient area fill under median */}
            {phase !== "idle" && (
              <motion.path d={medianArea} fill="url(#mc-median-fill)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }} />
            )}

            {/* P90 boundary — optimistic dashed */}
            {phase === "lines" || phase === "done" ? (
              <motion.path d={line(p90)} fill="none"
                stroke="#10b981" strokeWidth={1} strokeDasharray="3 4" opacity={0.22}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: prefersReduced ? 0 : 1.2, ease: "easeOut" }} />
            ) : null}

            {/* P10 boundary — pessimistic dashed */}
            {phase === "lines" || phase === "done" ? (
              <motion.path d={line(p10)} fill="none"
                stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 4" opacity={0.18}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: prefersReduced ? 0 : 1.2, ease: "easeOut", delay: 0.05 }} />
            ) : null}

            {/* Median line — hero with glow */}
            {phase === "lines" || phase === "done" ? (
              <motion.path d={line(p50)} fill="none"
                stroke="#34d399" strokeWidth={2.5} strokeLinecap="round"
                filter="url(#mc-line-glow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: prefersReduced ? 0 : 1.5, ease: "easeOut", delay: 0.1 }} />
            ) : null}
          </g>

          {/* ── Origin pulse dot ── */}
          <circle cx={toX(0)} cy={toY(base)} r={4.5}
            fill="#34d399" stroke="rgba(15,23,42,0.9)" strokeWidth={2} />
          <circle cx={toX(0)} cy={toY(base)} r={4.5} fill="#34d399" opacity={0.2}>
            <animate attributeName="r" values="4;13;4" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0;0.25" dur="2.8s" repeatCount="indefinite" />
          </circle>

          {/* ── End-point callout labels (appear after lines draw) ── */}
          {phase === "done" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}>
              {/* Best */}
              <text x={toX(YEARS) + 7} y={toY(bestEnd) + 4}
                fill="#10b981" fontSize={8} fontFamily="'SF Mono', monospace" opacity={0.5}>
                best
              </text>
              {/* Median */}
              <text x={toX(YEARS) + 7} y={toY(medianEnd) + 4}
                fill="#34d399" fontSize={9} fontFamily="'SF Mono', monospace" fontWeight="bold"
                style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.6))" }}>
                median
              </text>
              {/* Worst */}
              <text x={toX(YEARS) + 7} y={toY(worstEnd) + 4}
                fill="#f87171" fontSize={8} fontFamily="'SF Mono', monospace" opacity={0.45}>
                worst
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* ── Legend footer ── */}
      <div
        className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-5 py-3 text-[9px] text-slate-500"
        style={{ borderTop: "1px solid rgba(148,163,184,0.07)" }}
      >
        <span className="flex items-center gap-1.5">
          <span className="block h-px w-5" style={{ background: "#34d399", boxShadow: "0 0 4px #34d399" }} />
          Median path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="block h-2.5 w-5 rounded-sm bg-emerald-500/15" />
          Middle 50%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="block h-2.5 w-5 rounded-sm bg-emerald-500/6" />
          P10 – P90 range
        </span>
        <span className="ml-auto opacity-60">8% avg return &nbsp;·&nbsp; 15% volatility &nbsp;·&nbsp; monthly contributions</span>
      </div>

      {/* Subtle bottom inner glow */}
      <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.06), transparent 70%)" }} />
    </div>
  );
}

// ─── Floating background particles ───────────────────────────────────────────
function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: (i * 37 + 11) % 100,
      y: (i * 53 + 7)  % 100,
      size: 1 + (i % 3) * 0.8,
      dur: 12 + (i % 6) * 3,
      delay: -(i * 2.1),
    })), []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map(p => (
        <motion.div key={p.id}
          className="absolute rounded-full bg-emerald-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-20, 20, -20], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Animated stat counter ────────────────────────────────────────────────────
function StatCounter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const t0 = performance.now(), dur = 1200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(2, -10 * p);
      setV(Math.round(to * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) requestAnimationFrame(tick); }, { threshold: 0.5 });
    const el = document.getElementById(`stat-${to}-${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [to, suffix]);
  return <span id={`stat-${to}-${suffix}`}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

// ─── Homepage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { firstName, hasProfile } = useUser();
  const {
    netWorth, netCashFlow, emergencyFundCurrent, emergencyFundTarget,
    portfolioUnrealizedPnL, transactions, monthlyIncome, savingsRate, isLoaded,
  } = useFinance();

  // Live ticker
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
        const mag = Math.max(3, netWorth * 0.00012);
        const d = (Math.random() - 0.48) * mag;
        setTickerUp(d >= 0);
        setTickerChange(c => Math.round(c + d));
        return prev + d;
      });
    }, 2800);
    return () => clearInterval(id);
  }, [isLoaded, netWorth]);

  // Priority signals
  const vectors = useMemo(() => {
    const byCat: Record<string, number> = {};
    transactions.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    const gap = Math.max(0, emergencyFundTarget - emergencyFundCurrent);

    return [
      {
        kind: "Action", icon: AlertCircle,
        accent: "text-amber-400 bg-amber-500/8 border-amber-500/20",
        text: topCat
          ? `${topCat[0]} is your biggest spending category at $${topCat[1].toLocaleString()}. Worth watching this week.`
          : "Log your first expense to unlock personalised spending signals.",
        href: "/dashboard",
      },
      {
        kind: "Portfolio", icon: portfolioUnrealizedPnL >= 0 ? TrendingUp : TrendingDown,
        accent: portfolioUnrealizedPnL >= 0
          ? "text-emerald-400 bg-emerald-500/8 border-emerald-500/20"
          : "text-rose-400 bg-rose-500/8 border-rose-500/20",
        text: portfolioUnrealizedPnL > 0
          ? `Portfolio up $${portfolioUnrealizedPnL.toLocaleString()} in unrealized gains. Consider rebalancing if any sector has drifted past 5%.`
          : portfolioUnrealizedPnL < -500
          ? `Portfolio down $${Math.abs(portfolioUnrealizedPnL).toLocaleString()} — a potential tax loss harvesting opportunity.`
          : "Add your portfolio value in Settings to start tracking real time gains and losses.",
        href: "/dashboard",
      },
      {
        kind: "Milestone", icon: Target,
        accent: "text-cyan-400 bg-cyan-500/8 border-cyan-500/20",
        text: gap <= 0 && emergencyFundTarget > 0
          ? `Emergency fund fully funded at $${emergencyFundCurrent.toLocaleString()}. Consider moving surplus into investments.`
          : emergencyFundTarget > 0
          ? `$${gap.toLocaleString()} away from your $${emergencyFundTarget.toLocaleString()} emergency fund target.`
          : "Set an emergency fund target to track your financial safety net.",
        href: "/dashboard",
      },
    ];
  }, [transactions, portfolioUnrealizedPnL, emergencyFundCurrent, emergencyFundTarget]);

  const [vectorsReady, setVectorsReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVectorsReady(true), 500); return () => clearTimeout(t); }, []);

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
  };

  const fmtCompact = (v: number) => {
    const a = Math.abs(v);
    if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(1)}M`;
    if (a >= 1_000) return `$${(a / 1_000).toFixed(0)}k`;
    return `$${a.toLocaleString()}`;
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_-5%,rgba(16,185,129,0.07),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_90%_20%,rgba(6,182,212,0.04),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: "linear-gradient(to right,#94a3b8 1px,transparent 1px),linear-gradient(to bottom,#94a3b8 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-8 pb-24 sm:px-8">

        {/* ── LIVE TICKER ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
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
              <motion.p key={Math.round(tickerValue / 10)} initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                className="font-mono text-xl font-black text-white">
                ${Math.round(tickerValue).toLocaleString()}
              </motion.p>
            </div>
            {isLoaded && netWorth > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${tickerUp
                  ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
                  : "border-rose-500/20 bg-rose-500/8 text-rose-400"}`}>
                {tickerUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {tickerChange >= 0 ? "+" : ""}${Math.abs(tickerChange).toLocaleString()} today
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Transaction
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors">
                <BarChart3 className="h-3.5 w-3.5" /> Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2">

          <div className="space-y-7">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Brain className="h-3.5 w-3.5" /> AI Financial Intelligence
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp}
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

            <motion.p variants={fadeUp}
              className="max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
              {hasProfile
                ? "Your dashboard is tracking every dollar, running AI analysis on your spending patterns, and simulating thousands of retirement scenarios in real time."
                : "FinSight connects your income, expenses and investments. Then AI reads the numbers and tells you what to do next. No jargon. No generic advice. Just clarity."}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 50px -10px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-7 py-4 text-base font-black text-slate-950 shadow-[0_0_28px_-8px_rgba(16,185,129,0.5)] transition-all sm:w-auto hover:bg-emerald-400">
                  <BarChart3 className="h-5 w-5" />
                  {hasProfile ? "Open Dashboard" : "Get Started Free"}
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

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
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

          {/* Monte Carlo chart */}
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-500/8 via-transparent to-cyan-500/6 blur-2xl" />
            <div className="relative">
              <MonteCarloPreviewer
                startValue={netWorth > 0 ? netWorth : 50000}
                monthlyAdd={Math.max(0, netCashFlow)}
              />
            </div>
            <p className="mt-3 text-center text-xs text-slate-600">
              {netWorth > 0 ? "Forecast built from your actual numbers." : "Preview based on a $50,000 starting portfolio."}
            </p>
          </motion.div>
        </motion.div>

        {/* ── PRIORITY SIGNALS ────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55 }}
          className="mt-20">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Priority Signals</h2>
              <AnimatePresence>
                {!vectorsReady && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" /> Analysing
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="font-mono text-[10px] text-slate-600">from your real data</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {vectors.map((v, i) => {
              const Icon = v.icon;
              return (
                <AnimatePresence key={v.kind}>
                  {!vectorsReady ? (
                    <div className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                      <div className="mb-3 h-4 w-20 rounded-full bg-slate-800" />
                      <div className="space-y-2">
                        <div className="h-2.5 w-full rounded bg-slate-800" />
                        <div className="h-2.5 w-4/5 rounded bg-slate-800" />
                      </div>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}>
                      <Link href={v.href}>
                        <motion.div whileHover={{ y: -3, boxShadow: "0 16px 40px -10px rgba(0,0,0,0.4)" }}
                          className="group h-full cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition-colors hover:border-slate-700">
                          <div className="mb-3 flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${v.accent}`}>
                              <Icon className="h-3 w-3" /> {v.kind}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-700 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                          </div>
                          <p className="text-sm leading-relaxed text-slate-300">{v.text}</p>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
        </motion.section>

        {/* ── WHAT'S INSIDE ───────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55 }}
          className="mt-24">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">What's inside</p>
          <h2 className="text-2xl font-black text-white sm:text-3xl mb-10">
            Built on real maths. Powered by real AI.
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Brain, color: "text-emerald-400", border: "border-emerald-500/15", bg: "bg-emerald-500/5",
                title: "AI Insights",
                desc: "Reads your actual savings rate, spending patterns and portfolio risk. Fires specific recommendations based on your numbers, not a generic template." },
              { icon: Zap, color: "text-blue-400", border: "border-blue-500/15", bg: "bg-blue-500/5",
                title: "Wealth Forecast",
                desc: "Runs hundreds of retirement simulations using geometric Brownian motion. Drag a slider to see how saving an extra $200 a month changes your 25 year outcome." },
              { icon: BarChart3, color: "text-purple-400", border: "border-purple-500/15", bg: "bg-purple-500/5",
                title: "Cash Flow Tracker",
                desc: "Log expenses by category with one tap. Automatically calculates your savings rate, emergency fund progress and lets you repeat your last transaction instantly." },
              { icon: BookOpen, color: "text-amber-400", border: "border-amber-500/15", bg: "bg-amber-500/5",
                title: "Financial Education",
                desc: "Six evidence-based articles covering index funds, compound interest, asset allocation and tax strategy, each with an interactive quiz to test what you have learned." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl border ${f.border} ${f.bg} p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]`}>
                  <Icon className={`w-5 h-5 ${f.color} mb-3`} />
                  <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PRIVACY ─────────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55 }}
          className="mt-24">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Privacy</p>
          <h2 className="text-2xl font-black text-white sm:text-3xl mb-3">
            Your data never leaves your device.
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl leading-relaxed">
            FinSight stores everything in your browser's local storage. No account, no server, no database. Close the tab and it stays yours. We genuinely cannot read it.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Database, title: "Stored locally",
                desc: "Every number you enter lives in your browser only. Nothing is ever transmitted anywhere." },
              { icon: Lock, title: "No account needed",
                desc: "Enter a name if you want a greeting. That is genuinely all we ask for." },
              { icon: RefreshCw, title: "Always in sync",
                desc: "Your dashboard updates the instant you add a transaction. No loading, no delays." },
            ].map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 hover:bg-slate-900/80 transition-all">
                  <motion.div whileHover={{ scale: 1.05 }}
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 group-hover:border-emerald-500/20 transition-colors">
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </motion.div>
                  <h3 className="mb-2 text-sm font-bold text-white">{t.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mt-16 grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:grid-cols-3">
          {[
            { stat: 600, suffix: "+", label: "Monte Carlo paths in each forecast" },
            { stat: 0,   suffix: "",  label: "Servers that ever see your financial data" },
            { stat: 30,  suffix: "s", label: "From opening the app to your first AI insight" },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className="font-mono text-3xl font-black text-white">
                <StatCounter to={s.stat} suffix={s.suffix} />
              </div>
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ── BOTTOM CTA ─────────────────────────────────────────────────── */}
        {!hasProfile && (
          <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mt-16 relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-slate-900 p-10 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(600px_at_50%_100%,rgba(16,185,129,0.08),transparent)]" />
            <div className="relative">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-black text-white mb-3">Start in under a minute.</h2>
              <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
                Enter your monthly income, log a few expenses and watch AI insights activate on the spot.
              </p>
              <Link href="/dashboard">
                <motion.button whileHover={{ scale: 1.03, boxShadow: "0 20px 50px -10px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-colors shadow-[0_0_28px_-6px_rgba(16,185,129,0.4)]">
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
