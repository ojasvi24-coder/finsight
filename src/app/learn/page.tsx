"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Brain, TrendingUp, BookOpen,
  Zap, BarChart3, CheckCircle2, DollarSign,
} from "lucide-react";
import { useUser } from "@/lib/user";
import { useFinance } from "@/lib/finance";
import { useRouter } from "next/navigation";

// What the dashboard actually does — tied to real features
const features = [
  {
    icon: Brain,
    title: "AI Insights",
    desc: "Analyses your real income, spend, and savings rate to surface specific recommendations — not generic tips.",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    link: "/dashboard",
  },
  {
    icon: Zap,
    title: "Wealth Forecast",
    desc: "Runs thousands of retirement simulations on your actual numbers. Drag a slider to see how $200/month changes your timeline.",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    link: "/dashboard",
  },
  {
    icon: BarChart3,
    title: "Cash Flow Tracker",
    desc: "Log expenses by category with one tap. Automatic savings-rate calculation and emergency-fund progress tracking.",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    link: "/dashboard",
  },
  {
    icon: BookOpen,
    title: "Financial Education",
    desc: "Six evidence-based articles on budgeting, index funds, compound interest, and tax strategy — with quizzes to test retention.",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    link: "/learn",
  },
];

const proofPoints = [
  "No account or sign-up required",
  "All data stays on your device",
  "AI insights update as you type",
  "Free, forever",
];

export default function HomePage() {
  const { firstName, hasProfile } = useUser();
  const { netWorth, monthlyIncome, savingsRate, isLoaded } = useFinance();
  const router = useRouter();

  const hasDashboardData = isLoaded && (monthlyIncome > 0 || netWorth > 0);

  return (
    <div className="min-h-screen pb-20">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-10 pb-16 lg:pt-16 lg:pb-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="max-w-2xl">

          {/* Live greeting if returning user */}
          {hasProfile && firstName ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Welcome back, {firstName}
            </motion.div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AI-powered · runs in your browser
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-5">
            {hasProfile && firstName ? (
              <>Your finances,<br /><span className="text-emerald-400">understood.</span></>
            ) : (
              <>Know exactly<br /><span className="text-emerald-400">where you stand.</span></>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
            {hasProfile
              ? "Your dashboard tracks cash flow, AI-analyses your spending, and forecasts your retirement across thousands of scenarios."
              : "FinSight connects your income, expenses, and investments — then uses AI to tell you exactly what to do next."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-[0_0_28px_-6px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-colors">
                {hasProfile ? "Open Dashboard" : "Get Started — Free"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/learn">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:border-slate-600 hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" /> Learn
              </button>
            </Link>
          </div>

          {/* Live net worth pill — only if they have data */}
          {hasDashboardData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Link href="/dashboard">
                <div className="mt-5 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-colors cursor-pointer group">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-400">Net worth tracked:</span>
                  <span className="text-sm font-black text-white font-mono">${netWorth.toLocaleString()}</span>
                  {savingsRate > 0 && (
                    <span className="text-xs font-semibold text-emerald-400 border-l border-slate-700 pl-3">
                      {savingsRate.toFixed(0)}% savings rate
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="pb-12">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-5">
          What's inside
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}>
                <Link href={f.link}>
                  <motion.div whileHover={{ y: -2 }}
                    className={`rounded-2xl border ${f.border} ${f.bg} p-5 cursor-pointer group transition-all hover:brightness-110`}>
                    <Icon className={`w-5 h-5 ${f.color} mb-3`} />
                    <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-white/90">{f.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────────────────────── */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="py-6 border-t border-slate-800/60">
        <div className="flex flex-wrap gap-4">
          {proofPoints.map(p => (
            <div key={p} className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/60 flex-shrink-0" />
              {p}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      {!hasProfile && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-slate-900 p-8">
          <DollarSign className="w-8 h-8 text-emerald-400 mb-3" />
          <h2 className="text-xl font-black text-white mb-2">Start in 30 seconds</h2>
          <p className="text-sm text-slate-400 mb-5 max-w-sm">
            Enter your monthly income, log a few expenses, and watch AI insights activate automatically.
          </p>
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.section>
      )}
    </div>
  );
}

