import { TrendChart } from "@/components/charts/TrendChart";
import { aiInsights } from "@/lib/mock-data";
import { ArrowUpRight, Wallet, PieChart as PieIcon, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Financial Overview</h1>
          <p className="text-sm text-slate-500">Welcome to your public demo dashboard.</p>
        </header>

        {/* Top Metric Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Total Net Worth" value="$52,400.00" trend="+12.5%" icon={<Wallet />} />
          <MetricCard title="Monthly Spending" value="$3,000.00" trend="-4.2%" icon={<PieIcon />} isInverse />
          <MetricCard title="Savings Growth" value="$1,200.00" trend="+8.1%" icon={<TrendingUp />} />
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <h2 className="text-lg font-medium text-slate-900 mb-6">Net Worth Trend</h2>
            <TrendChart />
          </div>

          {/* AI Insights Sidebar */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-slate-900">AI Insights</h2>
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            </div>
            
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-sm leading-relaxed text-slate-700">
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

// Reusable Sub-component
function MetricCard({ title, value, trend, icon, isInverse = false }: { title: string, value: string, trend: string, icon: React.ReactNode, isInverse?: boolean }) {
  const trendColor = isInverse ? "text-red-600" : "text-emerald-600";
  
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-sm font-medium">{title}</span>
        <div className="h-4 w-4">{icon}</div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-slate-900">{value}</span>
        <span className={`text-sm font-medium flex items-center ${trendColor}`}>
          {trend} <ArrowUpRight className="h-3 w-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
}
