import Link from "next/link";
import { ArrowRight, Shield, Zap, Activity, BarChart3 } from "lucide-react";
import { TrendChart } from "@/components/charts/TrendChart";
import { monthlyTrends } from "@/lib/mock-data"; 

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-500" />
          FinSight.
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/learn" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Learn
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard" className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-32 z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            FinSight 2.0 is now live
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Understand your money <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">like never before.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Institutional-grade analytics built for your personal wealth. Track net worth, analyze spending habits with AI, and optimize your financial trajectory.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all duration-300"
            >
              Explore Dashboard
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-slate-300 flex items-center gap-1 group hover:text-white transition-colors">
              Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-emerald-500" />
            </Link>
          </div>
        </div>

        {/* Live Dashboard Preview */}
        <div className="mt-24 mx-auto max-w-5xl relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Window Top Bar */}
            <div className="h-10 bg-slate-950/50 border-b border-slate-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
            {/* Window Content (Live Chart) */}
            <div className="p-6 bg-slate-900/50 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-lg font-medium text-white">Live Net Worth Preview</h2>
                  <p className="text-sm text-slate-400">Interactive live data rendering</p>
                </div>
                <span className="text-2xl font-bold text-emerald-400">+$4,200.00</span>
              </div>
              {/* We are reusing the exact same chart from your dashboard! */}
              <TrendChart data={monthlyTrends} />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32 mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white">Engineered for wealth creation.</h2>
            <p className="mt-4 text-slate-400">Everything you need to manage your money, built with developer-tier precision.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-emerald-400" />}
              title="AI-Powered Insights"
              desc="Our engine analyzes your spending patterns to detect anomalies and suggest optimizations automatically."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-6 w-6 text-emerald-400" />}
              title="Real-time Metrics"
              desc="Watch your net worth update in real-time with beautiful, interactive SVG gradients and charts."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-emerald-400" />}
              title="Bank-grade Security"
              desc="Your data is encrypted at rest and in transit. We never sell your personal financial information."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
