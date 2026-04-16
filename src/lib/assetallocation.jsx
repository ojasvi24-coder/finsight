"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts";

export default function ArticlePage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [allocationA, setAllocationA] = useState(60);
  const [allocationB, setAllocationB] = useState(40);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sample data for Asset Allocation article
  const historicalReturnsData = [
    { year: 2010, stocks: 12.8, bonds: 6.5, balanced: 9.5 },
    { year: 2011, stocks: 2.1, bonds: 7.8, balanced: 5.0 },
    { year: 2012, stocks: 16.0, bonds: 4.2, balanced: 10.2 },
    { year: 2013, stocks: 32.4, bonds: -2.0, balanced: 15.0 },
    { year: 2014, stocks: 13.4, bonds: 5.9, balanced: 9.8 },
    { year: 2015, stocks: 1.4, bonds: 2.7, balanced: 2.1 },
    { year: 2016, stocks: 10.0, bonds: 3.3, balanced: 6.8 },
    { year: 2017, stocks: 21.8, bonds: 3.1, balanced: 12.5 },
    { year: 2018, stocks: -9.1, bonds: 1.3, balanced: -3.8 },
    { year: 2019, stocks: 28.7, bonds: 8.1, balanced: 18.5 },
    { year: 2020, stocks: 12.2, bonds: 7.5, balanced: 10.0 },
    { year: 2021, stocks: 28.7, bonds: -1.5, balanced: 13.0 },
    { year: 2022, stocks: -18.1, bonds: -12.0, balanced: -15.0 },
    { year: 2023, stocks: 24.3, bonds: 5.0, balanced: 14.5 },
  ];

  const riskReturnData = [
    { risk: 5, return: 2, category: "Cash" },
    { risk: 8, return: 3.5, category: "Bonds" },
    { risk: 12, return: 4.8, category: "Balanced" },
    { risk: 18, return: 7.2, category: "Growth" },
    { risk: 25, return: 9.5, category: "Aggressive" },
  ];

  const volatilityData = [
    { period: "2010-2014", stocks: 18.5, bonds: 5.2, portfolio: 10.2 },
    { period: "2015-2019", stocks: 15.8, bonds: 4.1, portfolio: 8.5 },
    { period: "2020-2023", stocks: 22.3, bonds: 7.3, portfolio: 12.1 },
  ];

  const allocationResults = [
    { strategy: "100% Stocks", growth: 385, volatility: 26, sharpeRatio: 1.45 },
    { strategy: "80/20", growth: 310, volatility: 21, sharpeRatio: 1.62 },
    { strategy: "60/40", growth: 245, volatility: 16, sharpeRatio: 1.75 },
    { strategy: "50/50", growth: 210, volatility: 14, sharpeRatio: 1.71 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      
      {/* Background animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-[120px]"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 z-10">
        
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 pb-6 border-b border-slate-800/50 backdrop-blur-md"
        >
          <Link href="/learn" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group">
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
            <span className="font-bold">Back to Courses</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">The Art of Asset Allocation</h1>
          <div className="w-32" />
        </motion.div>

        {/* Article Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm font-bold">Investing</span>
              <span className="text-slate-400">12 min read</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Master Your Portfolio: Complete Guide to Asset Allocation
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
              Learn how to construct a diversified portfolio that balances risk and return. Discover the mathematical foundations of modern portfolio theory and how to apply them to your investment strategy.
            </p>
          </motion.div>

          {/* Key Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
            {[
              { label: "Time to Read", value: "12 min" },
              { label: "Complexity", value: "Intermediate" },
              { label: "Practical Tools", value: "5+" },
              { label: "Interactive Charts", value: "8" },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs font-semibold text-slate-400 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-cyan-400">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-8 border-b border-slate-800/50 overflow-x-auto"
        >
          {["overview", "analysis", "simulation", "resources"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Content Sections */}
        {activeTab === "overview" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-cyan-400" />
                What is Asset Allocation?
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Asset allocation is the process of distributing your investment portfolio among different asset classes such as stocks, bonds, and cash. It's one of the most important decisions you'll make as an investor, as it directly impacts your long-term returns and risk exposure.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-cyan-400">
                <p className="font-semibold text-cyan-400 mb-2">Key Principle:</p>
                <p className="text-slate-300">
                  The right asset allocation for you depends on your risk tolerance, time horizon, and financial goals. A well-diversified portfolio can help you achieve consistent returns while minimizing volatility.
                </p>
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Historical Returns by Strategy</h3>
              {isClient && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalReturnsData}>
                    <defs>
                      <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="stocks" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="bonds" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="balanced" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <p className="text-slate-400 text-sm mt-4">
                This chart shows annual returns from 2010-2023 across different allocation strategies. Notice how the balanced approach smooths out volatility.
              </p>
            </motion.section>
          </motion.div>
        )}

        {activeTab === "analysis" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Risk vs. Return Analysis</h3>
              {isClient && (
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" dataKey="risk" stroke="#94a3b8" label={{ value: "Risk (Volatility %)", position: "insideBottomRight", offset: -5 }} />
                    <YAxis type="number" dataKey="return" stroke="#94a3b8" label={{ value: "Return (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Asset Classes" data={riskReturnData} fill="#06b6d4" />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </motion.section>

            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Volatility Trends Over Time</h3>
              {isClient && (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={volatilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="period" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                    <Legend />
                    <Bar dataKey="stocks" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="bonds" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="portfolio" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.section>
          </motion.div>
        )}

        {activeTab === "simulation" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Interactive Portfolio Simulator</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-cyan-400 mb-3">
                      Stocks Allocation: <span className="text-white">{allocationA}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={allocationA}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAllocationA(val);
                        setAllocationB(100 - val);
                      }}
                      className="w-full h-2 bg-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-400 mb-3">
                      Bonds Allocation: <span className="text-white">{allocationB}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={allocationB}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAllocationB(val);
                        setAllocationA(100 - val);
                      }}
                      className="w-full h-2 bg-slate-700 rounded-lg"
                    />
                  </div>

                  {/* Projected Results */}
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
                    <h4 className="font-bold text-white mb-3">Projected Performance</h4>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Expected Annual Return</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {(allocationA * 0.095 + allocationB * 0.035).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Volatility (Risk)</p>
                      <p className="text-2xl font-bold text-orange-400">
                        {Math.sqrt(Math.pow(allocationA * 0.25, 2) + Math.pow(allocationB * 0.08, 2)).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Sharpe Ratio</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {((allocationA * 0.095 + allocationB * 0.035) / Math.sqrt(Math.pow(allocationA * 0.25, 2) + Math.pow(allocationB * 0.08, 2))).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual Allocation */}
                <div className="flex flex-col justify-center items-center">
                  <div className="relative w-48 h-48 rounded-full mb-6 overflow-hidden border-4 border-slate-700">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600"
                      animate={{ width: `${allocationA}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600"
                      animate={{ left: `${allocationA}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{allocationA}/{allocationB}</p>
                        <p className="text-xs text-slate-300">Stocks/Bonds</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="w-4 h-4 rounded-full bg-cyan-500 mb-2 mx-auto" />
                      <p className="text-sm font-semibold text-slate-300">Stocks</p>
                    </div>
                    <div className="text-center">
                      <div className="w-4 h-4 rounded-full bg-purple-500 mb-2 mx-auto" />
                      <p className="text-sm font-semibold text-slate-300">Bonds</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Strategy Comparison Table */}
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Strategy Comparison (20-Year Projection)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 font-bold text-cyan-400">Strategy</th>
                      <th className="text-right py-3 px-4 font-bold text-cyan-400">Total Growth</th>
                      <th className="text-right py-3 px-4 font-bold text-cyan-400">Volatility</th>
                      <th className="text-right py-3 px-4 font-bold text-cyan-400">Sharpe Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocationResults.map((result, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="border-b border-slate-800 hover:bg-slate-800/30"
                      >
                        <td className="py-3 px-4 font-semibold text-slate-300">{result.strategy}</td>
                        <td className="text-right py-3 px-4 text-cyan-400 font-bold">{result.growth}%</td>
                        <td className="text-right py-3 px-4 text-orange-400">{result.volatility}%</td>
                        <td className="text-right py-3 px-4 text-emerald-400 font-semibold">{result.sharpeRatio}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          </motion.div>
        )}

        {activeTab === "resources" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Key Takeaways</h3>
              <ul className="space-y-4">
                {[
                  "Asset allocation is the primary driver of portfolio returns and risk",
                  "Diversification reduces volatility without significantly reducing expected returns",
                  "Your optimal allocation depends on your age, risk tolerance, and financial goals",
                  "Rebalancing regularly helps maintain your target allocation",
                  "Historical data shows balanced portfolios outperform on a risk-adjusted basis",
                ].map((takeaway, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="flex gap-3 items-start"
                  >
                    <Zap className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300">{takeaway}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Further Reading</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Modern Portfolio Theory", author: "Harry Markowitz" },
                  { title: "The Intelligent Investor", author: "Benjamin Graham" },
                  { title: "A Random Walk Down Wall Street", author: "Burton Malkiel" },
                  { title: "The Bogleheads' Guide to Investing", author: "Taylor & Larson" },
                ].map((book, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
                  >
                    <p className="font-semibold text-white mb-1">{book.title}</p>
                    <p className="text-sm text-slate-400">by {book.author}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}
      </div>
    </div>
  );
}
