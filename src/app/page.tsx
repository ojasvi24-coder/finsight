"use client";

import Link from "next/link";
import { Activity, BookOpen, TrendingUp, PiggyBank, ArrowLeft, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { articles } from "@/lib/articles"; 

export default function LearnPage() {
  // Bulletproof Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Helper to map categories to specific icons
  const getIcon = (category: string) => {
    switch (category) {
      case "Budgeting": return <PiggyBank className="h-5 w-5" />;
      case "Investing": return <TrendingUp className="h-5 w-5" />;
      case "Strategy": return <BookOpen className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] text-slate-50 selection:bg-emerald-500/30 font-sans overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 sm:px-8 py-8 sm:py-12 z-10">
        
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex items-center justify-between border-b border-slate-800/50 pb-6"
        >
          <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Activity className="h-6 w-6 text-emerald-500" />
            FinSight<span className="text-emerald-500">.ai</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 flex items-center gap-2 transition-colors">
            Launch Engine <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </motion.nav>

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/20 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Knowledge Base</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Financial Intelligence
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Master the mathematics of wealth creation. Read our developer-curated guides on asset allocation, market history, and algorithmic saving.
          </p>
        </motion.header>

        {/* Dynamic Articles Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2"
        >
          {articles.map((article) => (
            <motion.div key={article.slug} variants={itemVariants}>
              <Link href={`/learn/${article.slug}`} className="group block h-full">
                <div className="h-full rounded-3xl bg-slate-900/40 p-8 border border-slate-800/80 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300 relative overflow-hidden">
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>

                  <div className="flex items-center gap-3 text-emerald-400 mb-6">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                      {getIcon(article.category)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{article.category} • {article.time}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {article.description}
                  </p>

                  <div className="mt-8 flex items-center text-sm font-semibold text-emerald-500 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Read Directive <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
