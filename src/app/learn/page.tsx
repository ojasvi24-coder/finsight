"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { ArrowRight, Activity, Database, Server, Cpu, Zap, TrendingUp, Shield, Sparkles, BrainCircuit, TrendingDown, Globe, CreditCard, Bell, BarChart3 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { TrendChart } from "@/components/charts/TrendChart";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [demoGoal, setDemoGoal] = useState<number>(500);
  const [activeTab, setActiveTab] = useState<"trajectory" | "subscriptions">("trajectory");

  // Live Market API
  useEffect(() => {
    const fetchLiveMarket = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        if (!data || !data.bitcoin) throw new Error("API Limit");
        setMarketData([
          { symbol: "BTC", price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
          { symbol: "ETH", price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
          { symbol: "SOL", price: data.solana.usd, change: data.solana.usd_24h_change },
        ]);
      } catch (error) {
        setMarketData([
          { symbol: "BTC", price: 74813.00, change: 0.32 },
          { symbol: "ETH", price: 2359.88, change: 1.12 },
          { symbol: "SOL", price: 84.97, change: -1.49 },
        ]);
      }
    };
    fetchLiveMarket();
  }, []);

  // Interactive Chart Data
  const demoProjectionData = useMemo(() => {
    let baseBalance = 25000;
    let optBalance = 25000;
    const monthlySavings = 1200;
    
    return ["Current", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"].map((month) => {
      const dataPoint = { month, balance: baseBalance, optimized: optBalance };
      baseBalance += monthlySavings;
      optBalance += (monthlySavings + demoGoal);
      return dataPoint;
    });
  }, [demoGoal]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-emerald-500/30 font-sans overflow-hidden relative">
      {/* High-Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="relative flex items-center justify-between px-6 sm:px-8 py-6 max-w-7xl mx-auto z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2.5">
          <Activity className="h-7 w-7 text-emerald-500" />
          <span>FinSight<span className="text-emerald-500">.ai</span></span>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-6 items-center">
          <Link href="/learn" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Intelligence</Link>
          <Link href="/dashboard" className="rounded-full bg-slate-900 border border-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300 transition-all duration-300 shadow-lg">
            Launch Engine
          </Link>
        </motion.div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-6 sm:px-8 pt-20 sm:pt-32 pb-20 z-10">
        
        {/* HERO SECTION */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-5xl text-center mb-32 relative">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-emerald-500/30 mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">FinSight Neural Engine v2.0 Live</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05] mb-8">
            <span className="block">Control your wealth</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">
              with autonomous AI.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg sm:text-xl leading-8 text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            Connect your capital flow. Let our proprietary AI engine detect anomalies, optimize your savings rate, and forecast your exact path to financial freedom.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/dashboard" className="group relative px-8 py-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <span>Deploy Simulator</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.section>

        {/* 📸 PICS: BENTO GRID IMAGE SHOWCASE */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
            {/* Main large image */}
            <div className="md:col-span-2 rounded-3xl overflow-hidden relative group border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" alt="Trading Dashboard" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-8 left-8 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3 backdrop-blur-md">
                  <BarChart3 className="h-3 w-3" /> Data Science Driven
                </div>
                <h3 className="text-2xl font-bold text-white">Institutional Grade Analytics</h3>
              </div>
            </div>
            
            {/* Stacked smaller images */}
            <div className="flex flex-col gap-6 h-full">
              <div className="flex-1 rounded-3xl overflow-hidden relative group border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10"></div>
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Data Code" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-lg font-bold text-white">Machine Learning</h3>
                </div>
              </div>
              <div className="flex-1 rounded-3xl overflow-hidden relative group border border-slate-800">
                <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src="https://images.unsplash.com/photo-1639762681485-074b7f4ec051?q=80&w=2070&auto=format&fit=crop" alt="Crypto Future" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full">
                  <Shield className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <h3 className="text-lg font-bold text-white">AES-256 Secured</h3>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 🎮 LIVE DEMOS: INTERACTIVE PREVIEW */}
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="mb-32 mx-auto max-w-6xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-emerald-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              
              {/* Interactive Demo Tabs */}
              <div className="flex gap-2">
                <button onClick={() => setActiveTab("trajectory")} className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "trajectory" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white"}`}>Wealth Simulator</button>
                <button onClick={() => setActiveTab("subscriptions")} className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "subscriptions" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white"}`}>AI Subscription Scan</button>
              </div>
            </div>

            <div className="p-8 sm:p-12 min-h-[500px]">
              {/* LIVE TICKER */}
              <div className="flex gap-4 overflow-x-auto pb-6 mb-4 hide-scrollbar">
                <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
                  <Globe className="h-3 w-3 text-emerald-500 animate-pulse" /> Live Market Feed
                </div>
                {marketData.map((asset, idx) => (
                  <div key={idx} className="flex-shrink-0 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
                    <span className="font-bold text-white text-sm">{asset.symbol}</span>
                    <span className="text-slate-300 text-sm">${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className={`flex items-center text-xs font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {asset.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(asset.change || 0).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* DEMO 1: TRAJECTORY */}
              {activeTab === "trajectory" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2">Interactive Engine Preview</h3>
                      <p className="text-slate-400">Drag the slider to test the algorithmic optimizer.</p>
                    </div>
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 min-w-[280px]">
                      <div className="flex justify-between items-center text-sm mb-3">
                        <span className="text-slate-300 font-medium">Simulate Extra Savings:</span>
                        <span className="text-emerald-400 font-bold text-lg">+${demoGoal}/mo</span>
                      </div>
                      <input 
                        type="range" min="0" max="2000" step="50" 
                        value={demoGoal} onChange={(e) => setDemoGoal(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-[350px]">
                    <TrendChart data={demoProjectionData} />
                  </div>
                </motion.div>
              )}

              {/* DEMO 2: SUBSCRIPTION AI */}
              {activeTab === "subscriptions" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Neural Spend Analysis</h3>
                    <p className="text-slate-400">Our AI automatically flags redundant or unused capital drains.</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {[
                      { name: "Netflix Premium", amount: 22.99, status: "Active", risk: "Low", icon: <Activity /> },
                      { name: "Unknown Software Sub", amount: 49.00, status: "Flagged AI", risk: "High", icon: <Zap className="text-amber-400" /> },
                      { name: "Gym Membership", amount: 120.00, status: "Unused (3 mo)", risk: "High", icon: <Bell className="text-red-400" /> },
                    ].map((sub, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">{sub.icon}</div>
                          <div>
                            <h4 className="text-white font-bold">{sub.name}</h4>
                            <p className="text-sm text-slate-500">{sub.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">${sub.amount.toFixed(2)}</p>
                          {sub.risk === "High" ? (
                            <button className="mt-1 text-xs font-bold text-red-400 hover:text-red-300">Review & Cancel &rarr;</button>
                          ) : (
                            <span className="mt-1 text-xs font-bold text-emerald-400">Optimized</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-sm text-emerald-300 font-semibold">💡 AI found <span className="text-white font-bold">$169.00/mo</span> in potential savings. That equals <span className="text-emerald-400 font-bold">$2,028.00</span> per year.</p>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>

        {/* High-Tech Features Grid */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="my-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Built for the Top 1%</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">We abandoned basic budgeting. FinSight is engineered to treat your personal finances like an institutional portfolio.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <BrainCircuit className="h-8 w-8" />, title: "Neural Spend Analysis", desc: "Our engine categorizes and flags subscription creep and lifestyle inflation before it impacts your net worth." },
              { icon: <TrendingUp className="h-8 w-8" />, title: "Algorithmic Forecasting", desc: "Run 'What-If' scenarios to instantly calculate how a $100/mo habit affects your 10-year wealth trajectory." },
              { icon: <Database className="h-8 w-8" />, title: "Encrypted Vault", desc: "Bank-grade AES-256 encryption. We don't sell data. We sell financial clarity and software engineering." }
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group">
                <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-6 border border-slate-700 group-hover:border-emerald-500/50 group-hover:text-emerald-300 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </main>
    </div>
  );
}
