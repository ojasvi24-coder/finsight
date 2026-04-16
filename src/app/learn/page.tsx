"use client";

import Link from "next/link";
import { Activity, BookOpen, TrendingUp, PiggyBank, ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface CompoundDataPoint {
  year: number;
  principal: number;
  interest: number;
  totalBalance: number;
}

export default function LearnPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const articles = [
    {
      slug: "asset-allocation",
      category: "Investing",
      title: "The Art of Asset Allocation",
      description: "Discover how to optimize your portfolio across multiple asset classes for maximum returns with minimal risk.",
      time: "12 min read",
      color: "from-blue-600 to-cyan-500",
      icon: TrendingUp,
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      stats: "73%"
    },
    {
      slug: "market-history",
      category: "Strategy",
      title: "Market History Lessons",
      description: "Learn from centuries of market cycles and understand the patterns that drive wealth creation.",
      time: "15 min read",
      color: "from-purple-600 to-pink-500",
      icon: BookOpen,
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      stats: "89%"
    },
    {
      slug: "algorithmic-saving",
      category: "Budgeting",
      title: "Algorithmic Saving Strategies",
      description: "Automate your finances with intelligent saving algorithms that adapt to your lifestyle.",
      time: "10 min read",
      color: "from-emerald-600 to-teal-500",
      icon: PiggyBank,
      image: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      stats: "95%"
    },
    {
      slug: "wealth-mathematics",
      category: "Investing",
      title: "The Mathematics of Wealth",
      description: "Understand compound interest, exponential growth, and the power of time in building generational wealth.",
      time: "14 min read",
      color: "from-amber-600 to-orange-500",
      icon: Activity,
      image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      stats: "82%"
    },
    {
      slug: "risk-management",
      category: "Strategy",
      title: "Advanced Risk Management",
      description: "Master hedging strategies and portfolio protection techniques used by institutional investors.",
      time: "13 min read",
      color: "from-rose-600 to-red-500",
      icon: Zap,
      image: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
      stats: "76%"
    },
    {
      slug: "tax-optimization",
      category: "Budgeting",
      title: "Tax-Efficient Investing",
      description: "Maximize after-tax returns with strategic tax planning and optimization techniques.",
      time: "11 min read",
      color: "from-indigo-600 to-blue-500",
      icon: BookOpen,
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      stats: "88%"
    }
  ];

  useEffect(() => {
    setIsClient(true);
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(generatedParticles);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.82, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden selection:bg-cyan-500/30" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 rounded-full blur-[120px]"
          animate={{ 
            y: [0, 30, 0],
            x: [0, 20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 -left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-full blur-[120px]"
          animate={{ 
            y: [0, -30, 0],
            x: [0, -20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-orange-500/10 rounded-full blur-[120px]"
          animate={{ 
            y: [0, 40, 0],
            x: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />

        {isClient && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-8 sm:py-12 z-10">
        
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex items-center justify-between border-b border-slate-800/50 pb-6 backdrop-blur-md"
        >
          <Link href="/" className="group text-2xl font-bold tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-7 w-7 text-cyan-400" />
            </motion.div>
            FinSight<span className="text-cyan-400 ml-1">→</span>
          </Link>
          <Link href="/dashboard" className="group text-sm font-bold text-slate-300 hover:text-cyan-400 flex items-center gap-2 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-cyan-500/10">
            Dashboard 
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>
        </motion.nav>

        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-20"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/20 mb-8 backdrop-blur-md"
            whileHover={{ scale: 1.05, borderColor: "#06b6d4" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </motion.div>
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Knowledge Base</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            <motion.span
              className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-pink-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Financial Intelligence
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-slate-400 max-w-3xl leading-relaxed font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Master the mathematics of wealth creation. Explore developer-curated guides on asset allocation, market dynamics, and algorithmic investing strategies.
          </motion.p>

          <motion.div 
            className="flex gap-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { number: "6", label: "Courses" },
              { number: "50+", label: "Insights" },
              { number: "10K+", label: "Learners" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="flex flex-col"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-3xl sm:text-4xl font-bold text-cyan-400" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{stat.number}</span>
                <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16"
        >
          {articles.map((article) => {
            const IconComponent = article.icon;
            return (
              <motion.div 
                key={article.slug}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(article.slug)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group h-full cursor-pointer"
              >
                <Link href={`/learn/${article.slug}`} className="block h-full">
                  <motion.div
                    className="h-full rounded-2xl overflow-hidden bg-slate-900/40 border border-slate-800/50 backdrop-blur-md relative"
                    whileHover={{
                      borderColor: "#06b6d4",
                      boxShadow: "0 20px 60px rgba(6, 182, 212, 0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                      style={{ background: article.image }}
                      animate={hoveredCard === article.slug ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />

                    <div className="relative p-8 h-full flex flex-col justify-between">
                      <div>
                        <motion.div
                          className="inline-flex items-center justify-center p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 group-hover:border-cyan-500/40 transition-colors"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          animate={hoveredCard === article.slug ? { y: [0, -5, 0] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <IconComponent className="h-6 w-6 text-cyan-400" />
                        </motion.div>

                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">{article.category}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500 font-medium">{article.time}</span>
                        </div>

                        <motion.h2 
                          className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight"
                          style={{ fontFamily: "'Times New Roman', Times, serif" }}
                          animate={hoveredCard === article.slug ? { color: "#06b6d4" } : { color: "#ffffff" }}
                          transition={{ duration: 0.3 }}
                        >
                          {article.title}
                        </motion.h2>

                        <p className="text-sm text-slate-400 leading-relaxed font-medium" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                          {article.description}
                        </p>
                      </div>

                      <motion.div
                        className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800/50"
                        initial={{ opacity: 0 }}
                        animate={hoveredCard === article.slug ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                          Explore
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </div>
                        <motion.div
                          className="text-xs font-bold text-slate-500 px-3 py-1 rounded-full bg-slate-950/50 border border-slate-800/50"
                          animate={hoveredCard === article.slug ? { 
                            backgroundColor: "rgba(6, 182, 212, 0.1)",
                            borderColor: "rgba(6, 182, 212, 0.3)",
                            color: "#06b6d4"
                          } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {article.stats}
                        </motion.div>
                      </motion.div>

                      <motion.div
                        className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
                        animate={hoveredCard === article.slug ? { 
                          opacity: 1,
                          scale: 1.2
                        } : { 
                          opacity: 0,
                          scale: 0.8
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-600/20 to-emerald-600/20 border border-cyan-500/30 p-12 text-center backdrop-blur-md"
        >
          <motion.div
            className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <motion.h3 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              Ready to Master Your Finances?
            </motion.h3>
            <motion.p 
              className="text-slate-300 text-lg max-w-xl mx-auto mb-8 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              Start with our comprehensive guides and transform your financial future today.
            </motion.p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg hover:shadow-lg transition-shadow"
              >
                Start Learning
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

