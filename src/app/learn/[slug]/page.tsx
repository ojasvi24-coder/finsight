import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Activity } from "lucide-react";
import { articles } from "@/lib/articles";
import { quizzes } from "@/lib/quizzes";
import KnowledgeCheck from "@/components/KnowledgeCheck";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const article = articles.find((a) => a.slug === resolvedParams.slug);
  if (!article) notFound();

  const quiz = quizzes[resolvedParams.slug];

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-slate-50 selection:bg-emerald-500/30 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Top Navigation */}
        <nav className="mb-16 flex items-center justify-between border-b border-slate-800 pb-6">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Guide
          </Link>
          <div className="flex items-center gap-2 text-lg font-bold tracking-tighter text-white">
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-16">
          <div className="mb-6 flex items-center gap-3 text-emerald-400">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-sm font-medium text-slate-500">
              {article.time}
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {article.title}
          </h1>
          <p className="border-l-2 border-emerald-500 pl-4 text-xl leading-relaxed text-slate-400">
            {article.description}
          </p>
        </header>

        {/* Article Body Content */}
        <article className="space-y-12 pb-16">
          {article.content.map((section, index) => (
            <section key={index} className="space-y-4">
              {section.heading && (
                <h2 className="text-2xl font-medium tracking-tight text-white">
                  {section.heading}
                </h2>
              )}

              {Array.isArray(section.text) ? (
                <div className="space-y-2">
                  {section.text.map((line, i) => (
                    <p
                      key={i}
                      className={`text-lg leading-relaxed text-slate-300 ${
                        line.startsWith("•") ? "ml-4" : ""
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-lg leading-relaxed text-slate-300">
                  {section.text}
                </p>
              )}
            </section>
          ))}
        </article>

        {/* Knowledge Check — only if a quiz exists for this article */}
        {quiz && quiz.length > 0 && (
          <section className="mb-16">
            <div className="mb-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Test your knowledge
              </div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Quick Knowledge Check
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Three quick questions. No pressure — this is just for you.
              </p>
            </div>
            <KnowledgeCheck questions={quiz} />
          </section>
        )}

        {/* End of Article CTA */}
        <div className="border-t border-slate-800 pb-24 pt-12 text-center">
          <h3 className="mb-4 text-xl font-medium text-white">
            Ready to apply this?
          </h3>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105 hover:bg-emerald-400"
          >
            Open your FinSight Dashboard <Activity className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
