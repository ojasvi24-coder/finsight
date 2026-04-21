"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion"; // <-- Added Variants here
import { BarChart3, BookOpen } from "lucide-react";

export default function HomePage() {
  
  // Explicitly typed as Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Explicitly typed as Variants
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden flex items-center justify-center">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute -top-1/3 -right-1/3 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-purple-500/20 rounded-full blur-[120px]"
          animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 -left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 rounded-full blur-[120px]"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 sm:px-8 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              FinSight
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-light">
              Your AI-Powered Financial Intelligence Platform
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Take control of your wealth with real-time insights, personalized recommendations, and data-driven strategies.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
          >
            {/* Dashboard Button */}
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(6, 182, 212, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-semibold text-lg text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-[0_0_40px_-5px_rgba(6,182,212,0.5)] hover:shadow-[0_0_60px_-5px_rgba(6,182,212,0.7)] transition-all duration-300 flex items-center gap-3"
              >
                <BarChart3 className="w-6 h-6" />
                <span>Dashboard</span>
              </motion.button>
            </Link>

            {/* Learning Hub Button */}
            <Link href="/learn">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(16, 185, 129, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-semibold text-lg text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-5px_rgba(16,185,129,0.7)] transition-all duration-300 flex items-center gap-3"
              >
                <BookOpen className="w-6 h-6" />
                <span>Learning Hub</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 border-t border-slate-800"
          >
            <div className="space-y-2">
              <div className="text-3xl font-bold text-cyan-400">📊</div>
              <p className="text-sm text-slate-300">Real-time Analytics</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">🤖</div>
              <p className="text-sm text-slate-300">AI Insights</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">📚</div>
              <p className="text-sm text-slate-300">Learn & Grow</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
