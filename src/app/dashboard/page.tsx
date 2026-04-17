"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  BookOpen,
  Zap,
  BarChart3,
  Activity,
  Wallet,
  DollarSign,
  Settings2,
  Lightbulb,
  Filter,
  ExternalLink,
  Globe,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TimeRange = "3M" | "6M" | "12M";

// Mock data
const monthlyTrends = [
  { month: "Jan", balance: 45000, spending: 3500 },
  { month: "Feb", balance: 47000, spending: 3600 },
  { month: "Mar", balance: 49000, spending: 3400 },
  { month: "Apr", balance: 50500, spending: 3700 },
  { month: "May", balance: 51200, spending: 3500 },
  { month: "Jun", balance: 52400, spending: 3600 },
];

const recentTransactions = [
  {
    id: 1,
    name: "Salary Deposit",
    category: "Income",
    amount: 6000,
    date: "2024-06-15",
  },
  {
    id: 2,
    name: "Rent Payment",
    category: "Housing",
    amount: -1500,
    date: "2024-06-10",
  },
  {
    id: 3,
    name: "Grocery Store",
    category: "Food",
    amount: -185,
    date: "2024-06-12",
  },
  {
    id: 4,
    name: "Netflix Subscription",
    category: "Entertainment",
    amount: -16,
    date: "2024-06-05",
  },
  {
    id: 5,
    name: "Investment Transfer",
    category: "Savings",
    amount: 1200,
    date: "2024-06-01",
  },
];

const aiInsights = [
  {
    title: "Strong Growth Trajectory",
    description:
      "Your net worth has grown 6.7% in the last 6 months. Maintain this momentum.",
    type: "success",
  },
  {
    title: "Optimize Spending",
    description:
      "Consider reviewing subscriptions and recurring charges to boost savings rate.",
    type: "warning",
  },
  {
    title: "Investment Opportunity",
    description:
      "With your current savings rate, you could reach your $100k target in 18 months.",
    type: "info",
  },
];

