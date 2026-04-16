"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, Zap, BookOpen, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CompoundInterestArticle() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [annualRate, setAnnualRate] = useState(8);
  const [investmentYears, setInvestmentYears] = useState(30);
  
  // FIXED: Removed TypeScript <any[]> formatting
  const [compoundData, setCompoundData] = useState([]);

  useEffect(() => {
    setIsClient(true);
    generateCompoundingData();
  }, [monthlyInvestment, annualRate, investmentYears]);

  const generateCompoundingData = () => {
    // FIXED: Removed TypeScript type annotations
    const data = [];
    let totalInvested = 0;
    let balance = 0;
    const monthlyRate = annualRate / 100 / 12;

    for (let month = 0; month <= investmentYears * 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyInvestment;
      totalInvested = monthlyInvestment * month;
      const gains = balance - totalInvested;

      if (month % 12 === 0) {
        data.push({
          year: month / 12,
          balance: Math.round(balance),
          invested: Math.round(totalInvested),
          gains: Math.round(gains),
        });
      }
    }
    setCompoundData(data);
  };

  const finalBalance = compoundData.length > 0 ? compoundData[compoundData.length - 1].balance : 0;
  const totalInvested = monthlyInvestment * investmentYears * 12;
  const gainsMade = finalBalance - totalInvested;

  const comparisonData = [
    { year: 0, noInterest: 0, with4Percent: 0, with8Percent: 0 },
    { year: 10, noInterest: 60000, with4Percent: 73643, with8Percent: 91473 },
    { year: 20, noInterest: 120000, with4Percent: 171265, with8Percent: 249356 },
    { year: 30, noInterest: 180000, with4Percent: 347670, with8Percent: 702893 },
    { year: 40, noInterest: 240000, with4Percent: 628373, with8Percent: 1787155 },
  ];

  const powerOfTimeData = [
    { investor: "Started at 25", amount: 2157858 },
    { investor: "Started at 30", amount: 1321892 },
    { investor: "Started at 35", amount: 789345 },
    { investor: "Started at 40", amount: 412387 },
    { investor: "Started at 45", amount: 167892 },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900/20 to-slate-950 text-slate-50" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-[120px]"
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 z-10">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 pb-6 border-b border-slate-800/50 backdrop-blur-md"
        >
          <Link href="/learn" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold">Back</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">The Mathematics of Wealth</h1>
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
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-bold">Investing</span>
              <span className="text-slate-400">14 min read</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Compound Interest: The Eighth Wonder of the World
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
              Discover how compound interest can turn small regular investments into life-changing wealth. Learn the mathematical principles and practical strategies to leverage exponential growth.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
            {[
              { label: "Time to Read", value: "14 min" },
              { label: "Math Level", value: "Beginner+" },
              { label: "Simulations", value: "3+" },
              { label: "Real Examples", value: "10+" },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs font-semibold text-slate-400 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-emerald-400">{stat.value}</p>
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
          {["overview", "simulation", "comparison", "strategies"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {activeTab === "overview" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-emerald-400" />
                Understanding Compound Interest
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Compound interest is the interest earned on both your initial investment and the accumulated interest from previous periods. Albert Einstein reportedly called it "the eighth wonder of the world."
              </p>
              <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-emerald-400 mb-6">
                <p className="font-semibold text-emerald-400 mb-2">The Formula:</p>
                <p className="text-slate-300 font-mono">A = P(1 + r/n)^(nt)</p>
                <p className="text-sm text-slate-400 mt-2">
                  Where A = Final Amount, P = Principal, r = Annual Rate, n = Times per year, t = Years
                </p>
              </div>

              <h4 className="text-xl font-bold text-white mb-4">Why Compound Interest Matters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Time Amplification", desc: "More time = exponentially higher returns" },
                  { title: "Rate Impact", desc: "Small rate differences create massive outcomes" },
                  { title: "Consistency", desc: "Regular contributions accelerate wealth" },
                  { title: "Patience", desc: "Long-term investing beats short-term trading" },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <p className="font-bold text-emerald-400 mb-2">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Growth Rate Comparison (30 Years, $500/Month)</h3>
              {isClient && (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={comparisonData}>
                    <defs>
                      <linearGradient id="colorNone" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                    <Legend />
                    <Area type="monotone" dataKey="noInterest" stackId="1" stroke="#94a3b8" fill="url(#colorNone)" />
                    <Area type="monotone" dataKey="with4Percent" stackId="2" stroke="#f59e0b" fill="url(#colorMed)" />
                    <Area type="monotone" dataKey="with8Percent" stackId="3" stroke="#10b981" fill="url(#colorHigh)" />
                  </AreaChart>
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
              <h3 className="text-2xl font-bold text-white mb-6">Interactive Wealth Builder</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-emerald-400 mb-3">
                      Monthly Investment: <span className="text-white">${monthlyInvestment.toLocaleString()}</span>
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-emerald-400 mb-3">
                      Annual Return Rate: <span className="text-white">{annualRate}%</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.5"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-emerald-400 mb-3">
                      Investment Period: <span className="text-white">{investmentYears} years</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={investmentYears}
                      onChange={(e) => setInvestmentYears(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg"
                    />
                  </div>

                  {/* Results */}
                  <div className="space-y-3 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Final Portfolio Value</p>
                      <p className="text-3xl font-bold text-emerald-400">${finalBalance.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Total Invested</p>
                        <p className="text-xl font-bold text-slate-300">${totalInvested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Investment Gains</p>
                        <p className="text-xl font-bold text-emerald-400">${gainsMade.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Gain Percentage</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {totalInvested > 0 ? ((gainsMade / totalInvested) * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div>
                  {isClient && compoundData.length > 0 && (
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={compoundData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="year" stroke="#94a3b8" label={{ value: "Years", position: "insideBottomRight", offset: -5 }} />
                        <YAxis stroke="#94a3b8" />
                        {/* FIXED: Removed TypeScript annotations on formatter */}
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} 
                          formatter={(value) => value ? `$${Number(value).toLocaleString()}` : "$0"} 
                        />
                        <Legend />
                        <Area type="monotone" dataKey="invested" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="gains" stackId="1" stroke="#10b981" fill="url(#colorBalance)" fillOpacity={0.8} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}

        {activeTab === "comparison" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-400" />
                The Power of Starting Early ($500/Month Investment)
              </h3>
              {isClient && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={powerOfTimeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis type="category" dataKey="investor" stroke="#94a3b8" width={120} />
                    {/* FIXED: Removed TypeScript annotations on formatter */}
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} 
                      formatter={(value) => value ? `$${Number(value).toLocaleString()}` : "$0"} 
                    />
                    <Bar dataKey="amount" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <p className="text-slate-400 text-sm mt-4">
                Starting just 5 years earlier can nearly double your final wealth! Each year you delay costs you significantly.
              </p>
            </motion.section>
          </motion.div>
        )}

        {activeTab === "strategies" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-6">Maximizing Compound Interest</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "1. Start as Early as Possible",
                    desc: "Time is your greatest asset. Even small amounts invested early outperform large amounts invested late.",
                  },
                  {
                    title: "2. Invest Consistently",
                    desc: "Regular monthly contributions (dollar-cost averaging) help smooth out market volatility.",
                  },
                  {
                    title: "3. Reinvest Dividends",
                    desc: "Let your earnings compound. Automatic reinvestment accelerates wealth growth.",
                  },
                  {
                    title: "4. Minimize Fees",
                    desc: "Even small fees compound negatively. Choose low-cost index funds and ETFs.",
                  },
                  {
                    title: "5. Maximize Returns Safely",
                    desc: "Seek higher returns through diversified investments, but match risk to your tolerance.",
                  },
                  {
                    title: "6. Avoid Withdrawals",
                    desc: "Don't interrupt compounding. Each withdrawal stops years of growth.",
                  },
                ].map((strategy, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-colors"
                  >
                    <p className="font-bold text-emerald-400 mb-2">{strategy.title}</p>
                    <p className="text-slate-400 text-sm">{strategy.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-slate-900/60 rounded-2xl border border-slate-800/50 p-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white mb-4">Key Formulas to Remember</h3>
              <div className="space-y-4">
                {[
                  { formula: "Rule of 72", calc: "72 ÷ Interest Rate = Years to Double", example: "At 8%, money doubles every 9 years" },
                  { formula: "Future Value", calc: "FV = PV × (1 + r)^n", example: "Calculate exact future amounts" },
                  { formula: "Effective Return", calc: "(Ending Value - Starting Value) / Starting Value", example: "True return accounting for all factors" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
                  >
                    <p className="font-bold text-emerald-400 mb-1">{item.formula}</p>
                    <p className="font-mono text-sm text-slate-300 mb-2">{item.calc}</p>
                    <p className="text-xs text-slate-400">💡 {item.example}</p>
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

