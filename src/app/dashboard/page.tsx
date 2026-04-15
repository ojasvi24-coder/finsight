"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendChart } from "@/components/charts/TrendChart";
import { Wallet, Activity, Zap, CreditCard, Settings2, SlidersHorizontal } from "lucide-react";

export default function Dashboard() {
  const [income, setIncome] = useState<number>(6000);
  const [expenses, setExpenses] = useState<number>(4200);
  const [currentNetWorth, setCurrentNetWorth] = useState<number>(25000);
  
  // Standout Feature: "What-If" Optimization variable
  const [whatIfSavings, setWhatIfSavings] = useState<number>(0);

  const baselineSavings = income - expenses;
  const optimizedSavings = baselineSavings + whatIfSavings;
  const savingsRate = income > 0 ? (baselineSavings / income) * 100 : 0;
  
  // Generate comparison data
  const projectionData = useMemo(() => {
    const months = ["Current", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
    let baseBalance = currentNetWorth;
    let optBalance = currentNetWorth;
    
    return months.map((month) => {
      const dataPoint = { month, balance: baseBalance, optimized: optBalance };
      baseBalance += baselineSavings;
      optBalance += optimizedSavings;
      return dataPoint;
    });
  }, [currentNetWorth, baselineSavings, optimizedSavings]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 p-4 sm:p-8 selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-[1200px] space-y-8">
        
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <h1 className="text-[32px] font-semibold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-8 w-8 text-emerald-500" />
            FinSight Engine
          </h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Chart Area */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl bg-slate-900/50 p-10 border border-slate-800/80 shadow-xl"
          >
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-[20px] font-medium text-white mb-1">Wealth Trajectory Simulator</h2>
                <p className="text-[14px] text-slate-400">Baseline vs. Optimized Projections</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] text-slate-400 mb-1">6-Month Delta</p>
                <span className="text-[24px] font-bold text-emerald-400">
                  +${(whatIfSavings * 6).toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Note: Update your TrendChart component to accept and render TWO lines (balance and optimized) */}
            <TrendChart data={projectionData} />
          </motion.div>

          {/* Right Sidebar: Controls & AI */}
          <div className="space-y-6">
            
            {/* Financial Parameters */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-slate-900/80 p-8 border border-slate-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <Settings2 className="h-5 w-5 text-slate-400" />
                <h2 className="text-[16px] font-medium text-white">Base Parameters</h2>
              </div>
              <div className="space-y-5">
                <InputField label="Monthly Income ($)" value={income} onChange={setIncome} />
                <InputField label="Monthly Expenses ($)" value={expenses} onChange={setExpenses} />
                <InputField label="Current Net Worth ($)" value={currentNetWorth} onChange={setCurrentNetWorth} />
              </div>
            </motion.div>

            {/* WHAT IF SIMULATOR */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-emerald-950/20 p-8 border border-emerald-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
                <h2 className="text-[16px] font-medium text-emerald-50">"What-If" Optimizer</h2>
              </div>
              <p className="text-[14px] text-slate-400 mb-6">What if you cut discretionary spending and invested the difference?</p>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-300">Add to savings:</span>
                  <span className="font-bold text-emerald-400">+${whatIfSavings}/mo</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="50"
                  value={whatIfSavings}
                  onChange={(e) => setWhatIfSavings(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Hyper-specific AI Insight */}
              {whatIfSavings > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <p className="text-[14px] leading-relaxed text-slate-300">
                    By reallocating <strong className="text-white">${whatIfSavings}</strong> monthly, your net worth will reach <strong className="text-emerald-400">${(currentNetWorth + (optimizedSavings * 6)).toLocaleString()}</strong> in 6 months instead of <strong className="text-slate-400">${(currentNetWorth + (baselineSavings * 6)).toLocaleString()}</strong>.
                  </p>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-medium text-slate-400">{label}</label>
      <input 
        type="number" 
        value={value || ''} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-[#020617] border border-slate-700 rounded-lg px-4 py-3 text-[16px] text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
      />
    </div>
  );
}


