"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, TrendingUp, PiggyBank, Shield, ArrowRight,
  Search, Clock, CheckCircle2, BarChart3,
} from "lucide-react";
import { articles } from "@/lib/articles";

const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Budgeting:  { icon: PiggyBank,  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Investing:  { icon: TrendingUp, color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  Wealth:     { icon: BarChart3,  color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
  Strategy:   { icon: Shield,     color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
};

const CATEGORIES = ["All", "Budgeting", "Investing", "Wealth", "Strategy"];

const highlights = [
  { label: "Start here", slug: "50-30-20-framework",   desc: "The simplest budget framework that actually works." },
  { label: "Core concept", slug: "compound-interest",   desc: "Why time beats money every single time." },
  { label: "Key strategy", slug: "index-funds-vs-stocks", desc: "Data proves index funds beat 90% of active managers." },
];

export default function LearnPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery]       = useState("");

  const filtered = articles.filter(a => {
    const matchCat = category === "All" || a.category === category;
    const matchQ   = query === "" ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-10 pb-20">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-400 text-xs font-semibold">
            <BookOpen className="w-3 h-3" /> Financial Education
          </div>
          <Link href="/dashboard">
            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-semibold">
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Learn to build wealth.
        </h1>
        <p className="text-slate-400 text-base max-w-xl leading-relaxed">
          Evidence-based guides on budgeting, investing, and tax strategy. No fluff — just the principles that actually compound wealth.
        </p>
      </motion.div>

      {/* ── Quick Start Highlights ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Recommended reading</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {highlights.map((h, i) => {
            const article = articles.find(a => a.slug === h.slug);
            if (!article) return null;
            return (
              <Link key={h.slug} href={`/learn/${h.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 cursor-pointer hover:border-slate-700 transition-all group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{h.label}</span>
                  <h3 className="text-sm font-bold text-white mt-1 mb-1 group-hover:text-emerald-300 transition-colors">{article.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{h.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />{article.time}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ── Search + Filter ── */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="Search articles…" value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm placeholder-slate-500 outline-none focus:border-slate-700 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                category === cat
                  ? "bg-white text-slate-950 border-white"
                  : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* ── Article grid ── */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No articles match your search.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((article, i) => {
              const meta = categoryMeta[article.category] || categoryMeta.Strategy;
              const Icon = meta.icon;
              return (
                <motion.div key={article.slug} layout
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/learn/${article.slug}`}>
                    <motion.div whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
                      className="h-full rounded-2xl border border-slate-800 bg-slate-900/50 p-5 cursor-pointer group transition-colors hover:border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-lg border ${meta.bg}`}>
                          <Icon className={`w-4 h-4 ${meta.color}`} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>{article.category}</span>
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />{article.time}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors leading-snug">
                        {article.title}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{article.description}</p>

                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors">
                        Read article <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* ── Apply knowledge CTA ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-blue-500/5 p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-bold text-white">Ready to put this into practice?</p>
          </div>
          <p className="text-xs text-slate-400">Your dashboard applies these principles to your actual numbers in real time.</p>
        </div>
        <Link href="/dashboard">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors whitespace-nowrap">
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
