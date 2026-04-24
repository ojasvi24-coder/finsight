"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  ShieldCheck,
  Lock,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ---------- Mini "live" chart preview (inline SVG, no lib needed) ---------- */
function LiveChartPreview() {
  const basePoints = [18, 22, 19, 26, 24, 31, 28, 35, 33, 40, 38, 46];
  const [points, setPoints] = useState(basePoints);

  // gently animate the last point so it feels live
  useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        const drift = (Math.random() - 0.45) * 2.2;
        next[next.length - 1] = Math.max(30, Math.min(58, last + drift));
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const width = 560;
  const height = 180;
  const padding = 12;
  const max = Math.max(...points) + 4;
  const min = Math.min(...points) - 4;
  const stepX = (width - padding * 2) / (points.length - 1);
  const toY = (v: number) =>
    height - padding - ((v - min) / (max - min)) * (height - padding * 2);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${padding + i * stepX} ${toY(p)}`)
    .join(" ");

  const areaPath =
    `M ${padding} ${height - padding} ` +
    points
      .map((p, i) => `L ${padding + i * stepX} ${toY(p)}`)
      .join(" ") +
    ` L ${padding + (points.length - 1) * stepX} ${height - padding} Z`;

  const lastX = padding + (points.length - 1) * stepX;
  const lastY = toY(points[points.length - 1]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
      {/* chrome / fake header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-[11px] font-medium tracking-wider text-slate-500 uppercase">
            Portfolio · Live
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          +2.14% today
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Net Worth
            </div>
            <div className="font-mono text-3xl font-bold tracking-tight text-white">
              $152,480
              <span className="ml-2 text-sm font-semibold text-emerald-400">
                +$3,210
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            6-month trend
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#heroFill)" />
        <motion.path
          d={path}
          fill="none"
          stroke="#10b981"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        {/* pulse on latest point */}
        <circle cx={lastX} cy={lastY} r={10} fill="#10b981" opacity={0.15}>
          <animate
            attributeName="r"
            values="6;14;6"
            dur="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.25;0;0.25"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={lastX} cy={lastY} r={4} fill="#10b981" stroke="#020617" strokeWidth={2} />
      </svg>

      {/* caption strip */}
      <div className="flex items-center gap-2 border-t border-slate-800/80 px-4 py-2.5 text-[11px] text-slate-500">
        <Sparkles className="h-3.5 w-3.5 text-emerald-400/70" />
        AI projection updated just now — rebalance suggested in 3 days
      </div>
    </div>
  );
}

/* ---------- Home Page ---------- */
export default function HomePage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const trustSignals = [
    {
      icon: Lock,
      title: "256-bit Encryption",
      desc: "Every data transfer protected end-to-end with AES-256.",
    },
    {
      icon: ShieldCheck,
      title: "Bank-level Security",
      desc: "The same infrastructure used by top-tier financial institutions.",
    },
    {
      icon: FileCheck,
      title: "SOC 2 Compliant",
      desc: "Independently audited for data security and privacy.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-50">
      {/* subtle, less-saturated background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_85%_30%,rgba(6,182,212,0.06),transparent_60%)]" />
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-14 lg:grid-cols-2"
        >
          {/* LEFT — headline + CTAs */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                AI Financial Intelligence
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Reduce investment risk by{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                up to 20%
              </span>{" "}
              with AI-driven portfolio analysis.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-xl text-lg leading-relaxed text-slate-400"
            >
              FinSight analyzes your spending, holdings, and goals in real time —
              then tells you exactly what to do next. No dashboards to decode.
              No jargon. Just decisions.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 pt-2 sm:flex-row"
            >
              {/* Primary CTA — only this uses the strong emerald */}
              <Link href="/dashboard">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 50px -10px rgba(16,185,129,0.45)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_-8px_rgba(16,185,129,0.6)] transition-all sm:w-auto"
                >
                  <BarChart3 className="h-5 w-5" />
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>

              {/* Secondary CTA — neutral, not green */}
              <Link href="/learn">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/60 px-7 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-900 sm:w-auto"
                >
                  <BookOpen className="h-5 w-5 text-slate-400" />
                  Browse the Guide
                </motion.button>
              </Link>
            </motion.div>

            {/* micro trust line */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-slate-400"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1 font-semibold text-emerald-300">
                <Lock className="h-3.5 w-3.5" />
                Read-only access — we can never move your money
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <ShieldCheck className="h-4 w-4" />
                Credentials never stored
              </span>
            </motion.div>
          </div>

          {/* RIGHT — live chart preview */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 blur-2xl" />
            <div className="relative">
              <LiveChartPreview />
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">
              A real preview of the experience — not a screenshot.
            </p>
          </motion.div>
        </motion.div>

        {/* ---------- SECURITY FIRST ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-28"
        >
          <div className="mb-10 flex flex-col items-start gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Security first
            </span>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Protecting your financial data is the product.
            </h2>
            <p className="max-w-2xl text-slate-400">
              Before we show you insights, we show you the lock on the door.
              Every layer of FinSight was built to meet the expectations of the
              people whose money is on the line — yours.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {trustSignals.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900/80"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/50 transition-colors group-hover:border-emerald-500/30">
                    <Icon className="h-5 w-5 text-slate-300 transition-colors group-hover:text-emerald-400" />
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold text-white">
                    {t.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {t.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ---------- MINI FEATURE STRIP ---------- */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-sm sm:grid-cols-3"
        >
          <div>
            <div className="font-mono text-3xl font-bold text-white">5,000+</div>
            <p className="mt-1 text-sm text-slate-400">
              Everyday investors simplifying their strategy
            </p>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-white">
              4.8 ★
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Average rating from real users
            </p>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-white">
              &lt; 3 min
            </div>
            <p className="mt-1 text-sm text-slate-400">
              From sign-up to your first insight
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

