"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, PiggyBank, Zap, ArrowRight, Search } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  category: string;
  time: string;
  description: string;
}

// Sample articles data - 6 core courses
const articles: Article[] = [
  {
    slug: "50-30-20-framework",
    title: "The 50/30/20 Framework",
    category: "Budgeting",
    time: "5 min read",
    description: "Learn how to allocate your post-tax income into needs, wants, and savings with this proven budgeting framework."
  },
  {
    slug: "index-funds-vs-stocks",
    title: "Index Funds vs. Individual Stocks",
    category: "Investing",
    time: "8 min read",
    description: "Understand why broad-market index funds historically outperform active day trading through data-driven analysis."
  },
  {
    slug: "the-art-of-asset-allocation",
    title: "The Art of Asset Allocation",
    category: "Strategy",
    time: "7 min read",
    description: "Master the strategic distribution of investments across different asset classes for optimal returns."
  },
  {
    slug: "compound-interest",
    title: "Understanding Compound Interest",
    category: "Wealth",
    time: "4 min read",
    description: "Discover how compound interest turns consistent small investments into massive capital over decades."
  },
  {
    slug: "market-history-lessons",
    title: "Market History: Lessons from Crashes",
    category: "Investing",
    time: "6 min read",
    description: "Learn from historical market crashes and how long-term investors turn volatility into opportunity."
  },
  {
    slug: "tax-efficient-investing",
    title: "Tax-Efficient Investing Strategies",
    category: "Strategy",
    time: "9 min read",
    description: "Leverage tax-advantaged accounts and strategies to legally minimize your lifetime tax burden."
  }
];

const categories = ["All", "Budgeting", "Investing", "Wealth", "Strategy"];

const categoryIcons: Record<string, React.ReactNode> = {
  "Budgeting": <PiggyBank className="w-5 h-5" />,
  "Investing": <TrendingUp className="w-5 h-5" />,
  "Wealth": <Zap className="w-5 h-5" />,
  "Strategy": <BookOpen className="w-5 h-5" />,
};

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = articles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  } as const;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 overflow-hidden flex items-center justify-center">
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

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-12 z-10">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-cyan-400" />
            Financial Learning Hub
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Master wealth-building strategies with our comprehensive learning materials. From budgeting fundamentals to advanced investment strategies.
          </p>
        </motion.header>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-500">
            Showing {filtered.length} course{filtered.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-1"
        >
          {filtered.length > 0 ? (
            filtered.map((article) => (
              <motion.div
                key={article.slug}
                variants={itemVariants}
                className="group"
              >
                <Link href={`/learn/${article.slug}`}>
                  <motion.div
                    className="h-full rounded-xl overflow-hidden bg-slate-900/40 border border-slate-800/50 backdrop-blur-md p-6 hover:border-cyan-500/30 transition-all cursor-pointer"
                    whileHover={{
                      boxShadow: "0 20px 60px rgba(6, 182, 212, 0.15)",
                      y: -4,
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                          {categoryIcons[article.category] || <BookOpen className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                            {article.category}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">•</span>
                          <span className="text-xs text-slate-500 ml-2">{article.time}</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {article.description}
                    </p>

                    <div className="flex items-center text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all gap-2">
                      Start Reading
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-12"
            >
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">No courses found matching your search.</p>
              <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Learning Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 p-8 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">💡 Learning Tips</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="text-emerald-400 font-bold">→</span>
              <span>Read courses in order for a complete understanding of wealth-building principles</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 font-bold">→</span>
              <span>Take notes on actionable recommendations and implement them immediately</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 font-bold">→</span>
              <span>Use the insights from each course to optimize your financial strategy</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 font-bold">→</span>
              <span>Revisit courses every 6 months to refresh your knowledge and track progress</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

