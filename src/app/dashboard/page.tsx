import { TrendChart } from "@/components/charts/TrendChart";
import { aiInsights, recentTransactions } from "@/lib/mock-data";
import { ArrowUpRight, Wallet, Activity, Zap, CreditCard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-6 lg:p-8 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-emerald-500" />
              FinSight
            </h1>
            <p className="text-sm text-slate-400 mt-1">Live market data and personal analytics.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </span>
          </div>
        </header>

        {/* Top Metric Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Total Net Worth" value="$52,400.00" trend="+12.5%" icon={<Wallet />} />
          <MetricCard title="Monthly Delta" value="+$4,200.00" trend="+4.2%" icon={<Zap />} isHighlight />
          <MetricCard title="Active Capital" value="$18,250.00" trend="+8.1%" icon={<CreditCard />} />
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/50 p-6 border border-slate-800 backdrop-blur-sm transition-colors hover:border-slate-700">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-lg font-medium text-white">Asset Performance</h2>
                <p className="text-sm text-slate-400">6-month trailing trajectory</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-400">^ 24.7%</span>
              </div>
            </div>
            <TrendChart />
          </div>

          {/* Right Sidebar: AI & Transactions */}
          <div className="space-y-6">
            
            {/* AI Engine */}
            <div className="rounded-2xl bg-gradient-to-b from-emerald-900/20 to-slate-900/50 p-6 border border-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-medium text-emerald-50">Intelligence</h2>
              </div>
              
              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="rounded-xl bg-slate-950/50 p-4 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                    <p className="text-sm leading-relaxed text-slate-300">
                      {insight.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
              <h2 className="text-lg font-medium text-white mb-4">Recent Ledger</h2>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{tx.name}</span>
                      <span className="text-xs text-slate-500">{tx.date} • {tx.category}</span>
                    </div>
                    <span className={`text-sm font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Sub-component
function MetricCard({ title, value, trend, icon, isHighlight = false }: { title: string, value: string, trend: string, icon: React.ReactNode, isHighlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
      isHighlight 
        ? "bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]" 
        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
    }`}>
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-sm font-medium">{title}</span>
        <div className={`h-5 w-5 ${isHighlight ? "text-emerald-400" : "text-slate-500"}`}>{icon}</div>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <span className="text-3xl font-semibold tracking-tight text-white">{value}</span>
        <span className="text-sm font-medium flex items-center text-emerald-400 mb-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
          {trend} <ArrowUpRight className="h-3 w-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
}

