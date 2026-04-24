"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/user";
import {
  BookOpen,
  TrendingUp,
  PiggyBank,
  Zap,
  ArrowRight,
  Search,
  CheckCircle2,
  Circle,
  Flag,
  Target,
  Layers,
  Sparkles,
  Trophy,
  Award,
} from "lucide-react";

/* ---------- data ---------- */
interface Article {
  slug: string;
  title: string;
  category: string;
  time: string;
  description: string;
}

const articles: Article[] = [
  {
    slug: "50-30-20-framework",
    title: "The 50/30/20 Framework",
    category: "Budgeting",
    time: "5 min read",
    description:
      "Allocate post-tax income into needs, wants, and savings with a proven, automatic budgeting framework.",
  },
  {
    slug: "compound-interest",
    title: "Understanding Compound Interest",
    category: "Wealth",
    time: "4 min read",
    description:
      "How consistent small investments turn into massive capital over decades.",
  },
  {
    slug: "index-funds-vs-stocks",
    title: "Index Funds vs. Individual Stocks",
    category: "Investing",
    time: "8 min read",
    description:
      "Why broad-market index funds historically outperform active day trading.",
  },
  {
    slug: "market-history-lessons",
    title: "Market History: Lessons from Crashes",
    category: "Investing",
    time: "6 min read",
    description:
      "Learn from historical crashes — and how long-term investors turn volatility into opportunity.",
  },
  {
    slug: "the-art-of-asset-allocation",
    title: "The Art of Asset Allocation",
    category: "Strategy",
    time: "7 min read",
    description:
      "The strategic distribution of investments across asset classes for optimal risk-adjusted returns.",
  },
  {
    slug: "tax-efficient-investing",
    title: "Tax-Efficient Investing Strategies",
    category: "Strategy",
    time: "9 min read",
    description:
      "Tax-advantaged accounts, asset location, and loss harvesting to minimize your lifetime tax bill.",
  },
];

/* ---------- learning tracks ---------- */
const tracks = [
  {
    id: "foundations",
    title: "Foundations",
    level: "Beginner",
    icon: Flag,
    accent: "from-emerald-500/20 to-emerald-500/0",
    ring: "border-emerald-500/20",
    pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    description:
      "Start here. Build the mental models every investor needs before touching a single stock.",
    slugs: ["50-30-20-framework", "compound-interest"],
  },
  {
    id: "investing-101",
    title: "Investing 101",
    level: "Intermediate",
    icon: Target,
    accent: "from-cyan-500/20 to-cyan-500/0",
    ring: "border-cyan-500/20",
    pill: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    description:
      "Learn what actually drives returns — and why staying calm during a crash is a superpower.",
    slugs: ["index-funds-vs-stocks", "market-history-lessons"],
  },
  {
    id: "advanced-strategy",
    title: "Advanced Strategy",
    level: "Advanced",
    icon: Layers,
    accent: "from-amber-500/20 to-amber-500/0",
    ring: "border-amber-500/20",
    pill: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    description:
      "Optimize. Master asset allocation and tax-efficient structures to keep more of what you earn.",
    slugs: ["the-art-of-asset-allocation", "tax-efficient-investing"],
  },
];

const categories = ["All", "Budgeting", "Investing", "Wealth", "Strategy"];

const categoryIcons: Record<string, React.ReactNode> = {
  Budgeting: <PiggyBank className="h-5 w-5" />,
  Investing: <TrendingUp className="h-5 w-5" />,
  Wealth: <Zap className="h-5 w-5" />,
  Strategy: <BookOpen className="h-5 w-5" />,
};

/* ---------- progress persistence ---------- */
const STORAGE_KEY = "finsight.learn.completed.v1";

function useCompletion() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (slug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(next))
        );
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return { completed, toggle };
}

