"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  ArrowRight, Activity, Zap, TrendingUp, Shield, Sparkles, 
  BrainCircuit, Globe, BarChart3, Lock, TrendingDown, ExternalLink 
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { TrendChart } from "@/components/charts/TrendChart";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [demoGoal, setDemoGoal] = useState<number>(500);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse Tracker for Dynamic Glow Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Live Market API Sync
  useEffect(() => {
    const fetchLiveMarket = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        setMarketData([
          { id: "bitcoin", symbol: "BTC", price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
          { id: "ethereum", symbol: "ETH", price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
          { id: "solana", symbol: "SOL", price: data.solana.usd, change: data.solana.usd_24h_change },
        ]);
      } catch (error) {
        setMarketData([
          { id: "bitcoin", symbol: "BTC", price: 74813.00, change: 0.32 },
          { id: "ethereum", symbol: "ETH", price: 2359.88, change: 1.12 },
          { id: "solana", symbol: "SOL", price: 84.97, change: -1.49 },
        ]);
      }
    };
    fetchLiveMarket();
  }, []);

  // Interactive Demo Logic
  const demoProjectionData = useMemo(() => {
    let baseBalance = 25000;
    let optBalance = 25000;
    const monthlySavings = 1200;
    return ["Now", "M1", "M2", "M3", "M4", "M5", "M6"].map((month) => {
      const dataPoint = { month, balance: baseBalance, optimized: optBalance };
      baseBalance += monthlySavings;
      optBalance += (monthlySavings + demoGoal);
      return dataPoint;
    });
  }, [demoGoal]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans overflow-x-hidden relative">
      <motion.div 
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] z-0"
        animate={{ x: mousePosition.x - 250, y: mousePosition.y - 250 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />

      <nav className="fixed top-0 inset-x-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-500" /> FinSight.ai
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/learn" className="text-sm font-semibold text-slate-400 hover:text-white">Learn</Link>
            <Link href="/dashboard" className="rounded-full bg-white text-slate-950 px-5 py-2 text-sm font-bold hover:scale-105 transition-all">Launch Engine</Link>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 z-10">
        <motion.section initial="hidden" animate="visible" className="text-center mb-32">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300 tracking-wide uppercase">Neural Engine v2.0 Live</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            Wealth. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Automated.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            The first autonomous financial simulator. Model your future, detect leaks, and optimize your trajectory in real-time.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 text-slate-950 font-black text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:scale-105 transition-all">
              Deploy Simulator <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.section>

        {/* INTERACTIVE LIVE PREVIEW */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-40 grid lg:grid-cols-12 gap-8 items-center bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Optimization</span>
                <span className="text-emerald-400 font-black text-xl">+${demoGoal}/mo</span>
              </div>
              <input 
                type="range" min="0" max="2000" step="50" 
                value={demoGoal} onChange={(e) => setDemoGoal(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-6"
              />
              <p className="text-sm text-slate-400 leading-relaxed italic">"Drag to see how much faster you hit your milestones."</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {marketData.map((asset) => (
                <a key={asset.id} href={`https://coinmarketcap.com/currencies/${asset.id}/`} target="_blank" className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-slate-500">{asset.symbol}</span>
                    <ExternalLink className="h-3 w-3 text-slate-700 group-hover:text-emerald-500" />
                  </div>
                  <p className="font-bold text-white mb-1">${asset.price.toLocaleString()}</p>
                  <p className={`text-[10px] font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%</p>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#0a0f1c] p-8 rounded-[2rem] border border-white/10 h-[450px] relative shadow-inner">
             <div className="absolute top-6 left-8 flex items-center gap-2 text-xs font-bold text-emerald-500/50 uppercase tracking-[0.2em]"><Activity className="h-4 w-4" /> Live Engine Output</div>
             <TrendChart data={demoProjectionData} />
          </div>
        </motion.div>

        {/* BENTO GRID IMAGES */}
        <section className="grid md:grid-cols-3 gap-6 auto-rows-[300px] mb-32">
          <div className="md:col-span-2 rounded-[2rem] overflow-hidden relative border border-white/10 group">
            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200" className="object-cover w-full h-full opacity-50 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute bottom-8 left-8"><h3 className="text-3xl font-black text-white mb-2">Institutional-Grade</h3><p className="text-slate-400">Analysis tools usually reserved for the top 1%.</p></div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2rem] p-8 border border-white/10 flex flex-col justify-center">
            <Lock className="h-10 w-10 text-cyan-400 mb-6" />
            <h3 className="text-xl font-bold mb-2">AES-256 Secured</h3>
            <p className="text-sm text-slate-500">Read-only access. We never store or sell your personal credentials.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
