import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Activity, ArrowRight, BookOpen } from "lucide-react";
import { articles } from "@/lib/articles";
import { motion } from "framer-motion";

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) {
    return { title: "Not Found" };
  }
  return {
    title: `${article.title} | FinSight Pro`,
    description: article.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Get related articles (same category)
  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 selection:bg-cyan-500/30">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-full blur-[120px]"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 sm:px-8 py-12 z-10">
        {/* Navigation */}
        <nav className="mb-12 flex items-center justify-between border-b border-slate-800/50 pb-6 backdrop-blur-md">
          <Link
            href="/learn"
            className="text-sm font-medium text-slate-400 hover:text-cyan-400 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Learning
          </Link>
          <div className="text-lg font-bold tracking-tighter text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            FinSight Pro
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 text-cyan-400 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              {article.category}
            </span>
            <span className="text-sm font-medium text-slate-500">•</span>
            <span className="text-sm font-medium text-slate-500">{article.time}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed border-l-4 border-cyan-400 pl-6">
            {article.description}
          </p>
        </header>

        {/* Article Body Content */}
        <article className="space-y-12 pb-24">
          {article.content.map((section, index) => (
            <section key={index} className="space-y-4">
              {section.heading && (
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-8 first:mt-0">
                  {section.heading}
                </h2>
              )}

              {/* Handle both string and array text content */}
              {Array.isArray(section.text) ? (
                <div className="space-y-3 pl-4 border-l-2 border-cyan-500/30">
                  {section.text.map((line, i) => (
                    <p
                      key={i}
                      className="text-slate-300 leading-relaxed text-lg font-medium"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed text-lg font-medium">
                  {section.text}
                </p>
              )}
            </section>
          ))}
        </article>

        {/* Key Insights Callout */}
        <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 backdrop-blur-md">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Key Takeaway
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            Master the principles in this article and apply them consistently. Financial success isn't about complex strategies—it's about understanding fundamentals, maintaining discipline, and leveraging time. Start today with the actionable steps outlined above.
          </p>
        </div>

        {/* End of Article CTA */}
        <div className="border-t border-slate-800 pt-12 pb-24 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Apply This Knowledge?
          </h3>
          <p className="text-slate-400 mb-8 text-lg">
            Use our interactive dashboard to simulate scenarios and track your progress in real-time.
          </p>
          <Link href="/dashboard">
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_-5px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300">
              Open Dashboard
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-8">
              Related Articles
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/learn/${relatedArticle.slug}`}
                  className="group p-6 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-cyan-500/50 transition-all duration-300 hover:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                      {relatedArticle.category}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">
                      {relatedArticle.time}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-slate-400 text-sm mb-4">
                    {relatedArticle.description}
                  </p>
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

