"use client";

import Link from "next/link";
import { ArrowRight, Activity, Database, Server, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { TrendChart } from "@/components/charts/TrendChart";
import { monthlyTrends } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      {/* Precision Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#020617] to-transparent pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative flex items-center justify-between px-6 py-8 max-w-7xl mx-auto z-10">
        <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-500" />
          FinSight.
        </div>
        <div className="flex gap-8 items-center">
          <Link href="/learn" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Learn</Link>
          <Link href="/dashboard" className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all">
            Launch Engine
          </Link>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-32 z-10">
        
        {/* HERO SECTION - Animated */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-[48px] sm:text-[64px] font-semibold tracking-tight text-white leading-[1.1]">
            See where your money actually goes — <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">in seconds.</span>
          </h1>
          <p className="mt-8 text-[16px] sm:text-[18px] leading-8 text-slate-400 max-w-2xl mx-auto">
            Stop guessing. FinSight connects directly to your flow of capital, offering institutional-grade analytics, AI-driven anomaly detection, and real-time wealth trajectory modeling.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-full bg-emerald-500 px-8 py-4 text-[16px] font-semibold text-slate-950 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:bg-emerald-400 hover:scale-105 transition-all duration-300"
            >
              Open Live Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview - Lift on Hover */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-24 mx-auto max-w-5xl relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">
            <div className="h-10 bg-slate-950/80 border-b border-slate-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
            <div className="p-10 bg-slate-900/50 backdrop-blur-sm">
              <TrendChart data={monthlyTrends} />
            </div>
          </div>
        </motion.div>

        {/* Credibility Architecture Layer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 border-t border-slate-800/50 pt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-[14px] font-semibold uppercase tracking-widest text-slate-500">System Architecture</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-60">
            <div className="flex items-center gap-3 text-slate-300"><Cpu className="h-6 w-6 text-emerald-500" /> <span className="font-medium">Next.js App Router</span></div>
            <div className="flex items-center gap-3 text-slate-300"><Server className="h-6 w-6 text-emerald-500" /> <span className="font-medium">Vercel Edge Compute</span></div>
            <div className="flex items-center gap-3 text-slate-300"><Database className="h-6 w-6 text-emerald-500" /> <span className="font-medium">PostgreSQL Relational DB</span></div>
            <div className="flex items-center gap-3 text-slate-300"><Activity className="h-6 w-6 text-emerald-500" /> <span className="font-medium">OpenAI Context Engine</span></div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
