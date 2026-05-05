"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, TrendingUp, Shield, Zap, BarChart3, BookOpen } from "lucide-react";
import { useUser } from "@/lib/user";
import { useFinance } from "@/lib/finance";

const features = [
  {
    icon: Brain,
    title: "AI Insights",
    desc: "Real-time analysis of your spending patterns, savings rate, and portfolio risk — with specific, actionable recommendations.",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    icon: TrendingUp,
    title: "Wealth Forecast",
    desc: "Monte Carlo simulation runs 5,000+ retirement scenarios using your actual numbers to show probability of reaching your goals.",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    icon: BarChart3,
    title: "Portfolio Tracker",
    desc: "Track positions, unrealized P&L, sector exposure, and tax-loss harvesting opportunities in one clean view.",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
  {
    icon: BookOpen,
    title: "Financial Education",
    desc: "Evidence-based articles on index funds, compound interest, asset allocation, and tax strategy — with interactive quizzes.",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
];

export default function HomePage() {
  const { firstName, hasProfile } = useUser();
  const { netWorth, isLoaded } = useFinance();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-8 pb-16 lg:pt-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Financial Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
            {hasProfile && firstName ? (
              <>Welcome back,<br /><span className="text-emerald-400">{firstName}</span>.</>
            ) : (
              <>Your wealth,<br /><span className="text-emerald-400">understood.</span></>
            )}
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
            FinSight analyzes your income, spending, and investments to give you precise, personalized AI recommendations — not generic advice.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-colors"
              >
                {hasProfile ? "Open Dashboard" : "Get Started"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/learn">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:border-slate-600 hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
                Learn
              </button>
            </Link>
          </div>

          {/* Live net worth teaser */}
          {isLoaded && netWorth > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-400">Net worth tracked:</span>
              <span className="text-sm font-bold text-white font-mono">
                ${netWorth.toLocaleString()}
              </span>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="py-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6"
        >
          What FinSight does
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className={`rounded-xl border ${f.border} ${f.bg} p-5`}
              >
                <Icon className={`w-5 h-5 ${f.color} mb-3`} />
                <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-blue-500/5 p-8 text-center"
      >
        <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Ready to take control?</h2>
        <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto">
          Add your first transaction and watch AI insights activate instantly — no account required.
        </p>
        <Link href="/dashboard">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors">
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </motion.section>
    </div>
  );
}
