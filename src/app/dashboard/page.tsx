"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  BookOpen,
  Zap,
} from "lucide-react";
import { AIInsights } from '@/components/AiInsights';
import { TrendChart } from "@/components/charts/TrendChart";
import { monthlyTrends, recentTransactions, aiInsights } from "@/lib/mock-data";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate key metrics
  const currentBalance = monthlyTrends[monthlyTrends.length - 1]?.balance || 52400;
  const previousBalance = monthlyTrends[monthlyTrends.length - 2]?.balance || 49000;
  const balanceChange = currentBalance - previousBalance;
  const balanceChangePercent = ((balanceChange / previousBalance) * 100).toFixed(1);

  const totalSpending = monthlyTrends.reduce((sum, month) => sum + month.spending, 0);
  const avgMonthlySpending = (totalSpending / monthlyTrends.length).toFixed(0);

  const savingsRate = (
    ((currentBalance - (monthlyTrends[0]?.balance || 0)) /
      (monthlyTrends[0]?.balance || 1)) *
    100
  ).toFixed(1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 selection:bg-cyan-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-8 sm:py-12 z-10">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-8 w-8 text-cyan-400" />
              </motion.div>
              FinSight Dashboard
            </h1>
            <p className="text-slate-400">Real-time financial insights and growth tracking</p>
          </div>
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <BookOpen className="h-5 w-5" />
              Learning Hub
            </motion.button>
          </Link>
        </motion.header>

        {/* Key Metrics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12"
        >
          {/* Current Balance */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <PiggyBank className="h-5 w-5 text-cyan-400" />
              </div>
              <motion.button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                {showBalance ? (
                  <Eye className="h-5 w-5 text-slate-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-slate-500" />
                )}
              </motion.button>
            </div>
            <p className="text-sm text-slate-400 mb-2">Total Balance</p>
            <p className="text-3xl font-black text-white mb-2">
              {showBalance ? `$${currentBalance.toLocaleString()}` : "••••••"}
            </p>
            <div className="flex items-center gap-2">
              <motion.div
                className="flex items-center gap-1 text-emerald-400 text-sm font-semibold"
              >
                <ArrowUpRight className="h-4 w-4" />
                +${Math.abs(balanceChange).toLocaleString()}
              </motion.div>
              <span className="text-slate-500 text-sm">({balanceChangePercent}%)</span>
            </div>
          </motion.div>

          {/* Monthly Savings */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Avg Monthly Spending</p>
            <p className="text-3xl font-black text-white mb-2">
              ${parseInt(avgMonthlySpending).toLocaleString()}
            </p>
            <p className="text-slate-500 text-sm">
              {((3200 / 5500) * 100).toFixed(0)}% of income
            </p>
          </motion.div>

          {/* Savings Rate */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Savings Rate</p>
            <p className="text-3xl font-black text-white mb-2">24%</p>
            <p className="text-emerald-400 text-sm font-semibold">
              ✓ Above 20% target
            </p>
          </motion.div>

          {/* Investment Growth */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <ArrowUpRight className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Investment Growth</p>
            <p className="text-3xl font-black text-white mb-2">+12% YTD</p>
            <p className="text-slate-500 text-sm">
              $49,000 → $62,000 target
            </p>
          </motion.div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-md mb-12"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Net Worth Trend</h2>
            <p className="text-slate-400">6-month projection and growth tracking</p>
          </div>
          <TrendChart data={monthlyTrends} />
        </motion.div>

        {/* AI Insights Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-md mb-12"
        >
        <AIInsights insights={aiInsights as any} />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="grid gap-8 lg:grid-cols-3 mb-12"
        >
          <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-slate-700/50">
                      {tx.amount > 0 ? (
                        <ArrowDownRight className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{tx.name}</p>
                      <p className="text-sm text-slate-400">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.amount > 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      ${Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-md h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/learn">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors text-white font-semibold group"
                >
                  <span>📚 Learn</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-colors text-white font-semibold group"
              >
                <span>💰 Add Transaction</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors text-white font-semibold group"
              >
                <span>📊 Export Report</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors text-white font-semibold group"
              >
                <span>⚙️ Settings</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="rounded-xl bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 border border-cyan-500/30 p-8 text-center backdrop-blur-md"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Master Your Finances
          </h3>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Explore our comprehensive learning materials to understand wealth-building strategies, investment optimization, and tax planning.
          </p>
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Explore Learning Hub
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight className="h-5 w-5" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}


