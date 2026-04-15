import Link from "next/link";
import { Activity, BookOpen, TrendingUp, PiggyBank } from "lucide-react";
import { articles } from "@/lib/articles"; // Import our data

export default function LearnPage() {
  // Map icons to categories
  const getIcon = (category: string) => {
    switch (category) {
      case "Budgeting": return <PiggyBank className="h-5 w-5" />;
      case "Investing": return <TrendingUp className="h-5 w-5" />;
      case "Strategy": return <BookOpen className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-5xl">
        
        {/* Navigation */}
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

        {/* Dynamic Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/learn/${article.slug}`} className="group block">
              <div className="h-full rounded-2xl bg-slate-900/50 p-6 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300">
                <div className="flex items-center gap-3 text-emerald-400 mb-4">
                  {getIcon(article.category)}
                  <span className="text-xs font-semibold uppercase tracking-wider">{article.category} • {article.time}</span>
                </div>
                <h2 className="text-xl font-medium text-white mb-3 group-hover:text-emerald-400 transition-colors">{article.title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{article.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
