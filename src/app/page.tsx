"use client";

import { useState, useMemo } from "react";
import { TrendChart } from "@/components/charts/TrendChart";
import { 
  ArrowUpRight, ArrowDownRight, Wallet, Activity, Zap, CreditCard, 
  Settings2, Lightbulb, Target, TrendingUp
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Dashboard() {
  // 1. React State for User Inputs
  const [income, setIncome] = useState<number>(6000);
  const [expenses, setExpenses] = useState<number>(4200);
  const [currentNetWorth, setCurrentNetWorth] = useState<number>(25000);

  // 2. What-If Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedSavingsGoal, setSimulatedSavingsGoal] = useState(0);

  // 3. Financial Engine Calculations
  const monthlySavings = income - expenses;
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;

  // 4. Calculate with simulator
  const effectiveMonthlyAdd = monthlySavings + simulatedSavingsGoal;
  
  // 5. Generate 6-Month Projection Data for the Chart
  const projectionData = useMemo(() => {
    const months = ["Current", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
    let runningBalance = currentNetWorth;
    
    return months.map((month) => {
      const dataPoint = { month, balance: runningBalance };
      runningBalance += effectiveMonthlyAdd;
      return dataPoint;
    });
  }, [currentNetWorth, effectiveMonthlyAdd]);

  // 6. Calculate impact of simulator
  const normalProjection = currentNetWorth + (monthlySavings * 6);
  const simulatedProjection = currentNetWorth + (effectiveMonthlyAdd * 6);
  const projectionDifference = simulatedProjection - normalProjection;

  // 7. Advanced Insights with Specific Numbers
  const dynamicInsights = useMemo(() => {
    const insights: any[] = [];
    
    // Insight 1: Savings Rate Analysis
    if (savingsRate >= 30) {
      insights.push({
        id: 1,
        type: "success",
        title: "Outstanding Savings Rate 🎯",
        message: `Your ${savingsRate.toFixed(1)}% savings rate is in the top 5%. You're on track to $${(currentNetWorth + (monthlySavings * 12)).toLocaleString()} by next year.`,
        metric: `${savingsRate.toFixed(1)}%`
      });
    } else if (savingsRate >= 20) {
      insights.push({
        id: 1,
        type: "success",
        title: "Optimal Savings Rate ✓",
        message: `Excellent work. Your savings rate is ${savingsRate.toFixed(1)}%, hitting the 20% optimal threshold. You're building wealth systematically.`,
        metric: `${savingsRate.toFixed(1)}%`
      });
    } else if (savingsRate > 0) {
      const deficit = 20 - savingsRate;
      const neededCut = (income * deficit) / 100;
      insights.push({
        id: 1,
        type: "warning",
        title: "Opportunity to Optimize",
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Cut just $${neededCut.toFixed(0)}/month in discretionary spending to reach 20%.`,
        metric: `${savingsRate.toFixed(1)}%`
      });
    } else {
      insights.push({
        id: 1,
        type: "danger",
        title: "Critical: Spending Exceeds Income ⚠️",
        message: `You're losing $${Math.abs(monthlySavings).toLocaleString()} monthly. Budget review required immediately.`,
        metric: `${monthlySavings < 0 ? '−' : ''}$${Math.abs(monthlySavings).toLocaleString()}`
      });
    }

    // Insight 2: Spending Category Analysis
    const expensePct = (expenses / income * 100).toFixed(0);
    if (Number(expensePct) > 75) {
      insights.push({
        id: 2,
        type: "warning",
        title: "High Expense Ratio",
        message: `Your expenses are ${expensePct}% of income. Benchmark is 70-80%. Consider reviewing subscriptions and discretionary purchases.`,
        metric: `${expensePct}%`
      });
    } else {
      insights.push({
        id: 2,
        type: "success",
        title: "Healthy Expense Ratio",
        message: `Your expenses are ${expensePct}% of income. Well-balanced budget structure.`,
        metric: `${expensePct}%`
      });
    }

    // Insight 3: Projection Timeline
    const monthsToMillion = income > expenses 
      ? Math.ceil((1000000 - currentNetWorth) / monthlySavings)
      : 999;
    
    const yearsToMillion = (monthsToMillion / 12).toFixed(1);
    
    if (monthsToMillion > 0 && monthsToMillion < 600) {
      insights.push({
        id: 3,
        type: "info",
        title: "Wealth Milestone Timeline",
        message: `At your current savings rate, you'll reach $1M in ~${yearsToMillion} years (${monthsToMillion} months). This assumes 0% investment returns.`,
        metric: `${yearsToMillion} yrs`
      });
    }

    return insights;
  }, [savingsRate, monthlySavings, currentNetWorth, income, expenses]);

  // THE FIX: Properly typed Variants without the problematic ease string
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 font-sans">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative px-6 sm:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div 
          className="mx-auto max-w-7xl space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Header */}
          <motion.header 
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800/50 pb-8"
          >
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white flex items-center gap-3">
                <Activity className="h-10 w-10 text-emerald-500" />
                FinSight Engine
              </h1>
              <p className="text-base text-slate-400 mt-2">Interactive personal finance modeling with AI insights</p>
            </div>
          </motion.header>

          {/* Input Control Panel */}
          <motion.div 
            variants={itemVariants}
            className="rounded-3xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 p-8 sm:p-10 border border-slate-800/50 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8 text-emerald-400">
              <Settings2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold text-white">Financial Parameters</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <InputField 
                label="Monthly Post-Tax Income ($)" 
                value={income} 
                onChange={setIncome}
                hint="Your take-home pay after taxes"
              />
              <InputField 
                label="Total Monthly Expenses ($)" 
                value={expenses} 
                onChange={setExpenses}
                hint="All fixed and variable costs"
              />
              <InputField 
                label="Current Liquid Net Worth ($)" 
                value={currentNetWorth} 
                onChange={setCurrentNetWorth}
                hint="Savings, investments, liquid assets"
              />
            </div>
          </motion.div>

          {/* Top Metric Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid gap-6 md:grid-cols-3"
          >
            <MetricCard 
              title="Current Net Worth" 
              value={`$${currentNetWorth.toLocaleString()}`}
              change={monthlySavings > 0 ? `+$${monthlySavings.toLocaleString()} monthly` : ""}
              icon={<Wallet />}
              trend={monthlySavings > 0 ? "up" : "down"}
            />
            <MetricCard 
              title="Monthly Cash Flow" 
              value={`${monthlySavings >= 0 ? '+' : '−'}$${Math.abs(monthlySavings).toLocaleString()}`}
              change={`${savingsRate.toFixed(1)}% of income`}
              icon={<Zap />}
              trend={monthlySavings > 0 ? "up" : "down"}
              highlight={monthlySavings > 0}
            />
            <MetricCard 
              title="Savings Rate" 
              value={`${savingsRate.toFixed(1)}%`}
              change={savingsRate >= 20 ? "✓ On target" : "⚠️ Below 20%"}
              icon={<CreditCard />}
              trend={savingsRate >= 20 ? "up" : "down"}
            />
          </motion.div>

          {/* Main Grid Layout */}
          <motion.div 
            variants={itemVariants}
            className="grid gap-8 lg:grid-cols-3"
          >
            
            {/* Main Chart Area */}
            <div className="lg:col-span-2 rounded-3xl bg-slate-900/50 p-8 border border-slate-800/50 backdrop-blur-sm shadow-xl">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">6-Month Wealth Projection</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    {showSimulator && simulatedSavingsGoal > 0 
                      ? `Scenario: Additional $${simulatedSavingsGoal}/month saved`
                      : "Trajectory based on current cash flow"
                    }
                  </p>
                </div>
              </div>
              <TrendChart data={projectionData} />

              {/* What-If Simulator Toggle */}
              <motion.div 
                className="mt-8 pt-8 border-t border-slate-800/50"
                initial={{ opacity: 0, height: 0 }}
                animate={showSimulator ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
              >
                {showSimulator && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-white flex items-center gap-2">
                          <Target className="h-4 w-4 text-emerald-400" />
                          What if you saved an extra...
                        </label>
                        <span className="text-lg font-bold text-emerald-400">+${simulatedSavingsGoal}/month</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={simulatedSavingsGoal}
                        onChange={(e) => setSimulatedSavingsGoal(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>$0</span>
                        <span>$2,000</span>
                      </div>
                    </div>

                    {simulatedSavingsGoal > 0 && (
                      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Normal Projection (6mo)</p>
                            <p className="text-lg font-bold text-white">${normalProjection.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">With Extra Savings (6mo)</p>
                            <p className="text-lg font-bold text-emerald-400">${simulatedProjection.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-emerald-500/20">
                          <p className="text-sm text-emerald-300 font-semibold">
                            💡 That's <span className="text-lg text-emerald-400">${projectionDifference.toLocaleString()}</span> more in 6 months
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Toggle Button */}
              <button
                onClick={() => setShowSimulator(!showSimulator)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all duration-300 font-medium"
              >
                <TrendingUp className="h-4 w-4" />
                {showSimulator ? "Hide" : "Show"} What-If Scenario
              </button>
            </div>

            {/* Right Sidebar: Advanced Insights */}
            <div className="rounded-3xl bg-gradient-to-b from-emerald-900/20 to-slate-900/40 p-8 border border-emerald-500/20 relative overflow-hidden h-fit shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <Lightbulb className="h-6 w-6 text-emerald-400" />
                <h2 className="text-2xl font-semibold text-emerald-50">AI Insights</h2>
              </div>
              
              <div className="space-y-5">
                {dynamicInsights.map((insight, idx) => (
                  <motion.div 
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group rounded-2xl bg-slate-950/60 p-5 border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300 hover:bg-slate-950/80 cursor-default"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-white text-sm leading-snug flex-1">{insight.title}</h3>
                      {insight.metric && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${
                          insight.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                          insight.type === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                          insight.type === 'danger' ? 'bg-red-500/20 text-red-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {insight.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">{insight.message}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced Input Component
function InputField({ 
  label, 
  value, 
  onChange,
  hint
}: { 
  label: string
  value: number
  onChange: (val: number) => void
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-sm font-semibold text-slate-200">{label}</label>
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </div>
      <input 
        type="number" 
        value={value || ''} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
      />
    </div>
  );
}

// Enhanced Metric Card
function MetricCard({ 
  title, 
  value, 
  change,
  icon, 
  trend = "neutral",
  highlight = false
}: { 
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  highlight?: boolean
}) {
  let cardStyle = "bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50";
  let textStyle = "text-white";
  let accentStyle = "text-slate-500";

  if (highlight || trend === "up") {
    cardStyle = "bg-gradient-to-br from-emerald-950/40 to-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]";
    accentStyle = "text-emerald-400";
  }

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl p-7 border backdrop-blur-md transition-all duration-300 ${cardStyle}`}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold text-slate-400">{title}</span>
        <div className={`h-6 w-6 ${accentStyle}`}>{icon}</div>
      </div>
      <div>
        <span className={`text-4xl font-bold tracking-tight ${textStyle}`}>{value}</span>
        {change && (
          <p className="text-xs text-slate-400 mt-2">{change}</p>
        )}
      </div>
    </motion.div>
  );
}