/* ---------- page ---------- */
export default function LearnPage() {
  const { firstName, hasProfile } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { completed, toggle } = useCompletion();

  const filtered = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  } as const;

  const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

  // "For You" feed — context-aware recommendations.
  // Heuristic: surface the next uncompleted lesson from each track,
  // plus one spotlight article the user hasn't finished yet.
  const forYouArticles = (() => {
    const firstUncompleted = tracks
      .map((t) => t.slugs.find((s) => !completed.has(s)))
      .filter(Boolean) as string[];
    const uniqueSlugs = Array.from(new Set(firstUncompleted));
    // Fall back to first articles if everything is completed
    if (uniqueSlugs.length < 3) {
      for (const a of articles) {
        if (!uniqueSlugs.includes(a.slug)) uniqueSlugs.push(a.slug);
        if (uniqueSlugs.length === 3) break;
      }
    }
    return uniqueSlugs.slice(0, 3).map((slug) => bySlug[slug]).filter(Boolean);
  })();

  // Context-aware "because you..." copy for each recommendation
  const forYouReasons: Record<string, string> = {
    "50-30-20-framework": "Because you're tracking spending",
    "compound-interest": "Because small amounts compound fast",
    "index-funds-vs-stocks": "Because you hold market assets",
    "market-history-lessons": "Because markets move daily",
    "the-art-of-asset-allocation": "Because your portfolio is 70/20/10",
    "tax-efficient-investing": "Because taxes eat returns",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      {/* subtle ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(16,185,129,0.05),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 sm:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Your Guide
          </span>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Learn while you earn.
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-400">
            Short, plain-English lessons tied to the exact numbers you see on
            your dashboard. No homework — just enough to make your next decision.
          </p>
        </motion.header>

        {/* ---------- EARN-TO-LEARN POINTS BAR ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-amber-500/[0.06] via-slate-900/60 to-slate-900/60 p-5 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15">
                <Trophy className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  Earn to learn
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-white">
                    {completed.size * 50}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">XP</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {completed.size === articles.length
                    ? "All lessons complete. You're a master."
                    : `${articles.length - completed.size} lessons until you reach ${articles.length * 50} XP`}
                </p>
              </div>
            </div>

            {/* Achievements strip */}
            <div className="flex items-center gap-2">
              <AchievementBadge
                unlocked={completed.size >= 1}
                label="First Step"
                hint="Complete 1 lesson"
              />
              <AchievementBadge
                unlocked={completed.size >= 3}
                label="On a Roll"
                hint="Complete 3 lessons"
              />
              <AchievementBadge
                unlocked={completed.size >= articles.length}
                label="Scholar"
                hint="Complete all lessons"
              />
            </div>
          </div>
        </motion.section>

        {/* ---------- FOR YOU FEED ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                {hasProfile ? `For you, ${firstName}` : "For you"}
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Picked based on your activity
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {forYouArticles.map((article) => (
              <Link key={article.slug} href={`/learn/${article.slug}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="group h-full cursor-pointer rounded-xl border border-slate-800 bg-gradient-to-br from-emerald-500/[0.04] to-slate-900/60 p-5 backdrop-blur-sm transition-colors hover:border-emerald-500/30"
                >
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    {forYouReasons[article.slug] ?? "Recommended next"}
                  </div>
                  <h3 className="mb-2 text-base font-bold leading-snug text-white">
                    {article.title}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-slate-400">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{article.time}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* ---------- LEARNING TRACKS ---------- */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Learning Tracks
            </h2>
            <span className="text-xs text-slate-500">
              {completed.size} of {articles.length} lessons completed
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {tracks.map((track) => {
              const completedCount = track.slugs.filter((s) =>
                completed.has(s)
              ).length;
              const total = track.slugs.length;
              const pct = Math.round((completedCount / total) * 100);
              const isComplete = completedCount === total;
              const Icon = track.icon;

              return (
                <motion.div
                  key={track.id}
                  variants={itemVariants}
                  className={`relative overflow-hidden rounded-2xl border ${track.ring} bg-slate-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-slate-900/80`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${track.accent}`}
                  />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60">
                        <Icon className="h-5 w-5 text-slate-200" />
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${track.pill}`}
                      >
                        {track.level}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {track.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      {track.description}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-5">
                      <div className="mb-1.5 flex items-baseline justify-between text-xs">
                        <span className="font-medium text-slate-400">
                          {completedCount}/{total} completed
                        </span>
                        <span className="font-mono font-bold text-white">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            isComplete ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Lesson list */}
                    <ul className="mt-5 space-y-2">
                      {track.slugs.map((slug, idx) => {
                        const lesson = bySlug[slug];
                        if (!lesson) return null;
                        const done = completed.has(slug);
                        return (
                          <li
                            key={slug}
                            className="flex items-center gap-2.5 rounded-lg border border-slate-800/80 bg-slate-950/40 px-3 py-2"
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggle(slug);
                              }}
                              className="flex-shrink-0 text-slate-500 transition-colors hover:text-emerald-400"
                              aria-label={
                                done ? "Mark incomplete" : "Mark complete"
                              }
                            >
                              {done ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>
                            <Link
                              href={`/learn/${slug}`}
                              className="min-w-0 flex-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`truncate text-sm font-medium ${
                                    done
                                      ? "text-slate-500 line-through"
                                      : "text-slate-200 hover:text-white"
                                  }`}
                                >
                                  {idx + 1}. {lesson.title}
                                </span>
                                <span className="flex-shrink-0 text-[10px] text-slate-500">
                                  {lesson.time}
                                </span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ---------- BROWSE ALL LESSONS ---------- */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Browse all lessons
          </h2>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-12 pr-4 text-white placeholder-slate-500 transition-colors focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "border border-slate-700 bg-slate-800 text-white"
                      : "border border-slate-800/60 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Showing {filtered.length} lesson{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Lesson grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2"
          >
            {filtered.length > 0 ? (
              filtered.map((article) => {
                const done = completed.has(article.slug);
                return (
                  <motion.div
                    key={article.slug}
                    variants={itemVariants}
                    className="group"
                  >
                    <Link href={`/learn/${article.slug}`}>
                      <div className="h-full cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-slate-700">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-slate-950/60 text-slate-300 transition-colors group-hover:border-emerald-500/30 group-hover:text-emerald-400">
                              {categoryIcons[article.category] || (
                                <BookOpen className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold uppercase tracking-wider text-slate-400">
                                {article.category}
                              </span>
                              <span className="text-slate-600">·</span>
                              <span className="text-slate-500">
                                {article.time}
                              </span>
                            </div>
                          </div>
                          {done && (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                          )}
                        </div>

                        <h3 className="mb-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-emerald-300">
                          {article.title}
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-slate-400">
                          {article.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 transition-colors group-hover:text-emerald-400">
                          {done ? "Review lesson" : "Start reading"}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full py-12 text-center"
              >
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                <p className="mb-1 text-slate-400">
                  No lessons found matching your search.
                </p>
                <p className="text-sm text-slate-500">
                  Try adjusting your filters or search query.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        {/* Learning Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/40 p-7"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-400">
            How to use this hub
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="text-emerald-400">→</span>
              Complete Foundations first — it unlocks the rest
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">→</span>
              Tap the circle next to any lesson to mark it complete
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">→</span>
              See a "?" in the dashboard? It links directly back here
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">→</span>
              Revisit every 6 months to refresh and track progress
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   AchievementBadge — small locked/unlocked pill
   ============================================================ */
function AchievementBadge({
  unlocked,
  label,
  hint,
}: {
  unlocked: boolean;
  label: string;
  hint: string;
}) {
  return (
    <div
      title={hint}
      className={`group relative hidden flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-all sm:flex ${
        unlocked
          ? "border-amber-500/30 bg-amber-500/10"
          : "border-slate-800 bg-slate-900/50"
      }`}
    >
      <Award
        className={`h-4 w-4 ${
          unlocked ? "text-amber-400" : "text-slate-600"
        }`}
      />
      <span
        className={`text-[9px] font-bold uppercase tracking-wider ${
          unlocked ? "text-amber-300" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

