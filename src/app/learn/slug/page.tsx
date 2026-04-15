import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Activity } from "lucide-react";
import { articles } from "@/lib/articles";

// This tells Next.js to pre-build these specific routes
export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // Await the params to resolve Next.js 15+ requirements
  const resolvedParams = await params;
  
  // Find the matching article from our data file
  const article = articles.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    notFound(); // Triggers a 404 page if someone types a bad URL
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-3xl">
        
        {/* Top Navigation */}
        <nav className="mb-16 flex items-center justify-between border-b border-slate-800 pb-6">
          <Link href="/learn" className="text-sm font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Intelligence
          </Link>
          <div className="text-lg font-bold tracking-tighter text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 text-emerald-400 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {article.category}
            </span>
            <span className="text-sm font-medium text-slate-500">{article.time}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed border-l-2 border-emerald-500 pl-4">
            {article.description}
          </p>
        </header>

        {/* Article Body Content */}
        <article className="space-y-12 pb-24">
          {article.content.map((section, index) => (
            <section key={index} className="space-y-4">
              {section.heading && (
                <h2 className="text-2xl font-medium text-white tracking-tight">{section.heading}</h2>
              )}
              
              {/* Check if text is an array (for bullet points) or a string */}
              {Array.isArray(section.text) ? (
                <div className="space-y-2">
                  {section.text.map((line, i) => (
                    <p key={i} className={`text-slate-300 leading-relaxed text-lg ${line.startsWith('•') ? 'ml-4' : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed text-lg">
                  {section.text}
                </p>
              )}
            </section>
          ))}
        </article>

        {/* End of Article CTA */}
        <div className="border-t border-slate-800 pt-12 pb-24 text-center">
          <h3 className="text-xl font-medium text-white mb-4">Ready to apply this?</h3>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all duration-300">
            Open your FinSight Dashboard <Activity className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
