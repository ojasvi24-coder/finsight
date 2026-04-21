"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Home,
  LogOut,
  Menu,
  X,
  TrendingUp,
  PieChart,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { TrendChart } from "@/components/charts/TrendChart";
import { AIInsights } from "@/components/AiInsights";

// Mock data - replace with your own data source
const monthlyTrends = [
  { month: "Jan", balance: 42000, spending: 3100 },
  { month: "Feb", balance: 44500, spending: 2800 },
  { month: "Mar", balance: 43200, spending: 4500 },
  { month: "Apr", balance: 46800, spending: 2900 },
  { month: "May", balance: 49000, spending: 3200 },
  { month: "Jun", balance: 52400, spending: 3000 },
];

const recentTransactions = [
  { id: "tx-1", name: "Apple Store", category: "Electronics", amount: -1299.00, date: "Today", status: "Completed" },
  { id: "tx-2", name: "Stripe Payout", category: "Income", amount: 4250.00, date: "Yesterday", status: "Completed" },
  { id: "tx-3", name: "Whole Foods", category: "Groceries", amount: -142.50, date: "Jun 12", status: "Pending" },
  { id: "tx-4", name: "Equinox Fitness", category: "Health", amount: -250.00, date: "Jun 10", status: "Completed" },
];

const financialHealthMetrics = {
  savingsRate: {
    current: 24,
    target: 20,
    status: "excellent",
    advice: "You're saving above the recommended 20%. Consider allocating excess savings to long-term investments.",
  },
  debtToIncomeRatio: {
    current: 12,
    target: 36,
    status: "excellent",
    advice: "Your debt-to-income ratio is healthy. You could safely take on a mortgage or other large loan if needed.",
  },
  housingRatio: {
    current: 45,
    target: 30,
    status: "fair",
    advice: "Bay Area averages are 50%. You're performing well. Keep this ratio below 50% for optimal flexibility.",
  },
  investmentDiversity: {
    current: "70% Stocks, 20% Bonds, 10% Cash",
    status: "good",
    advice: "Well-balanced portfolio for your age. Adjust allocation 10% more conservative every 5 years as you approach retirement.",
  },
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-screen bg-slate-900/95 border-r border-slate-800 backdrop-blur-lg z-40 transition-all ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            >
              FinSight
            </motion.h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <NavLink
            href="/dashboard"
            icon={<Home className="w-5 h-5" />}
            label="Dashboard"
            open={sidebarOpen}
            active
          />
          <NavLink
            href="/learn"
            icon={<BookOpen className="w-5 h-5" />}
            label="Learning Hub"
            open={sidebarOpen}
          />
          <NavLink
            href="/"
            icon={<LogOut className="w-5 h-5" />}
            label="Exit"
            open={sidebarOpen}
          />
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`transition-all ${sidebarOpen ? "ml-64" : "ml-20"} relative z-10`}
      >
        {/* Top Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 backdrop-blur-lg border-b border-slate-800/50 bg-slate-950/80 z-20"
        >
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back! Here's your financial overview.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Last updated</p>
              <p className="text-lg font-semibold text-cyan-400">Today</p>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Key Metrics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Current Balance",
                  value: "$52,400",
                  change: "+$2,400",
                  icon: BarChart3,
                  color: "cyan",
                },
                {
                  label: "Monthly Savings",
                  value: "$3,200",
                  change: "+12% this month",
                  icon: TrendingUp,
                  color: "emerald",
                },
                {
                  label: "Investment Portfolio",
                  value: "$49,000",
                  change: "+$1,200 YTD",
                  icon: PieChart,
                  color: "purple",
                },
                {
                  label: "Savings Rate",
                  value: "24%",
                  change: "Above 20% goal",
                  icon: CheckCircle,
                  color: "emerald",
                },
              ].map((metric, idx) => (
                <MetricCard key={idx} {...metric} />
              ))}
            </motion.div>

            {/* Trend Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-lg rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Net Worth Trend</h2>
              <TrendChart data={monthlyTrends} />
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Transactions List */}
              <div className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                  <Link
                    href="/transactions"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentTransactions.map((tx, idx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white">{tx.name}</p>
                        <p className="text-xs text-slate-400">{tx.category}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            tx.amount > 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">{tx.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Financial Health */}
              <div className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Financial Health</h2>
                <div className="space-y-4">
                  {Object.entries(financialHealthMetrics).map(([key, metric], idx) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 bg-slate-800/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-white capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </p>
                        <span
                          className={`text-sm font-bold px-2 py-1 rounded ${
                            metric.status === "excellent"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : metric.status === "good"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {metric.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{metric.advice}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div variants={itemVariants}>
              <AIInsights />
            </motion.div>

            {/* Call to Action */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-3">Ready to Learn More?</h3>
              <p className="text-slate-400 mb-6">
                Explore our comprehensive learning hub to master wealth-building strategies.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Explore Learning Hub
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 bg-slate-950/80 px-8 py-6 text-center text-slate-400">
          <p>© 2024 FinSight. Your AI-Powered Financial Intelligence Platform.</p>
        </footer>
      </main>
    </div>
  );
}

// Navigation Link Component
function NavLink({
  href,
  icon,
  label,
  open,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: 4 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          active
            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
            : "text-slate-400 hover:bg-slate-800/50"
        }`}
      >
        {icon}
        {open && <span className="font-semibold">{label}</span>}
      </motion.div>
    </Link>
  );
}

// Metric Card Component
function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className: string }>;
  color: string;
}) {
  const colorMap: { [key: string]: string } = {
    cyan: "text-cyan-400 bg-cyan-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    purple: "text-purple-400 bg-purple-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-lg rounded-xl p-6 hover:border-slate-700 transition-colors"
    >
      <div className={`w-12 h-12 rounded-lg ${colorMap[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <p className="text-xs text-emerald-400">{change}</p>
    </motion.div>
  );
}
