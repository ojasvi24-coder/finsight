"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  BookOpen,
  BarChart3,
  Wallet,
  Settings2,
  Lightbulb,
  Filter,
  ExternalLink,
  Globe,
  Trash2,
  Plus,
  Download,
  X,
  Sparkles,
  HelpCircle,
  ArrowRight,
  AlertTriangle,
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

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "expense";
}

interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  url: string;
  sparkline: number[];
}

/* ============================================================
   INLINE COMPONENTS (kept local to avoid import/casing issues)
   ============================================================ */

/** Tiny SVG sparkline — zero deps, animates in. */
function Sparkline({
  data,
  width = 90,
  height = 32,
  positive = true,
}: {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}) {
  if (!data || data.length < 2) return null;

  const padding = 3;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (data.length - 1);
  const toY = (v: number) =>
    height - padding - ((v - min) / range) * (height - padding * 2);

  const pathD = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${padding + i * stepX} ${toY(v)}`)
    .join(" ");

  const areaD =
    `M ${padding} ${height - padding} ` +
    data.map((v, i) => `L ${padding + i * stepX} ${toY(v)}`).join(" ") +
    ` L ${padding + (data.length - 1) * stepX} ${height - padding} Z`;

  const color = positive ? "#10b981" : "#f43f5e";
  const fadeId = `spark-${color.replace("#", "")}-${data.length}-${Math.round(
    data[0]
  )}`;

  const lastX = padding + (data.length - 1) * stepX;
  const lastY = toY(data[data.length - 1]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${fadeId})`} />
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <circle
        cx={lastX}
        cy={lastY}
        r={2.25}
        fill={color}
        stroke="#020617"
        strokeWidth={1}
      />
    </svg>
  );
}

