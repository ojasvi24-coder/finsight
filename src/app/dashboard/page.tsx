"use client";

import { useState, useMemo } from "react";
import { TrendChart } from "@/components/charts/TrendChart";
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, Zap, CreditCard, Settings2 } from "lucide-react";

export default function Dashboard() {
  // 1. React State for User Inputs
  const [income, setIncome] = useState<number>(6000);
  const [expenses, setExpenses] = useState<number>(4200);
  const [currentNetWorth, setCurrentNetWorth] = useState<number>(25000);

  // 2. Financial Engine Calculations
  const monthlySavings = income - expenses;
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;
  
  // 3. Generate 6-Month Projection Data for the Chart
  const projectionData = useMemo(() => {
    const months = ["Current", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
    let runningBalance = currentNetWorth;
    
    return months.map((month) => {
      const dataPoint = { month, balance: runningBalance };
      runningBalance += monthlySavings; // Add their monthly savings to their net worth
      return dataPoint;
    });
  }, [currentNetWorth, monthlySavings]);

  // 4. Algorithmic "AI" Insights based on User Data
  const dynamicInsights = useMemo(() => {
    const insights = [];
    
    if (savingsRate >= 20) {
      insights.push({ id: 1, type: "success", message: `Excellent work. Your savings rate is ${savingsRate.toFixed(1)}%, hitting the 20% optimal threshold for wealth generation.` });
    } else if (savingsRate > 0) {
      insights.push({ id: 1, type: "warning", message: `Your savings rate is ${savingsRate.toFixed(1)}%. Try cutting discretionary spending to push this closer to the 20% benchmark.` });
    } else {
      insights.push({ id: 1, type: "danger", message: `CRITICAL: You are spending more than you earn. You are losing $${Math.abs(monthlySavings)} a month. Immediate budget review required.` });
    }

    insights.push({ id: 2, type: "info", message: `Based on your current trajectory, your net worth will be $${(currentNetWorth + (monthlySavings * 6)).toLocaleString()} in 6 months.` });
    
    return insights;
  }, [savingsRate, monthlySavings, currentNetWorth]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-6 lg:p-8 selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-emerald-500" />
              FinSight Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1">Interactive personal finance modeling.</p>
          </div>
        </header>

        {/* Input Control Panel */}
        <div className="rounded-2xl bg-slate-900/40 p-6 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6 text-emerald-400">
            <Settings2 className="h-5 w-5" />
            <h2 className="text-lg font-medium text-white">Financial Parameters</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <InputField label="Monthly Post-Tax Income ($)" value={income} onChange={setIncome} />
            <InputField label="Total Monthly Expenses ($)" value={expenses} onChange={setExpenses} />
            <InputField label="Current Liquid Net Worth ($)" value={currentNetWorth} onChange={setCurrentNetWorth} />
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Current Net Worth" value={`$${currentNetWorth.toLocaleString()}`} icon={<Wallet />} />
          <MetricCard 
            title="Monthly Cash Flow" 
            value={`${monthlySavings >= 0 ? '+' : '-'}$${Math.abs(monthlySavings).toLocaleString()}`} 
            isHighlight={monthlySavings > 0} 
            isDanger={monthlySavings < 0}
            icon={<Zap />} 
          />
          <MetricCard title="Savings Rate" value={`${savingsRate.toFixed(1)}%`} icon={<CreditCard />} />
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/50 p-6 border border-slate-800 backdrop-blur-sm">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-lg font-medium text-white">6-Month Wealth Projection</h2>
                <p className="text-sm text-slate-400">Trajectory based on current cash flow</p>
              </div>
            </div>
            <TrendChart data={projectionData} />
          </div>

          {/* Right Sidebar: Dynamic AI Engine */}
          <div className="rounded-2xl bg-gradient-to-b from-emerald-900/20 to-slate-900/50 p-6 border border-emerald-500/20 relative overflow-hidden h-fit">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-medium text-emerald-50">Algorithmic Insights</h2>
            </div>
            
            <div className="space-y-4">
              {dynamicInsights.map((insight) => (
                <div key={insight.id} className="rounded-xl bg-slate-950/50 p-4 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <p className={`text-sm leading-relaxed ${insight.type === 'danger' ? 'text-red-400' : 'text-slate-300'}`}>
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Custom Input Component
function InputField({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <input 
        type="number" 
        value={value || ''} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
      />
    </div>
  );
}

// Updated Metric Card
function MetricCard({ title, value, icon, isHighlight = false, isDanger = false }: { title: string, value: string, icon: React.ReactNode, isHighlight?: boolean, isDanger?: boolean }) {
  let cardStyle = "bg-slate-900/50 border-slate-800";
  let textStyle = "text-white";
  let iconStyle = "text-slate-500";

  if (isHighlight) {
    cardStyle = "bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]";
    iconStyle = "text-emerald-400";
  } else if (isDanger) {
    cardStyle = "bg-red-950/30 border-red-500/30";
    textStyle = "text-red-400";
    iconStyle = "text-red-400";
  }

  return (
    <div className={`rounded-2xl p-6 border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${cardStyle}`}>
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-sm font-medium">{title}</span>
        <div className={`h-5 w-5 ${iconStyle}`}>{icon}</div>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <span className={`text-3xl font-semibold tracking-tight ${textStyle}`}>{value}</span>
      </div>
    </div>
  );
}

