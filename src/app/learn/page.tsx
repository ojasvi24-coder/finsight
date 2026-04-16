"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TrendChart } from "@/components/charts/TrendChart";

// ✅ Proper Type (fixes your bug permanently)
type ChartData = {
  month: string;
  balance: number;
  optimized: number;
};

export default function Home() {
  const [demoGoal, setDemoGoal] = useState<number>(500);

  // ✅ Clean + typed data
  const data: ChartData[] = useMemo(() => {
    let base = 25000;
    let opt = 25000;
    const monthlySavings = 1200;

    return ["Now", "M1", "M2", "M3", "M4", "M5"].map((month) => {
      const point: ChartData = {
        month,
        balance: base,
        optimized: opt,
      };

      base += monthlySavings;
      opt += monthlySavings + demoGoal;

      return point;
    });
  }, [demoGoal]);

  return (
    <div className="bg-[#020617] text-white min-h-screen">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="font-semibold tracking-tight text-lg">FinSight</h1>

          <Link
            href="/dashboard"
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight max-w-4xl"
        >
          Understand your money
          <br />
          <span className="text-emerald-400">
            with clarity, not guesswork
          </span>
        </motion.h1>

        <p className="mt-6 text-gray-400 max-w-xl text-lg">
          Visualize your spending, simulate your future, and make smarter financial decisions instantly.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/dashboard"
            className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:scale-105 transition"
          >
            Try Demo <ArrowRight size={18} />
          </Link>

          <button className="border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* INTERACTIVE SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-32">

        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-2">
            Simulate your financial future
          </h2>
          <p className="text-gray-400">
            Adjust your savings and instantly see the impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT PANEL */}
          <div className="lg:col-span-4 space-y-6">

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">
                Monthly optimization
              </p>

              <p className="text-3xl font-semibold text-emerald-400 mb-4">
                +${demoGoal}
              </p>

              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={demoGoal}
                onChange={(e) => setDemoGoal(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400">
                Saving an extra ${demoGoal}/month could significantly accelerate your financial growth over time.
              </p>
            </div>

          </div>

          {/* CHART */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <TrendChart data={data} />
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <section className="border-t border-white/5 py-16 text-center">
        <p className="text-gray-500 text-sm">
          Built with Next.js, Tailwind, and modern data visualization tools
        </p>
      </section>

    </div>
  );
}
