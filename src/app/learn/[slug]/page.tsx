"use client";

import Link from "next/link";
import { Activity, BookOpen, TrendingUp, PiggyBank, ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { articles } from "@/lib/articles";

export default function LearnPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

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
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden selection:bg-cyan-500/30">
      
      {/* Animated background elements */}
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
        
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex items-center justify-between border-b border-slate-800/50 pb-6 backdrop-blur-md"
        >
          <Link href="/" className="group text-2xl font-black tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-7 w-7 text-cyan-400" />
            </motion.div>
            FinSight<span className="text-cyan-400 ml-1">Pro</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="group text-sm font-bold text-slate-300 hover:text-cyan-400 flex items-center gap-2 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-cyan-500/10">
              Dashboard 
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
            <Link href="/dashboard" className="group text-sm font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-2 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-emerald-500/10">
              Simulator
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
            </Link>
          </div>
        </motion.nav>

        {/* Header */}
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
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-8 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
          >
            Master the mathematics of wealth creation with comprehensive guides on asset allocation, market dynamics, tax optimization, and proven investment strategies. Each course includes detailed explanations, real-world examples, and actionable insights.
          </motion.p>

          <motion.div 
            className="flex gap-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { number: "6", label: "In-Depth Courses" },
              { number: "50+", label: "Expert Insights" },
              { number: "100K+", label: "Words of Content" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="flex flex-col"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-3xl sm:text-4xl font-black text-cyan-400">{stat.number}</span>
                <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.header>

        {/* Articles Grid */}
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
                          className="text-xl sm:text-2xl font-black text-white mb-4 leading-tight"
                          animate={hoveredCard === article.slug ? { color: "#06b6d4" } : { color: "#ffffff" }}
                          transition={{ duration: 0.3 }}
                        >
                          {article.title}
                        </motion.h2>

                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
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
                          Read Article
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

        {/* CTA Section */}
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
              className="text-3xl sm:text-4xl font-black text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Ready to Master Your Finances?
            </motion.h3>
            <motion.p 
              className="text-slate-300 text-lg max-w-xl mx-auto mb-8 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Experience live market simulations, interactive calculators, and real-time financial tools in our comprehensive dashboard.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg hover:shadow-lg transition-shadow"
                >
                  Launch Dashboard
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-cyan-500 text-cyan-400 font-bold text-lg hover:bg-cyan-500/10 transition-all"
                >
                  View Live Simulator
                  <Zap className="h-5 w-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
