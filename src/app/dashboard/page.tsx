"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, TrendingUp, BarChart3, PieChart, Zap, Target, 
  DollarSign, Activity, Wallet, CreditCard, Settings2, 
  Lightbulb, TrendingDown, Globe, Filter, ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area 
} from "recharts";

// --- Types ---
type TimeRange = "3M" | "6M" | "12M";

export default function UnifiedFinancialDashboard() {
  const [isClient, setIsClient] = useState(false);
  
  // Simulation States (Financial Parameters)
  const [income, setIncome] = useState(6000);
  const [expenses, setExpenses] = useState(4200);
  const [initialInvestment, setInitialInvestment] = useState(25000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(30);
  
  // Interactive States
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");
  const [showAIModeler, setShowAIModeler] = useState(false);
  const [simulatedSavingsGoal, setSimulatedSavingsGoal] = useState(0);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchLiveMarket();
    const interval = setInterval(fetchLiveMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Logic: Market Data ---
  const fetchLiveMarket = async () => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
      const data = await res.json();
      setMarketData([
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
        { id: "ethereum", name: "Ethereum", symbol: "ETH", price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
        { id: "solana", name: "Solana", symbol: "SOL", price: data.solana.usd, change: data.solana.usd_24h_change },
      ]);
    } catch (e) {
      setMarketData([
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 74800, change: 0.5 },
        { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 2350, change: 1.2 },
        { id: "solana", name: "Solana", symbol: "SOL", price: 85, change: -0.8 },
      ]);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  // --- Logic: Compound Interest Calculation ---
  const compoundData = useMemo(() => {
    const data = [];
    for (let year = 0; year <= years; year++) {
      const amount = initialInvestment * Math.pow(1 + annualReturn / 100, year);
      data.push({ year, amount: Math.round(amount) });
    }
    return data;
  }, [initialInvestment, annualReturn, years]);

  // --- Logic: Cash Flow Projection ---
  const monthlySavings = income - expenses;
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;
  
  // 1. Define the shape of your data point
interface ProjectionPoint {
  month: string;
  balance: number;
  optimized?: number; // The '?' makes it optional
}

const projectionData = useMemo(() => {
  const monthsCount = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;
  let base = initialInvestment;
  let opt = initialInvestment;

  return Array.from({ length: monthsCount + 1 }).map((_, i): ProjectionPoint => {
    // 2. Initialize the object with the correct type
    const point: ProjectionPoint = { 
      month: i === 0 ? "Now" : `M${i}`, 
      balance: base 
    };

    // 3. Now adding 'optimized' is type-safe
    if (showAIModeler) {
      point.optimized = opt;
    }

    base += monthlySavings;
    opt += (monthlySavings + simulatedSavingsGoal);
    return point;
  });
}, [initialInvestment, monthlySavings, simulatedSavingsGoal, timeRange, showAIModeler]);

  // --- Logic: Insights Engine ---
  const insights = useMemo(() => {
    const list = [];
    if (savingsRate >= 20) list.push({ title: "Healthy Savings Rate", type: "success", msg: "You're hitting the 20% golden rule.", val: `${savingsRate.toFixed(1)}%` });
    else list.push({ title: "Savings Alert", type: "warning", msg: "Try to reduce expenses to hit 20% savings.", val: `${savingsRate.toFixed(1)}%` });
    
    const yearsToMillion = monthlySavings > 0 ? (1000000 - initialInvestment) / (monthlySavings * 12) : Infinity;
    if (yearsToMillion < 50) list.push({ title: "Millionaire Milestone", type: "info", msg: `At current rate, you'll hit $1M in ${yearsToMillion.toFixed(1)} years.`, val: "Target" });
    
    return list;
  }, [savingsRate, monthlySavings, initialInvestment]);

  if (!isClient) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10 z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-3 text-cyan-400 mb-2">
              <Activity className="h-8 w-8" />
              <h1 className="text-4xl font-bold text-white tracking-tight">FinSight Ultra</h1>
            </div>
            <p className="text-slate-400">Integrated Financial Intelligence & Learning Dashboard</p>
          </div>
          <Link href="/learn" className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to Terminal
          </Link>
        </header>

        {/* Live Market Ticker */}
        <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar">
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <Globe className={`h-4 w-4 text-cyan-400 ${isLoadingMarket ? 'animate-spin' : ''}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Markets</span>
          </div>
          {marketData.map((asset) => (
            <div key={asset.id} className="flex-shrink-0 flex items-center gap-4 px-5 py-3 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md hover:border-cyan-500/50 transition-all">
              <span className="font-bold text-white">{asset.symbol}</span>
              <span className="text-slate-300 font-mono">${asset.price.toLocaleString()}</span>
              <span className={`text-xs font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {asset.change >= 0 ? '▲' : '▼'} {Math.abs(asset.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <MetricCard title="Total Liquidity" value={`$${initialInvestment.toLocaleString()}`} icon={<Wallet />} color="cyan" />
          <MetricCard title="Monthly Net" value={`$${monthlySavings.toLocaleString()}`} icon={<Zap />} color="emerald" sub={`${savingsRate.toFixed(0)}% rate`} />
          <MetricCard title="Projected Gain" value={`$${(compoundData[years]?.amount - initialInvestment).toLocaleString()}`} icon={<TrendingUp />} color="purple" sub={`${years}y at ${annualReturn}%`} />
          <MetricCard title="Study Streak" value="24 Days" icon={<Target />} color="amber" sub="Top 5% Learner" />
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Main Simulation Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Compound Interest Section */}
            <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-cyan-400" /> Wealth Projection</h2>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                   {(["3M", "6M", "12M"] as TimeRange[]).map(r => (
                     <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeRange === r ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'}`}>{r}</button>
                   ))}
                </div>
              </div>

              <div className="h-[300px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                    <YAxis stroke="#475569" fontSize={12} tickFormatter={v => `$${v/1000}k`} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                    <Area type="monotone" dataKey="balance" stroke="#06b6d4" fillOpacity={1} fill="url(#colorBal)" strokeWidth={3} />
                    {showAIModeler && <Area type="monotone" dataKey="optimized" stroke="#10b981" fill="transparent" strokeDasharray="5 5" />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Simulation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                <div className="space-y-6">
                  <Slider label="Initial Capital" val={initialInvestment} sym="$" min={1000} max={500000} step={5000} onChange={setInitialInvestment} />
                  <Slider label="Est. Annual Return" val={annualReturn} sym="%" min={1} max={15} step={0.5} onChange={setAnnualReturn} />
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total After {years} Years</p>
                     <p className="text-3xl font-mono font-bold text-cyan-400">${compoundData[years]?.amount.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => setShowAIModeler(!showAIModeler)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <Filter className="h-4 w-4" /> {showAIModeler ? "Hide AI Scenarios" : "Simulate Budget Changes"}
                  </button>
                </div>
              </div>
            </section>

            {/* AI Optimizer (Expandable) */}
            <AnimatePresence>
              {showAIModeler && (
                <motion.section 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl overflow-hidden"
                >
                  <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2"><Target /> Cash Flow Optimization</h3>
                  <div className="grid md:grid-cols-2 gap-10">
                    <Slider label="Additional Monthly Savings" val={simulatedSavingsGoal} sym="$" min={0} max={5000} step={100} onChange={setSimulatedSavingsGoal} />
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-1 bg-emerald-500 rounded-full" />
                      <p className="text-sm text-slate-300">
                        Saving an extra <span className="text-emerald-400 font-bold">${simulatedSavingsGoal}</span> per month increases your net worth by 
                        <span className="text-white font-bold"> ${(simulatedSavingsGoal * (timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12)).toLocaleString()}</span> over this period.
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Learning Path */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><PieChart className="text-purple-400" /> Learning Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CourseCard title="Asset Allocation" progress={75} color="cyan" icon={<PieChart />} />
                <CourseCard title="Tax Optimization" progress={30} color="orange" icon={<DollarSign />} />
                <CourseCard title="Wealth Compounding" progress={90} color="emerald" icon={<TrendingUp />} />
                <CourseCard title="Market Trends" progress={45} color="purple" icon={<Activity />} />
              </div>
            </section>
          </div>

          {/* Column 3: Sidebar */}
          <aside className="space-y-8">
            {/* Parameters Sidebar */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Settings2 className="h-4 w-4" /> Parameters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Monthly Income</label>
                  <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Monthly Expenses</label>
                  <input type="number" value={expenses} onChange={e => setExpenses(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" />
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb className="h-12 w-12" /></div>
              <h3 className="text-lg font-bold mb-6 text-cyan-400">AI Intelligence</h3>
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-white">{insight.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${insight.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{insight.val}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{insight.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function MetricCard({ title, value, icon, color, sub }: any) {
  const colors: any = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  return (
    <div className={`p-6 rounded-3xl border backdrop-blur-md transition-all hover:scale-105 ${colors[color]}`}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">{title}</span>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {sub && <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">{sub}</p>}
    </div>
  );
}

function Slider({ label, val, sym, min, max, step, onChange }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{sym === '$' ? `$${val.toLocaleString()}` : `${val}${sym}`}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={val} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  );
}

function CourseCard({ title, progress, color, icon }: any) {
  const bgColors: any = { cyan: "bg-cyan-500", orange: "bg-orange-500", emerald: "bg-emerald-500", purple: "bg-purple-500" };
  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-slate-800 text-white group-hover:scale-110 transition-transform`}>{icon}</div>
        <div>
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase">{progress}% Complete</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
          className={`h-full ${bgColors[color]}`} 
        />
      </div>
    </div>
  );
}



