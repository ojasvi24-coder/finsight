import Link from "next/link";
import { Activity, BookOpen, TrendingUp, PiggyBank } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Simple Navigation Back */}
        <nav className="mb-12 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Activity className="h-6 w-6 text-emerald-500" />
            FinSight.
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
            Go to Dashboard &rarr;
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">Financial Intelligence</h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Master your money with our developer-curated guides on budgeting, investing, and wealth generation.
          </p>
        </header>

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <ModuleCard 
            title="The 50/30/20 Framework"
            category="Budgeting"
            time="5 min read"
            icon={<PiggyBank className="h-5 w-5" />}
            desc="Learn how to strictly allocate your post-tax income into needs, wants, and aggressive savings."
          />
          <ModuleCard 
            title="Index Funds vs. Individual Stocks"
            category="Investing"
            time="8 min read"
            icon={<TrendingUp className="h-5 w-5" />}
            desc="A data-driven breakdown of why broad-market index funds historically outperform active day trading."
          />
          <ModuleCard 
            title="Understanding Compound Interest"
            category="Wealth"
            time="4 min read"
            icon={<Activity className="h-5 w-5" />}
            desc="The mathematical phenomenon that turns consistent small investments into massive capital over time."
          />
          <ModuleCard 
            title="Optimizing Tax-Advantaged Accounts"
            category="Strategy"
            time="10 min read"
            icon={<BookOpen className="h-5 w-5" />}
            desc="How to leverage 401(k)s, IRAs, and HSAs to legally minimize your lifetime tax burden."
          />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ title, category, time, icon, desc }: { title: string, category: string, time: string, icon: React.ReactNode, desc: string }) {
  return (
    <div className="group cursor-pointer rounded-2xl bg-slate-900/50 p-6 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300">
      <div className="flex items-center gap-3 text-emerald-400 mb-4">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{category} • {time}</span>
      </div>
      <h2 className="text-xl font-medium text-white mb-3 group-hover:text-emerald-400 transition-colors">{title}</h2>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