export default function MergedFinancialDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Simulation States
  const [income, setIncome] = useState(6000);
  const [expenses, setExpenses] = useState(4200);
  const [initialInvestment, setInitialInvestment] = useState(52400);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(30);

  // Interactive States
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");
  const [showAIModeler, setShowAIModeler] = useState(false);
  const [simulatedSavingsGoal, setSimulatedSavingsGoal] = useState(0);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchLiveMarket();
    const interval = setInterval(fetchLiveMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMarket = async () => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
        { cache: "no-store" }
      );
      const data = await res.json();

      setMarketData([
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          price: data.bitcoin?.usd || 74710,
          change: data.bitcoin?.usd_24h_change || 1.32,
          url: "https://www.coinbase.com/price/bitcoin",
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          price: data.ethereum?.usd || 2341.25,
          change: data.ethereum?.usd_24h_change || 1.06,
          url: "https://www.coinbase.com/price/ethereum",
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          price: data.solana?.usd || 85.25,
          change: data.solana?.usd_24h_change || 2.81,
          url: "https://www.coinbase.com/price/solana",
        },
      ]);
    } catch (e) {
      console.error("Market data error:", e);
      setMarketData([
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          price: 74710,
          change: 1.32,
          url: "https://www.coinbase.com/price/bitcoin",
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          price: 2341.25,
          change: 1.06,
          url: "https://www.coinbase.com/price/ethereum",
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          price: 85.25,
          change: 2.81,
          url: "https://www.coinbase.com/price/solana",
        },
      ]);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  // Calculate key metrics
  const currentBalance = initialInvestment;
  const previousBalance = monthlyTrends[monthlyTrends.length - 2]?.balance || 49000;
  const balanceChange = currentBalance - previousBalance;
  const balanceChangePercent = ((balanceChange / previousBalance) * 100).toFixed(1);

  const totalSpending = monthlyTrends.reduce((sum, month) => sum + month.spending, 0);
  const avgMonthlySpending = (totalSpending / monthlyTrends.length).toFixed(0);

  const monthlySavings = income - expenses;
  const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;

  // Compound Interest Calculation
  const compoundData = useMemo(() => {
    const data = [];
    for (let year = 0; year <= years; year++) {
      const amount = initialInvestment * Math.pow(1 + annualReturn / 100, year);
      data.push({ year, amount: Math.round(amount) });
    }
    return data;
  }, [initialInvestment, annualReturn, years]);

  // Cash Flow Projection
  interface ProjectionPoint {
    month: string;
    balance: number;
    optimized?: number;
  }

  const projectionData = useMemo(() => {
    const monthsCount = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;
    let base = initialInvestment;
    let opt = initialInvestment;

    return Array.from({ length: monthsCount + 1 }).map((_, i): ProjectionPoint => {
      const point: ProjectionPoint = {
        month: i === 0 ? "Now" : `M${i}`,
        balance: base,
      };

      if (showAIModeler) {
        point.optimized = opt;
      }

      base += monthlySavings;
      opt += monthlySavings + simulatedSavingsGoal;
      return point;
    });
  }, [initialInvestment, monthlySavings, simulatedSavingsGoal, timeRange, showAIModeler]);

  // AI Insights
  const insights = useMemo(() => {
    const list = [];
    if (savingsRate >= 20) {
      list.push({
        title: "Healthy Savings Rate",
        type: "success",
        msg: "You're hitting the 20% golden rule.",
        val: `${savingsRate.toFixed(1)}%`,
      });
    } else {
      list.push({
        title: "Savings Alert",
        type: "warning",
        msg: "Try to reduce expenses to hit 20% savings.",
        val: `${savingsRate.toFixed(1)}%`,
      });
    }

    const yearsToMillion =
      monthlySavings > 0
        ? (1000000 - initialInvestment) / (monthlySavings * 12)
        : Infinity;
    if (yearsToMillion < 50) {
      list.push({
        title: "Millionaire Milestone",
        type: "info",
        msg: `At current rate, you'll hit $1M in ${yearsToMillion.toFixed(1)} years.`,
        val: "Target",
      });
    }

    return list;
  }, [savingsRate, monthlySavings, initialInvestment]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  } as const;

  if (!isClient) return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 selection:bg-cyan-500/30">
      {/* Animated Background */}
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

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-8 sm:py-12 z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-8 w-8 text-cyan-400" />
              </motion.div>
              FinSight Dashboard
            </h1>
            <p className="text-slate-400">Real-time financial insights and growth tracking</p>
          </div>
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <BookOpen className="h-5 w-5" />
              Learning Hub
            </motion.button>
          </Link>
        </motion.header>

        {/* Live Market Ticker */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-10 hide-scrollbar">
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <motion.div
              animate={{ rotate: isLoadingMarket ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoadingMarket ? Infinity : 0 }}
            >
              <Globe className="h-4 w-4 text-cyan-400" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Markets
            </span>
          </div>
          {marketData.map((asset) => (
            <a
              key={asset.id}
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-4 px-5 py-3 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group"
            >
              <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                {asset.symbol}
              </span>
              <span className="text-slate-300 font-mono group-hover:text-white transition-colors">
                ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-xs font-bold ${
                  asset.change >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {asset.change >= 0 ? "▲" : "▼"} {Math.abs(asset.change).toFixed(2)}%
              </span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
            </a>
          ))}
        </div>

        {/* Key Metrics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12"
        >
          {/* Current Balance */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <PiggyBank className="h-5 w-5 text-cyan-400" />
              </div>
              <motion.button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                {showBalance ? (
                  <Eye className="h-5 w-5 text-slate-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-slate-500" />
                )}
              </motion.button>
            </div>
            <p className="text-sm text-slate-400 mb-2">Total Balance</p>
            <p className="text-3xl font-black text-white mb-2">
              {showBalance ? `$${currentBalance.toLocaleString()}` : "••••••"}
            </p>
            <div className="flex items-center gap-2">
              <motion.div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                <ArrowUpRight className="h-4 w-4" />
                +${Math.abs(balanceChange).toLocaleString()}
              </motion.div>
              <span className="text-slate-500 text-sm">({balanceChangePercent}%)</span>
            </div>
          </motion.div>

          {/* Monthly Savings */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Avg Monthly Spending</p>
            <p className="text-3xl font-black text-white mb-2">
              ${parseInt(avgMonthlySpending).toLocaleString()}
            </p>
            <p className="text-slate-500 text-sm">
              {((3200 / 5500) * 100).toFixed(0)}% of income
            </p>
          </motion.div>

          {/* Savings Rate */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Current Savings Rate</p>
            <p className="text-3xl font-black text-white mb-2">
              {savingsRate.toFixed(0)}%
            </p>
            <p className="text-emerald-400 text-sm font-semibold">
              {savingsRate >= 20 ? "✓ Above 20% target" : "📈 Boost to 20%"}
            </p>
          </motion.div>

          {/* Investment Growth */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <ArrowUpRight className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Investment Growth</p>
            <p className="text-3xl font-black text-white mb-2">+12% YTD</p>
            <p className="text-slate-500 text-sm">
              $49,000 → $62,000 target
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Charts and Projections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Net Worth Trend */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-md"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Net Worth Trend</h2>
                <p className="text-slate-400">6-month projection and growth tracking</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#475569" />
                    <YAxis stroke="#475569" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#06b6d4"
                      dot={{ fill: "#06b6d4", r: 5 }}
                      strokeWidth={3}
                      name="Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Wealth Projection */}
            <motion.section
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="text-cyan-400" /> Wealth Projection
                </h2>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(["3M", "6M", "12M"] as TimeRange[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        timeRange === r
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[300px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                    <YAxis
                      stroke="#475569"
                      fontSize={12}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#06b6d4"
                      fillOpacity={1}
                      fill="url(#colorBal)"
                      strokeWidth={3}
                    />
                    {showAIModeler && (
                      <Area
                        type="monotone"
                        dataKey="optimized"
                        stroke="#10b981"
                        fill="transparent"
                        strokeDasharray="5 5"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Simulation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                <div className="space-y-6">
                  <Slider
                    label="Initial Capital"
                    val={initialInvestment}
                    sym="$"
                    min={1000}
                    max={500000}
                    step={5000}
                    onChange={setInitialInvestment}
                  />
                  <Slider
                    label="Est. Annual Return"
                    val={annualReturn}
                    sym="%"
                    min={1}
                    max={15}
                    step={0.5}
                    onChange={setAnnualReturn}
                  />
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Total After {years} Years
                    </p>
                    <p className="text-3xl font-mono font-bold text-cyan-400">
                      ${compoundData[years]?.amount.toLocaleString()}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowAIModeler(!showAIModeler)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Filter className="h-4 w-4" />{" "}
                    {showAIModeler ? "Hide AI Scenarios" : "Simulate Budget Changes"}
                  </motion.button>
                </div>
              </div>
            </motion.section>

            {/* AI Optimizer */}
            <AnimatePresence>
              {showAIModeler && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl overflow-hidden"
                >
                  <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                    <Target /> Cash Flow Optimization
                  </h3>
                  <div className="grid md:grid-cols-2 gap-10">
                    <Slider
                      label="Additional Monthly Savings"
                      val={simulatedSavingsGoal}
                      sym="$"
                      min={0}
                      max={5000}
                      step={100}
                      onChange={setSimulatedSavingsGoal}
                    />
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-1 bg-emerald-500 rounded-full" />
                      <p className="text-sm text-slate-300">
                        Saving an extra{" "}
                        <span className="text-emerald-400 font-bold">
                          ${simulatedSavingsGoal}
                        </span>{" "}
                        per month increases your net worth by
                        <span className="text-white font-bold">
                          {" "}
                          $
                          {(
                            simulatedSavingsGoal *
                            (timeRange === "3M"
                              ? 3
                              : timeRange === "6M"
                              ? 6
                              : 12)
                          ).toLocaleString()}
                        </span>{" "}
                        over this period.
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-8">
            {/* Parameters Sidebar */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Parameters
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Monthly Expenses
                  </label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Investment Years
                  </label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </motion.div>

            {/* AI Insights Card */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lightbulb className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-bold mb-6 text-cyan-400">AI Intelligence</h3>
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-white">
                        {insight.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          insight.type === "success"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : insight.type === "warning"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {insight.val}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {insight.msg}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Recent Transactions */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-3 mb-12"
        >
          <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-slate-700/50">
                      {tx.amount > 0 ? (
                        <ArrowDownRight className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{tx.name}</p>
                      <p className="text-sm text-slate-400">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.amount > 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      ${Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-md h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/learn">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors text-white font-semibold group"
                >
                  <span>📚 Learn</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-colors text-white font-semibold group"
              >
                <span>💰 Add Transaction</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors text-white font-semibold group"
              >
                <span>📊 Export Report</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors text-white font-semibold group"
              >
                <span>⚙️ Settings</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="rounded-xl bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 border border-cyan-500/30 p-8 text-center backdrop-blur-md"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Master Your Finances
          </h3>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6">
            Explore our comprehensive learning materials to understand wealth-building
            strategies, investment optimization, and tax planning.
          </p>
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Explore Learning Hub
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight className="h-5 w-5" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components

function Slider({
  label,
  val,
  sym,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  val: number;
  sym: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">
          {sym === "$" ? `$${val.toLocaleString()}` : `${val}${sym}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  );
}