/** "?" icon that opens a tooltip and deep-links into /learn. */
function GlossaryTooltip({
  term,
  summary,
  articleSlug,
}: {
  term: string;
  summary: string;
  articleSlug: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative ml-1 inline-flex align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-emerald-400"
        aria-label={`What is ${term}?`}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            role="tooltip"
            className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-left shadow-xl backdrop-blur-md"
          >
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              {term}
            </div>
            <p className="mb-2 text-xs leading-relaxed text-slate-300">
              {summary}
            </p>
            <Link
              href={`/learn/${articleSlug}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Learn more →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/** Fallback synthetic sparkline when the API doesn't give us real data. */
function syntheticSparkline(changePct: number, seed = 10): number[] {
  const points: number[] = [];
  const direction = changePct >= 0 ? 1 : -1;
  let base = 100;
  for (let i = 0; i < 24; i++) {
    const drift = direction * (i / 23) * Math.abs(changePct) * 0.4;
    const noise = (Math.sin(i * seed) + Math.cos(i * (seed + 0.7))) * 0.6;
    points.push(base + drift + noise);
  }
  return points;
}

/* ============================================================
   MAIN DASHBOARD
   ============================================================ */
export default function MergedFinancialDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Simulation states
  const [initialInvestment, setInitialInvestment] = useState(50000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(30);

  // Expenses only
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "2", name: "Rent Payment", category: "Housing", amount: 1500, date: "2024-06-10", type: "expense" },
    { id: "3", name: "Grocery Store", category: "Food", amount: 185, date: "2024-06-12", type: "expense" },
    { id: "4", name: "Netflix Subscription", category: "Entertainment", amount: 16, date: "2024-06-05", type: "expense" },
    { id: "6", name: "Electricity Bill", category: "Utilities", amount: 120, date: "2024-06-08", type: "expense" },
    { id: "7", name: "Gas", category: "Transportation", amount: 85, date: "2024-06-03", type: "expense" },
    { id: "8", name: "Restaurant", category: "Food", amount: 65, date: "2024-06-18", type: "expense" },
  ]);

  const [monthlyIncome, setMonthlyIncome] = useState(6000);

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    category: "Housing",
    amount: 0,
  });

  // UI states
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");
  const [showAIModeler, setShowAIModeler] = useState(false);
  const [simulatedSavingsGoal, setSimulatedSavingsGoal] = useState(0);
  const [marketData, setMarketData] = useState<MarketAsset[]>([]);
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const transactionFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    fetchLiveMarket();
    const interval = setInterval(fetchLiveMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMarket = async () => {
    setIsLoadingMarket(true);
    const fallback: MarketAsset[] = [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 74710, change: 1.32, url: "https://www.coinbase.com/price/bitcoin", sparkline: syntheticSparkline(1.32, 11) },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 2341.25, change: 1.06, url: "https://www.coinbase.com/price/ethereum", sparkline: syntheticSparkline(1.06, 17) },
      { id: "solana", name: "Solana", symbol: "SOL", price: 85.25, change: 2.81, url: "https://www.coinbase.com/price/solana", sparkline: syntheticSparkline(2.81, 23) },
    ];

    try {
      // Try the markets endpoint — it gives real 7d sparkline data in a single call.
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&sparkline=true&price_change_percentage=24h",
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("bad shape");

      const mapped: MarketAsset[] = data.map((coin: any) => {
        const rawSpark: number[] = coin?.sparkline_in_7d?.price ?? [];
        // sample ~24 points from the 7d (hourly) series for a tidy sparkline
        let spark: number[] = [];
        if (rawSpark.length > 24) {
          const step = Math.floor(rawSpark.length / 24);
          for (let i = 0; i < rawSpark.length; i += step) spark.push(rawSpark[i]);
          spark = spark.slice(-24);
        } else {
          spark = rawSpark;
        }
        const change = coin?.price_change_percentage_24h ?? 0;
        if (spark.length < 2) spark = syntheticSparkline(change);
        return {
          id: coin.id,
          name: coin.name,
          symbol: (coin.symbol || "").toUpperCase(),
          price: coin.current_price,
          change,
          url: `https://www.coinbase.com/price/${coin.id}`,
          sparkline: spark,
        };
      });

      setMarketData(mapped.length ? mapped : fallback);
    } catch (e) {
      console.error("Market data error:", e);
      setMarketData(fallback);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  // Metrics
  const totalExpenses = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalMonthlyIncome = monthlyIncome;

  const netCashFlow = useMemo(
    () => totalMonthlyIncome - totalExpenses,
    [totalMonthlyIncome, totalExpenses]
  );

  const currentBalance = useMemo(
    () => initialInvestment + netCashFlow,
    [initialInvestment, netCashFlow]
  );

  const avgMonthlySpending = useMemo(() => {
    if (transactions.length === 0) return 0;
    return totalExpenses / transactions.length;
  }, [totalExpenses, transactions]);

  const spendingPercentOfIncome = useMemo(() => {
    if (totalMonthlyIncome === 0) return 0;
    return (totalExpenses / totalMonthlyIncome) * 100;
  }, [totalExpenses, totalMonthlyIncome]);

  const savingsRate = useMemo(() => {
    if (totalMonthlyIncome === 0) return 0;
    return (netCashFlow / totalMonthlyIncome) * 100;
  }, [netCashFlow, totalMonthlyIncome]);

  const previousBalance = initialInvestment;
  const balanceChange = currentBalance - previousBalance;
  const balanceChangePercent =
    previousBalance > 0
      ? ((balanceChange / previousBalance) * 100).toFixed(1)
      : "0";
  const balancePositive = balanceChange >= 0;

  const monthlyTrendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    let balance = initialInvestment;
    const monthlyNetFlow = netCashFlow / months.length;
    return months.map((month) => {
      balance += monthlyNetFlow;
      return {
        month,
        balance: Math.round(balance),
        spending: Math.round(totalExpenses / months.length),
      };
    });
  }, [initialInvestment, netCashFlow, totalExpenses]);

  const compoundData = useMemo(() => {
    const data = [];
    for (let year = 0; year <= years; year++) {
      const amount = currentBalance * Math.pow(1 + annualReturn / 100, year);
      data.push({ year, amount: Math.round(amount) });
    }
    return data;
  }, [currentBalance, annualReturn, years]);

  const investmentTarget = useMemo(() => {
    return Math.round(currentBalance * 1.25);
  }, [currentBalance]);

  const monthlySavings = netCashFlow;

  interface ProjectionPoint {
    month: string;
    balance: number;
    optimized?: number;
  }

  const projectionData = useMemo(() => {
    const monthsCount = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;
    let base = currentBalance;
    let opt = currentBalance;
    return Array.from({ length: monthsCount + 1 }).map((_, i): ProjectionPoint => {
      const point: ProjectionPoint = {
        month: i === 0 ? "Now" : `M${i}`,
        balance: base,
      };
      if (showAIModeler) point.optimized = opt;
      base += monthlySavings;
      opt += monthlySavings + simulatedSavingsGoal;
      return point;
    });
  }, [currentBalance, monthlySavings, simulatedSavingsGoal, timeRange, showAIModeler]);

  // AI Insights (unchanged logic, same data model)
  const insights = useMemo(() => {
    const list: { title: string; type: "warning" | "success" | "info"; msg: string; val: string }[] = [];

    if (totalMonthlyIncome === 0) {
      list.push({ title: "No Income Recorded", type: "warning", msg: "Set your monthly income to track financial health.", val: "Action" });
    } else if (spendingPercentOfIncome > 80) {
      list.push({ title: "High Spending Alert", type: "warning", msg: `You're spending ${Math.round(spendingPercentOfIncome)}% of income. Aim for under 70%.`, val: `${Math.round(spendingPercentOfIncome)}%` });
    } else if (spendingPercentOfIncome > 60) {
      list.push({ title: "Spending Alert", type: "warning", msg: "Consider reducing spending to increase savings rate.", val: `${Math.round(spendingPercentOfIncome)}%` });
    } else {
      list.push({ title: "Healthy Spending", type: "success", msg: "You're maintaining a good spending balance.", val: `${Math.round(spendingPercentOfIncome)}%` });
    }

    if (savingsRate >= 20) {
      list.push({ title: "Healthy Savings Rate", type: "success", msg: "You're hitting the 20% golden rule. Keep it up.", val: `${savingsRate.toFixed(1)}%` });
    } else if (savingsRate > 0) {
      list.push({ title: "Savings Progress", type: "warning", msg: `Current savings rate is ${savingsRate.toFixed(1)}%. Target 20% for wealth building.`, val: `${savingsRate.toFixed(1)}%` });
    } else {
      list.push({ title: "Deficit Alert", type: "warning", msg: "You're spending more than earning. Adjust expenses or increase income.", val: `${savingsRate.toFixed(1)}%` });
    }

    const yearsToMillion =
      monthlySavings > 0 ? (1000000 - currentBalance) / (monthlySavings * 12) : Infinity;
    if (yearsToMillion < 50 && yearsToMillion > 0) {
      list.push({ title: "Millionaire Milestone", type: "info", msg: `At current rate, you'll hit $1M in ${yearsToMillion.toFixed(1)} years.`, val: "Target" });
    }

    const projectedGain = compoundData[years]?.amount - currentBalance || 0;
    list.push({
      title: "Wealth Projection",
      type: "info",
      msg: `With ${annualReturn}% annual return, gain $${Math.abs(projectedGain).toLocaleString()} in ${years} years.`,
      val: `+${annualReturn}%`,
    });

    return list;
  }, [savingsRate, spendingPercentOfIncome, monthlySavings, currentBalance, years, annualReturn, compoundData, totalMonthlyIncome]);

  // Top insight = first warning, else first insight
  const topInsight = useMemo(() => {
    return insights.find((i) => i.type === "warning") ?? insights[0];
  }, [insights]);

  // Handlers
  const handleAddTransaction = () => {
    if (!newTransaction.name || newTransaction.amount === 0) return;
    const id = Date.now().toString();
    setTransactions([
      ...transactions,
      {
        id,
        name: newTransaction.name,
        category: newTransaction.category,
        amount: Math.abs(newTransaction.amount),
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      },
    ]);
    setNewTransaction({ name: "", category: "Housing", amount: 0 });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleExportReport = () => {
    const reportData = [
      ["FinSight Financial Report"],
      ["Generated:", new Date().toLocaleDateString()],
      [],
      ["SUMMARY"],
      ["Monthly Income", `$${totalMonthlyIncome.toLocaleString()}`],
      ["Total Expenses", `$${totalExpenses.toLocaleString()}`],
      ["Monthly Savings", `$${netCashFlow.toLocaleString()}`],
      ["Savings Rate", `${savingsRate.toFixed(1)}%`],
      ["Current Balance", `$${currentBalance.toLocaleString()}`],
      [],
      ["EXPENSES BREAKDOWN"],
      ["Description", "Category", "Amount", "Date"],
      ...transactions.map((t) => [t.name, t.category, `$${t.amount.toLocaleString()}`, t.date]),
      [],
      ["PROJECTIONS"],
      ["Initial Investment", `$${initialInvestment.toLocaleString()}`],
      ["Annual Return", `${annualReturn}%`],
      ["Projected Value (1 Year)", `$${compoundData[1]?.amount.toLocaleString()}`],
      ["Projected Value (5 Years)", `$${compoundData[5]?.amount.toLocaleString()}`],
      ["Projected Value (10 Years)", `$${compoundData[10]?.amount.toLocaleString()}`],
    ];

    const csvContent = reportData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", "finsight-report.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAddTransactionClick = () => {
    transactionFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  } as const;

  if (!isClient) return <div className="min-h-screen bg-slate-950" />;

  /* ============================================================
     CARD BASE STYLES (toned down — subtle cards, #1E1E2E feel)
     ============================================================ */
  const cardBase =
    "rounded-2xl border border-slate-800 bg-[#1E1E2E]/80 backdrop-blur-sm";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      {/* Subtle ambient background — toned down from previous neon glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_10%_0%,rgba(16,185,129,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_90%_20%,rgba(6,182,212,0.04),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        {/* ---------- GREETING HEADER ---------- */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-slate-400">
              {getGreeting()}, Jordan
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Here's your financial snapshot.
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Learning Hub — neutral button, not emerald gradient */}
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-900"
            >
              <BookOpen className="h-4 w-4 text-slate-400" />
              Learning Hub
            </motion.button>
          </Link>
        </motion.header>

        {/* ---------- LIVE MARKET TICKER (with sparklines) ---------- */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="flex flex-shrink-0 items-center gap-2 rounded-xl border border-slate-800 bg-[#1E1E2E]/80 px-4 py-3">
            <motion.div
              animate={{ rotate: isLoadingMarket ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoadingMarket ? Infinity : 0 }}
            >
              <Globe className="h-4 w-4 text-slate-400" />
            </motion.div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Live Markets
            </span>
          </div>

          {marketData.map((asset) => {
            const positive = asset.change >= 0;
            return (
              <a
                key={asset.id}
                href={asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-shrink-0 items-center gap-4 rounded-xl border border-slate-800 bg-[#1E1E2E]/80 px-4 py-3 transition-colors hover:border-slate-700"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {asset.symbol}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    $
                    {asset.price.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Sparkline data={asset.sparkline} positive={positive} width={70} height={28} />
                <div className="flex flex-col items-end">
                  <span
                    className={`flex items-center gap-0.5 text-xs font-bold ${
                      positive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {positive ? "+" : ""}
                    {asset.change.toFixed(2)}%
                  </span>
                  <ExternalLink className="mt-1 h-3 w-3 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </a>
            );
          })}
        </div>

        {/* ---------- HERO: TOTAL BALANCE + TOP INSIGHT ---------- */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Hero balance — the BIGGEST thing on the page */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`${cardBase} relative overflow-hidden p-7 lg:col-span-2`}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <Wallet className="h-4 w-4 text-slate-500" />
                Total Balance
                <GlossaryTooltip
                  term="Net Worth"
                  summary="Your assets minus liabilities — the single best scoreboard for long-term financial progress."
                  articleSlug="compound-interest"
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    balancePositive
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {balancePositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {balancePositive ? "+" : ""}
                  {balanceChangePercent}%
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800/50 hover:text-slate-300"
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* HERO NUMBER */}
            <div className="mt-3">
              <div className="font-mono text-5xl font-bold tracking-tight text-white sm:text-6xl">
                {showBalance ? `$${currentBalance.toLocaleString()}` : "••••••"}
              </div>
              <div
                className={`mt-2 text-sm font-semibold ${
                  balancePositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {balancePositive ? "+" : "-"}$
                {Math.abs(balanceChange).toLocaleString()} this period
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-slate-800 pt-5">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Monthly Income
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-white">
                  ${totalMonthlyIncome.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Expenses
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-white">
                  ${totalExpenses.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Savings Rate
                  <GlossaryTooltip
                    term="Savings Rate"
                    summary="Share of your net income you keep. 20%+ is the baseline for real wealth accumulation."
                    articleSlug="50-30-20-framework"
                  />
                </div>
                <div
                  className={`mt-1 font-mono text-lg font-bold ${
                    savingsRate >= 20
                      ? "text-emerald-400"
                      : savingsRate > 0
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {savingsRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </motion.section>

          {/* Top Insight of the Day */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-[#1E1E2E]/80 p-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                AI Insight of the Day
              </span>
            </div>

            <h3 className="mb-2 text-lg font-bold leading-snug text-white">
              {topInsight?.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              {topInsight?.msg}
            </p>

            <button
              onClick={() => setShowAIModeler(true)}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Simulate changes
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.aside>
        </div>

        {/* ---------- SECONDARY METRICS (compact cards) ---------- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Avg Monthly Spending */}
          <motion.div variants={itemVariants} className={`${cardBase} p-5`}>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              <Target className="h-4 w-4 text-slate-500" />
              Avg Monthly Spending
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              ${Math.round(avgMonthlySpending).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {Math.round(spendingPercentOfIncome)}% of income
            </p>
          </motion.div>

          {/* Savings Rate */}
          <motion.div variants={itemVariants} className={`${cardBase} p-5`}>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              Current Savings Rate
            </div>
            <div
              className={`font-mono text-2xl font-bold ${
                savingsRate >= 20
                  ? "text-emerald-400"
                  : savingsRate > 0
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {savingsRate.toFixed(1)}%
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {savingsRate >= 20
                ? "Above 20% target"
                : savingsRate > 0
                ? "Push toward 20%"
                : "Negative rate"}
            </p>
          </motion.div>

          {/* Investment Growth */}
          <motion.div variants={itemVariants} className={`${cardBase} p-5`}>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
              Est. Investment Growth
            </div>
            <div className="font-mono text-2xl font-bold text-emerald-400">
              +{annualReturn}%
            </div>
            <p className="mt-1 text-xs text-slate-500">
              ${currentBalance.toLocaleString()} → $
              {investmentTarget.toLocaleString()} target
            </p>
          </motion.div>
        </motion.div>

        {/* ---------- MAIN GRID: Charts + Sidebar ---------- */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="space-y-5 lg:col-span-2">
            {/* Net Worth Trend */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className={`${cardBase} p-6`}
            >
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Net Worth Trend</h2>
                <p className="text-xs text-slate-500">
                  6-month projection and growth tracking
                </p>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) =>
                        `$${Number(value).toLocaleString()}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#10b981"
                      dot={{ fill: "#10b981", r: 4 }}
                      strokeWidth={2.5}
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
              className={`${cardBase} p-6`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                  <BarChart3 className="h-4 w-4 text-slate-400" />
                  Wealth Projection
                </h2>
                <div className="flex rounded-lg border border-slate-800 bg-slate-950/60 p-1">
                  {(["3M", "6M", "12M"] as TimeRange[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                        timeRange === r
                          ? "bg-slate-800 text-white"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) =>
                        `$${Number(value).toLocaleString()}`
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorBal)"
                      strokeWidth={2.5}
                    />
                    {showAIModeler && (
                      <Area
                        type="monotone"
                        dataKey="optimized"
                        stroke="#06b6d4"
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Simulation Controls */}
              <div className="grid grid-cols-1 gap-6 border-t border-slate-800 pt-6 md:grid-cols-2">
                <div className="space-y-5">
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
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Total After {years} Years
                    </p>
                    <p className="mt-1 font-mono text-2xl font-bold text-white">
                      ${compoundData[years]?.amount.toLocaleString()}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowAIModeler(!showAIModeler)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_-8px_rgba(16,185,129,0.6)] transition-all hover:bg-emerald-400"
                  >
                    <Filter className="h-4 w-4" />
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
                  className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-6"
                >
                  <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-emerald-400">
                    <Target className="h-4 w-4" /> Cash Flow Optimization
                  </h3>
                  <div className="grid gap-8 md:grid-cols-2">
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
                      <div className="h-12 w-1 rounded-full bg-emerald-500" />
                      <p className="text-sm leading-relaxed text-slate-300">
                        Saving an extra{" "}
                        <span className="font-bold text-emerald-400">
                          ${simulatedSavingsGoal}
                        </span>{" "}
                        per month increases net worth by{" "}
                        <span className="font-bold text-white">
                          $
                          {(
                            simulatedSavingsGoal *
                            (timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12)
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

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5">
            {/* Parameters */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className={`${cardBase} p-5`}
            >
              <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300">
                <Settings2 className="h-4 w-4 text-slate-500" /> Parameters
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 font-mono text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Initial Investment
                  </label>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 font-mono text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Investment Years
                  </label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 font-mono text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* AI Insights list */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className={`${cardBase} relative overflow-hidden p-5`}
            >
              <div className="absolute right-4 top-4 opacity-5">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                AI Intelligence
              </h3>
              <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                {insights.map((insight, i) => {
                  const isWarning = insight.type === "warning";
                  const isSuccess = insight.type === "success";
                  const pill = isWarning
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                    : isSuccess
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                    : "bg-slate-500/15 text-slate-300 border-slate-500/20";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-lg border border-slate-800 bg-slate-950/40 p-3.5"
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white">
                          {insight.title}
                        </h4>
                        <span
                          className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${pill}`}
                        >
                          {insight.val}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {insight.msg}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </aside>
        </div>

        {/* ---------- EXPENSES + QUICK ACTIONS ---------- */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 lg:grid-cols-3"
        >
          {/* Expenses */}
          <div
            ref={transactionFormRef}
            className={`${cardBase} p-6 lg:col-span-2`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent Expenses</h2>
              <span className="text-xs text-slate-500">
                {transactions.length} items · ${totalExpenses.toLocaleString()}
              </span>
            </div>

            {/* Add form */}
            <div className="mb-6 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Plus className="h-3.5 w-3.5" /> Add Expense
              </h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newTransaction.name}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, name: e.target.value })
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                />
                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, category: e.target.value })
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                >
                  <option value="Housing">Housing</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: Number(e.target.value),
                    })
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 font-mono text-sm text-white outline-none transition-colors focus:border-emerald-500/50"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddTransaction}
                  className="rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                >
                  Add
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No expenses yet. Add one to get started.
                </p>
              ) : (
                transactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/30 p-3.5 transition-colors hover:border-slate-700"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10">
                        <ArrowDownRight className="h-4 w-4 text-rose-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {tx.name}
                        </p>
                        <p className="text-xs text-slate-500">{tx.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold text-rose-400">
                          -${tx.amount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-500">{tx.date}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick actions — toned down, all neutral, primary is emerald */}
          <div className={`${cardBase} h-fit p-6`}>
            <h2 className="mb-4 text-lg font-bold text-white">Quick Actions</h2>
            <div className="space-y-2">
              {/* Primary action — emerald */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddTransactionClick}
                className="group flex w-full items-center justify-between gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>

              {/* Secondary — neutral */}
              <Link href="/learn">
                <motion.button
                  whileHover={{ x: 2 }}
                  className="group mt-2 flex w-full items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    Learning Hub
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ x: 2 }}
                onClick={handleExportReport}
                className="group flex w-full items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-900"
              >
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-slate-400" />
                  Export Report
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5" />
              </motion.button>

              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => setShowSettingsModal(true)}
                className="group flex w-full items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-900"
              >
                <span className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-slate-400" />
                  Settings
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </div>

            {/* Small educational nudge */}
            <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                <Lightbulb className="h-3 w-3" /> Tip
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                New to asset allocation? Our{" "}
                <Link
                  href="/learn/the-art-of-asset-allocation"
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  7-min lesson
                </Link>{" "}
                explains the 70/20/10 portfolio.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---------- SETTINGS MODAL ---------- */}
        <AnimatePresence>
          {showSettingsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setShowSettingsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#1E1E2E] p-6 shadow-2xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Settings</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettingsModal(false)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    aria-label="Close settings"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Dashboard Settings
                    </h3>

                    <div className="space-y-3">
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={showBalance}
                          onChange={(e) => setShowBalance(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-300">
                          Show balance on hero card
                        </span>
                      </label>

                      <div className="border-t border-slate-800 pt-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Default Return Rate
                        </p>
                        <Slider
                          label=""
                          val={annualReturn}
                          sym="%"
                          min={1}
                          max={15}
                          step={0.5}
                          onChange={setAnnualReturn}
                        />
                      </div>

                      <div className="border-t border-slate-800 pt-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Projection Years
                        </p>
                        <Slider
                          label=""
                          val={years}
                          sym=""
                          min={5}
                          max={50}
                          step={1}
                          onChange={setYears}
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowSettingsModal(false)}
                    className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                  >
                    Save Settings
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- BOTTOM CTA ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-slate-800 bg-[#1E1E2E]/80 p-8 text-center backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Master Your Finances
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            Explore our lessons on wealth-building, investment optimization, and
            tax-efficient strategies.
          </p>
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_-8px_rgba(16,185,129,0.6)] transition-all hover:bg-emerald-400"
            >
              Explore Learning Hub
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   Slider helper (unchanged API)
   ============================================================ */
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
    <div className="space-y-2.5">
      {label && (
        <div className="flex items-baseline justify-between text-xs font-semibold">
          <span className="text-slate-400">{label}</span>
          <span className="font-mono text-sm font-bold text-white">
            {sym === "$" ? `$${val.toLocaleString()}` : `${val}${sym}`}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-500"
      />
    </div>
  );
}

