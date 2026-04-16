"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight, Activity, Sparkles,
  Lock, ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { TrendChart } from "@/components/charts/TrendChart";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [demoGoal, setDemoGoal] = useState<number>(500);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // smoother glow (less aggressive)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchLiveMarket = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await res.json();
        setMarketData([
          { id: "bitcoin", symbol: "BTC", price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
          { id: "ethereum", symbol: "ETH", price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
          { id: "solana", symbol: "SOL", price: data.solana.usd, change: data.solana.usd_24h_change },
        ]);
      } catch {
        setMarketData([
          { id: "bitcoin", symbol: "BTC", price: 74813, change: 0.32 },
          { id: "ethereum", symbol: "ETH", price: 2359, change: 1.12 },
          { id: "solana", symbol: "SOL", price: 84, change: -1.49 },
        ]);
      }
    };
    fetchLiveMarket();
  }, []);

  const demoProjectionData = useMemo(() => {
    let base = 25000;
    let opt = 25000;
    const save = 1200;

    return ["Now", "M1", "M2", "M3", "M4", "M5", "M6"].map((m) => {
      const point = { month: m, balance: base, optimized: opt };
      base += save;
      opt += save + demoGoal;
      return point;
    });
  }, [demoGoal]);

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* ✨ subtle gradient glow */}
      <motion.div
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300
        }}
        transition={{ type: "spring", stiffness: 40 }}
        style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }}
      />

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Activity className="text-emerald-400" />
            FinSight
          </div>

          <div className="flex gap-6 items-center">
            <Link href="/learn" className="text-sm text-gray-400 hover:text-white transition">
              Learn
            </Link>

            <Link
              href="/dashboard"
              className="bg-emerald-500 text-black px-5 py-2 rounded-full font-semibold hover:scale-105 transition"
            >
              Launch
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-7xl mx-auto">

        {/* HERO */}
        <section className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">AI Finance Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold leading-tight"
          >
            See where your money{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              actually goes
            </span>
          </motion.h1>

          <p className="mt-6 text-gray-400 max-w-xl mx-auto text-lg">
            Interactive financial insights, projections, and real-time market data — all in one place.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition flex items-center gap-2"
            >
              View Dashboard <ArrowRight size={18} />
            </Link>

            <button className="border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 transition">
              Explore Features
            </button>
          </div>
        </section>

        {/* INTERACTIVE PANEL */}
        <section className="grid lg:grid-cols-12 gap-8 mb-32">

          {/* LEFT */}
          <div className="lg:col-span-4 space-y-6">

            {/* slider */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <p className="text-sm text-gray-400 mb-3">Optimization</p>
              <p className="text-2xl font-bold text-emerald-400 mb-4">
                +${demoGoal}/mo
              </p>

              <input
                type="range"
                min="0"
                max="2000"
                value={demoGoal}
                onChange={(e) => setDemoGoal(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </motion.div>

            {/* market cards */}
            <div className="grid grid-cols-2 gap-4">
              {marketData.map((asset) => (
                <motion.a
                  whileHover={{ y: -4 }}
                  key={asset.id}
                  href="#"
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between text-xs text-gray-400">
                    {asset.symbol}
                    <ExternalLink size={12} />
                  </div>

                  <p className="mt-2 font-bold text-lg">
                    ${asset.price.toLocaleString()}
                  </p>

                  <p className={`text-xs ${asset.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {asset.change.toFixed(2)}%
                  </p>
                </motion.a>
              ))}
            </div>
          </div>

          {/* RIGHT CHART */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="text-sm text-emerald-400 mb-4">Projection Engine</p>
            <TrendChart data={demoProjectionData} />
          </motion.div>
        </section>

        {/* FEATURE BLOCK */}
        <section className="grid md:grid-cols-2 gap-6 mb-32">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <h3 className="text-2xl font-semibold mb-2">Institutional-grade insights</h3>
            <p className="text-gray-400">
              Data visualization and forecasting tools inspired by real fintech platforms.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <Lock className="mb-4 text-cyan-400" />
            <h3 className="text-xl font-semibold mb-2">Secure by design</h3>
            <p className="text-gray-400">
              No personal data stored. Everything runs client-side for safety.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
