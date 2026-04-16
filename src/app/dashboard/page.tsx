"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendChart } from "@/components/charts/TrendChart";
import { 
  Wallet, Activity, Zap, CreditCard, 
  Settings2, Lightbulb, Target, TrendingUp, TrendingDown, Globe, Filter, ExternalLink
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Dashboard() {
  const [income, setIncome] = useState<number>(6000);
  const [expenses, setExpenses] = useState<number>(4200);
  const [currentNetWorth, setCurrentNetWorth] = useState<number>(25000);

  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedSavingsGoal, setSimulatedSavingsGoal] = useState(0);
  const [timeRange, setTimeRange] = useState<"3M" | "6M" | "12M">("6M");

  const [marketData, setMarketData] = useState<any[]>([]);
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);

  // FETCH LIVE DATA WITH REFRESH CAPABILITY
  const fetchLiveMarket = async () => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
      const data = await res.json();
      
      if (!data || !data.bitcoin) throw new Error("API Limit");

      setMarketData([
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
        { id: "ethereum", name: "Ethereum", symbol: "ETH", price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
        { id: "solana", name: "Solana", symbol: "SOL", price: data.solana.usd, change: data.solana.usd_24h_change },
      ]);
    } catch (error) {
      // Fallback if CoinGecko rate-limits us during development
      setMarketData([
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 74813.00, change: 0.32 },
        { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 2359.88, change: 1.12 },
        { id: "solana", name: "Solana", symbol: "SOL", price: 84.97, change: -1.49 },
      ]);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  useEffect(() => {
    fetchLiveMarket();
    const interval = setInterval(fetchLiveMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  const monthlySavings = income - expenses;
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;
  const effectiveMonthlyAdd = monthlySavings + simulatedSavingsGoal;
  
  const projectionData = useMemo(() => {
    const monthsCount = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;
    const months = ["Current"];
    for (let i = 1; i <= monthsCount; i++) {
      months.push(`Month ${i}`);
    }

    let baseBalance = currentNetWorth;
    let optBalance = currentNetWorth;
    
    return months.map((month) => {
      const dataPoint: any = { month, balance: baseBalance };
      if (showSimulator && simulatedSavingsGoal > 0) {
        dataPoint.optimized = optBalance;
      }
      baseBalance += monthlySavings;
      optBalance += effectiveMonthlyAdd;
      return dataPoint;
    });
  }, [currentNetWorth, monthlySavings, effectiveMonthlyAdd, timeRange, showSimulator, simulatedSavingsGoal]);

  const projectionMonths = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;
  const normalProjection = currentNetWorth + (monthlySavings * projectionMonths);
  const simulatedProjection = currentNetWorth + (effectiveMonthlyAdd * projectionMonths);
  const projectionDifference = simulatedProjection - normalProjection;

  const dynamicInsights = useMemo(() => {
    const insights: any[] = [];
    
    if (savingsRate >= 30) {
      insights.push({ id: 1, type: "success", title: "Outstanding Savings Rate 🎯", message: `Your ${savingsRate.toFixed(1)}% savings rate is in the top 5%. You're building incredible wealth.`, metric: `${savingsRate.toFixed(1)}%` });
    } else if (savingsRate >= 20) {
      insights.push({ id: 1, type: "success", title: "Optimal Savings Rate ✓", message: `Excellent work. Your savings rate is ${savingsRate.toFixed(1)}%, hitting the 20% optimal threshold.`, metric: `${savingsRate.toFixed(1)}%` });
    } else if (savingsRate > 0) {
      const neededCut = (income * (20 - savingsRate)) / 100;
      insights.push({ id: 1, type: "warning", title: "Opportunity to Optimize", message: `Cut $${neededCut.toFixed(0)}/mo in discretionary spending to reach the optimal 20% savings tier.`, metric: `${savingsRate.toFixed(1)}%` });
    } else {
      insights.push({ id: 1, type: "danger", title: "Critical Deficit ⚠️", message: `You're losing $${Math.abs(monthlySavings).toLocaleString()} monthly. Immediate budget review required.`, metric: `-${Math.abs(monthlySavings).toLocaleString()}` });
    }

    const expensePct = (expenses / income * 100).toFixed(0);
    if (Number(expensePct) > 75) {
      insights.push({ id: 2, type: "warning", title: "High Expense Ratio", message: `Your expenses consume ${expensePct}% of income. Target is <75%.`, metric: `${expensePct}%` });
    }

    const monthsToMillion = income > expenses ? Math.ceil((1000000 - currentNetWorth) / monthlySavings) : 999;
    if (monthsToMillion > 0 && monthsToMillion < 600) {
      insights.push({ id: 3, type: "info", title: "Wealth Milestone", message: `At this rate, you'll reach $1M in ~${(monthsToMillion / 12).toFixed(1)} years.`, metric: `${(monthsToMillion / 12).toFixed(1)} yrs` });
    }

    return insights;
  }, [savingsRate, monthlySavings, currentNetWorth, income, expenses]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 font-sans pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative px-6 sm:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div className="mx-auto max-w-7xl space-y-8" variants={containerVariants} initial="hidden" animate="visible">
          
          <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800/50 pb-8">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white flex items-center gap-3">
                <Activity className="h-10 w-10 text-emerald-500" />
                FinSight Engine
              </h1>
              <p className="text-base text-slate-400 mt-2">Interactive personal finance modeling with live market data</p>
            </div>
          </motion.header>

          {/* UPGRADED: Clickable Live Real-Time Market Ticker */}
          <motion.div variants={itemVariants} className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar items-center">
            <button 
              onClick={fetchLiveMarket}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all cursor-pointer group"
            >
              <Globe className={`h-4 w-4 ${isLoadingMarket ? 'animate-spin text-emerald-500' : 'text-emerald-500 group-hover:animate-pulse'}`} /> 
              {isLoadingMarket ? "Syncing..." : "Live Market Sync"}
            </button>
            
            {!isLoadingMarket && marketData.map((asset, idx) => (
              <a 
                key={idx} 
                href={`https://coinmarketcap.com/currencies/${asset.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{asset.symbol}</span>
                <span className="text-slate-300">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className={`flex items-center text-xs font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {asset.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(asset.change).toFixed(2)}%
                </span>
                <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-emerald-500 ml-1 transition-colors" />
              </a>
            ))}
          </motion.div>

          {/* Input Control Panel */}
          <motion.div variants={itemVariants} className="rounded-3xl bg-gradient-to-br from-slate-900/60 to-slate-900/30 p-8 sm:p-10 border border-slate-800/50 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-emerald-400">
              <Settings2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold text-white">Financial Parameters</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <InputField label="Monthly Post-Tax Income ($)" value={income} onChange={setIncome} hint="Your take-home pay after taxes" />
              <InputField label="Total Monthly Expenses ($)" value={expenses} onChange={setExpenses} hint="All fixed and variable costs" />
              <InputField label="Current Liquid Net Worth ($)" value={currentNetWorth} onChange={setCurrentNetWorth} hint="Savings, investments, liquid assets" />
            </div>
          </motion.div>

          {/* Top Metric Cards */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
            <MetricCard title="Current Net Worth" value={`$${currentNetWorth.toLocaleString()}`} change={monthlySavings > 0 ? `+$${monthlySavings.toLocaleString()} monthly` : ""} icon={<Wallet />} trend={monthlySavings > 0 ? "up" : "down"} />
            <MetricCard title="Monthly Cash Flow" value={`${monthlySavings >= 0 ? '+' : '−'}$${Math.abs(monthlySavings).toLocaleString()}`} change={`${savingsRate.toFixed(1)}% of income`} icon={<Zap />} trend={monthlySavings > 0 ? "up" : "down"} highlight={monthlySavings > 0} />
            <MetricCard title="Savings Rate" value={`${savingsRate.toFixed(1)}%`} change={savingsRate >= 20 ? "✓ On target" : "⚠️ Below 20%"} icon={<CreditCard />} trend={savingsRate >= 20 ? "up" : "down"} />
          </motion.div>

          {/* Main Grid Layout */}
          <motion.div variants={itemVariants} className="grid gap-8 lg:grid-cols-3">
            
            {/* Main Chart Area */}
            <div className="lg:col-span-2 rounded-3xl bg-slate-900/50 p-8 border border-slate-800/50 backdrop-blur-sm shadow-xl flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500" /> Dynamic Trajectory
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    {showSimulator && simulatedSavingsGoal > 0 ? `Scenario: Additional $${simulatedSavingsGoal}/month saved` : "Trajectory based on current cash flow"}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  {(["3M", "6M", "12M"] as const).map((range) => (
                    <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${timeRange === range ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 min-h-[350px]">
                <TrendChart data={projectionData} />
              </div>

              <motion.div className="mt-8 pt-8 border-t border-slate-800/50" initial={{ opacity: 0, height: 0 }} animate={showSimulator ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}>
                {showSimulator && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-white flex items-center gap-2"><Target className="h-4 w-4 text-emerald-400" /> What if you saved an extra...</label>
                        <span className="text-lg font-bold text-emerald-400">+${simulatedSavingsGoal}/month</span>
                      </div>
                      <input type="range" min="0" max="2000" step="50" value={simulatedSavingsGoal} onChange={(e) => setSimulatedSavingsGoal(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                    </div>

                    {simulatedSavingsGoal > 0 && (
                      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-xs text-slate-400 mb-1">Baseline ({timeRange})</p><p className="text-lg font-bold text-white">${normalProjection.toLocaleString()}</p></div>
                          <div><p className="text-xs text-slate-400 mb-1">Optimized ({timeRange})</p><p className="text-lg font-bold text-emerald-400">${simulatedProjection.toLocaleString()}</p></div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-emerald-500/20"><p className="text-sm text-emerald-300 font-semibold">💡 That's <span className="text-lg text-emerald-400">${projectionDifference.toLocaleString()}</span> more in {timeRange}</p></div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              <button onClick={() => setShowSimulator(!showSimulator)} className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all duration-300 font-medium">
                <Filter className="h-4 w-4" /> {showSimulator ? "Close AI Optimizer" : "Open AI Optimizer"}
              </button>
            </div>

            {/* Right Sidebar: Advanced Insights */}
            <div className="rounded-3xl bg-gradient-to-b from-emerald-900/20 to-slate-900/40 p-8 border border-emerald-500/20 relative overflow-hidden h-fit shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
              <div className="flex items-center gap-3 mb-8">
                <Lightbulb className="h-6 w-6 text-emerald-400" />
                <h2 className="text-2xl font-semibold text-emerald-50">AI Engine</h2>
              </div>
              <div className="space-y-5">
                {dynamicInsights.map((insight, idx) => (
                  <motion.div key={insight.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group rounded-2xl bg-slate-950/60 p-5 border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300 hover:bg-slate-950/80 cursor-default">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-white text-sm leading-snug flex-1">{insight.title}</h3>
                      {insight.metric && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${insight.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : insight.type === 'warning' ? 'bg-amber-500/20 text-amber-300' : insight.type === 'danger' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>{insight.metric}</span>
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

function InputField({ label, value, onChange, hint }: { label: string, value: number, onChange: (val: number) => void, hint?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div><label className="text-sm font-semibold text-slate-200">{label}</label>{hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}</div>
      <input type="number" value={value || ''} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium" />
    </div>
  );
}

function MetricCard({ title, value, change, icon, trend = "neutral", highlight = false }: { title: string, value: string, change?: string, icon: React.ReactNode, trend?: "up" | "down" | "neutral", highlight?: boolean }) {
  let cardStyle = "bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50";
  let textStyle = "text-white";
  let accentStyle = "text-slate-500";
  if (highlight || trend === "up") { cardStyle = "bg-gradient-to-br from-emerald-950/40 to-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]"; accentStyle = "text-emerald-400"; }
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={`rounded-2xl p-7 border backdrop-blur-md transition-all duration-300 ${cardStyle}`}>
      <div className="flex items-center justify-between mb-5"><span className="text-sm font-semibold text-slate-400">{title}</span><div className={`h-6 w-6 ${accentStyle}`}>{icon}</div></div>
      <div><span className={`text-4xl font-bold tracking-tight ${textStyle}`}>{value}</span>{change && <p className="text-xs text-slate-400 mt-2">{change}</p>}</div>
    </motion.div>
  );
}





