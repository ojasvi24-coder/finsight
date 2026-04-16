"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Zap, Target, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(30);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    generateCompoundData();
  }, [initialInvestment, annualReturn, years]);

  const generateCompoundData = () => {
    const data = [];
    for (let year = 0; year <= years; year++) {
      const amount = initialInvestment * Math.pow(1 + annualReturn / 100, year);
      data.push({
        year,
        amount: Math.round(amount),
        formatted: `$${Math.round(amount).toLocaleString()}`,
      });
    }
    setSimulationData(data);
  };

  const finalAmount = initialInvestment * Math.pow(1 + annualReturn / 100, years);
  const gain = finalAmount - initialInvestment;

  const assetAllocationData = [
    { name: "Stocks", value: 60, color: "#06b6d4" },
    { name: "Bonds", value: 30, color: "#8b5cf6" },
    { name: "Cash", value: 10, color: "#10b981" },
  ];

  const portfolioPerformance = [
    { month: "Jan", performance: 2 },
    { month: "Feb", performance: -1 },
    { month: "Mar", performance: 3 },
    { month: "Apr", performance: 1.5 },
    { month: "May", performance: 2.5 },
    { month: "Jun", performance: -0.5 },
    { month: "Jul", performance: 4 },
    { month: "Aug", performance: 2 },
    { month: "Sep", performance: 1 },
    { month: "Oct", performance: 2.5 },
    { month: "Nov", performance: 3 },
    { month: "Dec", performance: 2 },
  ];

  const courses = [
    {
      id: 1,
      title: "Asset Allocation Mastery",
      description: "Learn how to build a diversified portfolio",
      progress: 75,
      color: "from-blue-500 to-cyan-500",
      icon: PieChart,
    },
    {
      id: 2,
      title: "Market Cycles & Trends",
      description: "Understand historical market patterns",
      progress: 45,
      color: "from-purple-500 to-pink-500",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: "Wealth Compounding",
      description: "Master the power of exponential growth",
      progress: 90,
      color: "from-emerald-500 to-teal-500",
      icon: Target,
    },
    {
      id: 4,
      title: "Tax Optimization",
      description: "Maximize after-tax returns",
      progress: 30,
      color: "from-amber-500 to-orange-500",
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 text-slate-50 overflow-hidden" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-[120px]"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-[120px]"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-transparent rounded-full blur-[120px]"
          animate={{ y: [0, 40, 0], x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 pb-6 border-b border-slate-800/50 backdrop-blur-md"
        >
          <Link href="/learn" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold">Back</span>
          </Link>
          <h1 className="text-4xl font-bold text-white">Financial Learning Dashboard</h1>
          <div className="w-12" />
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: "Current Progress", value: "65%", color: "from-cyan-500 to-blue-500" },
            { label: "Courses Completed", value: "2/6", color: "from-purple-500 to-pink-500" },
            { label: "Learning Streak", value: "24 days", color: "from-emerald-500 to-teal-500" },
            { label: "Portfolio Value", value: "$128K", color: "from-amber-500 to-orange-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl backdrop-blur-md border border-white/10`}
            >
              <p className="text-sm font-semibold text-white/80 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Compound Interest Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Compound Interest Simulator</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-3">
                  Initial Investment: <span className="text-white">${initialInvestment.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-400 mb-3">
                  Annual Return: <span className="text-white">{annualReturn}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-400 mb-3">
                  Time Period: <span className="text-white">{years} years</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Results */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-2">Final Amount</p>
                <p className="text-3xl font-bold text-cyan-400">${Math.round(finalAmount).toLocaleString()}</p>
                <p className="text-sm text-emerald-400 mt-2">Gain: ${Math.round(gain).toLocaleString()}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="lg:col-span-2">
              {isClient && simulationData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={simulationData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                      formatter={(value: any) => value ? `$${Number(value).toLocaleString()}` : "$0"}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={false}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Portfolio Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Portfolio Performance</h3>
            {isClient && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={portfolioPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                  <Bar dataKey="performance" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Asset Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/50 p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Asset Allocation</h3>
            {isClient && (
              <ResponsiveContainer width="100%" height={250}>
                <RechartsChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {assetAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                </RechartsChart>
              </ResponsiveContainer>
            )}
            <div className="flex justify-center gap-6 mt-6">
              {assetAllocationData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-slate-300">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className={`bg-gradient-to-br ${course.color} p-6 rounded-2xl backdrop-blur-md border border-white/10 cursor-pointer group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-white" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-5 w-5 text-yellow-300" />
                    </motion.div>
                  </div>
                  <h3 className="font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{course.description}</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-semibold text-white/80 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        className="bg-white h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 1.5 }}
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 font-semibold text-white text-sm transition-colors"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}




