"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  TrendingUp, 
  BarChart3, 
  PiggyBank, 
  Zap, 
  BookOpen, 
  ArrowRight,
  CheckCircle2,
  Layers,
  Brain,
  Shield
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function HomePage() {
  const stats = [
    { 
      value: "8", 
      label: "Comprehensive Learning Articles",
      icon: BookOpen,
      color: "text-cyan-400"
    },
    { 
      value: "50+", 
      label: "Data-Driven Financial Insights",
      icon: Brain,
      color: "text-emerald-400"
    },
    { 
      value: "∞", 
      label: "Real-Time Dashboard Analytics",
      icon: BarChart3,
      color: "text-yellow-400"
    },
  ];

  const courses = [
    {
      slug: "the-art-of-asset-allocation",
      title: "The Art of Asset Allocation",
      category: "Investing",
      time: "12 min read",
      description: "Discover how to optimize your portfolio across multiple asset classes for maximum returns with minimal risk.",
      progress: 73
    },
    {
      slug: "market-history-lessons",
      title: "Market History Lessons",
      category: "Strategy",
      time: "15 min read",
      description: "Learn from centuries of market cycles and understand the patterns that drive wealth creation.",
      progress: 89
    },
    {
      slug: "algorithmic-saving-strategies",
      title: "Algorithmic Saving Strategies",
      category: "Budgeting",
      time: "10 min read",
      description: "Automate your finances with intelligent saving algorithms that adapt to your lifestyle.",
      progress: 95
    },
    {
      slug: "the-mathematics-of-wealth",
      title: "The Mathematics of Wealth",
      category: "Investing",
      time: "14 min read",
      description: "Understand compound interest, exponential growth, and the power of time in building generational wealth.",
      progress: 82
    },
    {
      slug: "advanced-risk-management",
      title: "Advanced Risk Management",
      category: "Strategy",
      time: "13 min read",
      description: "Master hedging strategies and portfolio protection techniques used by institutional investors.",
      progress: 76
    },
    {
      slug: "tax-efficient-investing",
      title: "Tax-Efficient Investing",
      category: "Budgeting",
      time: "11 min read",
      description: "Maximize after-tax returns with strategic tax planning and optimization techniques.",
      progress: 60
    },
  ];

  const categoryColors: Record<string, { bg: string; text: string; icon: typeof BookOpen }> = {
    "Investing": { bg: "bg-cyan-500/10", text: "text-cyan-400", icon: TrendingUp },
    "Strategy": { bg: "bg-amber-500/10", text: "text-amber-400", icon: Layers },
    "Budgeting": { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: PiggyBank },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
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
        
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
              Master the Mathematics of <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Wealth Creation</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Master wealth building through your interactive FinSight Dashboard with live simulations, interactive portfolio demos, and comprehensive guides on asset allocation, market dynamics, and algorithmic investing strategies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all duration-300"
            >
              <BarChart3 className="h-5 w-5" />
              Open FinSight Dashboard
            </Link>
            <Link 
              href="/learn" 
              className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-8 py-4 text-base font-semibold text-slate-50 border border-slate-700 hover:bg-slate-700 transition-all duration-300"
            >
              <BookOpen className="h-5 w-5" />
              Explore Learning Hub
            </Link>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20 grid gap-6 md:grid-cols-3"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-800/50 backdrop-blur-md p-8 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-700">
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`text-3xl sm:text-4xl font-black ${stat.color} mb-1`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-400 leading-snug">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Featured Courses Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white mb-3 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-cyan-400" />
              Featured Learning Articles
            </h2>
            <p className="text-lg text-slate-400">
              Deep-dive guides to master every aspect of wealth building
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {courses.map((course) => {
              const categoryStyle = categoryColors[course.category] || categoryColors["Investing"];
              const IconComponent = categoryStyle.icon;

              return (
                <motion.div
                  key={course.slug}
                  variants={itemVariants}
                  className="group h-full"
                >
                  <Link href={`/learn/${course.slug}`}>
                    <motion.div
                      className="h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-800/50 backdrop-blur-md p-6 hover:border-cyan-500/30 transition-all cursor-pointer"
                      whileHover={{
                        boxShadow: "0 20px 60px rgba(6, 182, 212, 0.15)",
                        y: -4,
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${categoryStyle.bg} border border-slate-700 group-hover:border-cyan-500/40 transition-colors`}>
                            <IconComponent className={`h-5 w-5 ${categoryStyle.text}`} />
                          </div>
                          <div>
                            <span className={`text-xs font-bold ${categoryStyle.text} uppercase tracking-widest`}>
                              {course.category}
                            </span>
                            <span className="text-xs text-slate-500 ml-2 block mt-1">•  {course.time}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-slate-500">Progress</p>
                          <p className="text-xs font-semibold text-cyan-400">{course.progress}%</p>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all gap-2 pt-4 border-t border-slate-700">
                        Read Article
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
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Link 
              href="/learn" 
              className="inline-flex items-center gap-2 rounded-full bg-slate-800/50 px-8 py-4 text-base font-semibold text-slate-50 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              View All Articles (8 Total)
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.section>

        {/* Dashboard Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white mb-3 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-emerald-400" />
              FinSight Dashboard Features
            </h2>
            <p className="text-lg text-slate-400">
              Everything you need to make data-driven financial decisions
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2"
          >
            {[
              {
                icon: TrendingUp,
                title: "Live Portfolio Tracking",
                description: "Real-time visualization of your wealth growth with interactive trend charts and projections."
              },
              {
                icon: Brain,
                title: "AI Financial Insights",
                description: "Machine learning-powered recommendations for spending optimization and investment strategies."
              },
              {
                icon: Shield,
                title: "Risk Assessment Tools",
                description: "Understand your risk exposure and get personalized recommendations for portfolio adjustments."
              },
              {
                icon: Zap,
                title: "Automated Allocations",
                description: "Smart rebalancing suggestions and tax-loss harvesting opportunities to maximize returns."
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-800/50 backdrop-blur-md p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 h-fit">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-md p-12 text-center overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Master Your Wealth?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Start with our comprehensive learning articles, then dive into live dashboard simulations to see your wealth grow in real-time.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 font-semibold text-slate-950 hover:bg-emerald-400 transition-all duration-300"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/learn" 
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900/50 px-8 py-3 font-semibold text-slate-50 border border-slate-700 hover:bg-slate-800 transition-all duration-300"
                >
                  Start Learning
                  <BookOpen className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-slate-800/50 text-center text-slate-400 text-sm"
        >
          <p>
            🚀 FinSight Dashboard: Where data meets decisions. Master wealth creation through education and live market simulations.
          </p>
        </motion.div>
      </div>
    </div>
  );
}


