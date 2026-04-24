"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  Activity,
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
import { useUser } from "@/lib/user";
import MarketPulse from "@/components/MarketPulse";
import AnimatedNumber from "@/components/AnimatedNumber";

// Opt out of static prerendering — useSearchParams requires dynamic rendering.
export const dynamic = "force-dynamic";

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
function MergedFinancialDashboard() {
  const { firstName, hasProfile, name: userName, email: userEmail, updateUser } = useUser();
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

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
  const transactionFormRef = useRef<HTMLDivElement>(null);
  const aiModelerRef = useRef<HTMLDivElement>(null);
  const wealthProjectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    fetchLiveMarket();
    const interval = setInterval(fetchLiveMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  // Legacy redirect: ?settings=open now opens the global profile modal instead
  useEffect(() => {
    if (searchParams?.get("settings") === "open") {
      router.replace("/dashboard?profile=open", { scroll: false });
    }
  }, [searchParams, router]);

  // Sync the settings drafts with the stored profile whenever it loads
  useEffect(() => {
    setNameDraft(userName);
  }, [userName]);

  useEffect(() => {
    setEmailDraft(userEmail);
  }, [userEmail]);

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

    // Historical months — actual balance, no aiPath
    const historical = months.map((month) => {
      balance += monthlyNetFlow;
      return {
        month,
        balance: Math.round(balance),
        aiPath: null as number | null,
        spending: Math.round(totalExpenses / months.length),
      };
    });

    // AI Probabilistic Path — next 30 days (1 month) forward projection
    // Uses current savings trajectory + expected return, with a small uncertainty band
    const monthlyReturn = annualReturn / 100 / 12;
    const projectedNext = balance * (1 + monthlyReturn) + monthlyNetFlow;

    // Overlap the current month with aiPath so the dotted line visually connects
    const lastHistorical = historical[historical.length - 1];
    lastHistorical.aiPath = lastHistorical.balance;

    return [
      ...historical,
      {
        month: "Jul (AI)",
        balance: null as any,
        aiPath: Math.round(projectedNext),
        spending: 0,
      },
    ];
  }, [initialInvestment, netCashFlow, totalExpenses, annualReturn]);

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

  // Real YTD portfolio growth: actual delta over initial capital.
  // Reacts live when the user edits income, expenses, or initial investment.
  const portfolioGrowthPct = useMemo(() => {
    if (initialInvestment === 0) return 0;
    return ((currentBalance - initialInvestment) / initialInvestment) * 100;
  }, [currentBalance, initialInvestment]);

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

  // "Daily Impact" driver — explains the balance change in plain language
  const balanceDriver = useMemo(() => {
    if (netCashFlow === 0) return "Income and expenses balanced this period.";
    if (netCashFlow > 0) {
      const topCategory = transactions.length > 0 ? "savings from your income" : "savings";
      return `Up $${Math.abs(balanceChange).toLocaleString()} — driven by your monthly ${topCategory}.`;
    }
    // find biggest expense category to name in the narrative
    const byCat: Record<string, number> = {};
    transactions.forEach((t) => {
      byCat[t.category] = (byCat[t.category] || 0) + t.amount;
    });
    const [topCat] = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0] || [];
    const because = topCat ? `largely driven by ${topCat.toLowerCase()} spending` : "driven by current expenses";
    return `Down $${Math.abs(balanceChange).toLocaleString()} — ${because}.`;
  }, [netCashFlow, balanceChange, transactions]);

  // Humanized version of the top insight's narrative
  const topInsightNarrative = useMemo(() => {
    if (!topInsight) return "";
    if (topInsight.type === "warning") {
      return `We noticed ${topInsight.msg.charAt(0).toLowerCase()}${topInsight.msg.slice(1)} Click below to see what a small change could do.`;
    }
    return topInsight.msg;
  }, [topInsight]);

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

  // Open the global Profile modal from anywhere in the dashboard
  const openProfileModal = () => {
    router.push("/dashboard?profile=open");
  };

  // Click target for the "Simulate changes" arrow on the Top Insight card.
  // Opens the AI modeler (if closed) and scrolls it into view.
  const handleSimulateChangesClick = () => {
    if (!showAIModeler) setShowAIModeler(true);
    // Give React a beat to render the newly-expanded section before scrolling
    setTimeout(() => {
      aiModelerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
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
              {getGreeting()}
              {hasProfile ? `, ${firstName}` : ""}
              {hasProfile && (
                <span className="text-slate-500">
                  {" · "}
                  {balancePositive
                    ? "your portfolio is steady today"
                    : "a few things need a look"}
                </span>
              )}
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

          {/* Guide — neutral button, not emerald gradient */}
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-900"
            >
              <BookOpen className="h-4 w-4 text-slate-400" />
              Guide
            </motion.button>
          </Link>
        </motion.header>

        {/* ---------- FIRST-TIME USER EMPTY STATE ---------- */}
        {!hasProfile && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Welcome to FinSight — let's personalize this.
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Add your name so your dashboard greets you properly. Takes 10
                  seconds.
                </p>
              </div>
            </div>
            <button
              onClick={() => openProfileModal()}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              Set up profile
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}

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
                {showBalance ? (
                  <AnimatedNumber value={currentBalance} prefix="$" duration={800} />
                ) : (
                  "••••••"
                )}
              </div>
              {/* Daily Impact — narrative "so what?" line */}
              <div
                className={`mt-2 text-sm font-medium ${
                  balancePositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {balancePositive ? "+" : "-"}${Math.abs(balanceChange).toLocaleString()}
                {" · "}
                {balancePositive ? "+" : ""}{balanceChangePercent}%
              </div>
              <p className="mt-1 text-xs text-slate-400">{balanceDriver}</p>
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
              {topInsightNarrative}
            </p>

            <button
              onClick={handleSimulateChangesClick}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-300 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:text-emerald-200"
            >
              Simulate changes
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
          {/* Capital Outflow (formerly Avg Monthly Spending) */}
          <motion.div variants={itemVariants} className={`${cardBase} p-5`}>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              <Target className="h-4 w-4 text-slate-500" />
              Capital Outflow · Monthly
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

          {/* Investment Growth — shows ACTUAL computed balance change */}
          <motion.button
            variants={itemVariants}
            onClick={() => {
              wealthProjectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className={`${cardBase} group p-5 text-left transition-all hover:border-emerald-500/30 hover:shadow-[0_0_25px_-10px_rgba(16,185,129,0.5)]`}
            aria-label="Open wealth projection simulator"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
                Portfolio Growth
              </div>
              <ArrowRight className="h-4 w-4 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-400" />
            </div>
            <div
              className={`font-mono text-2xl font-bold ${
                portfolioGrowthPct >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {portfolioGrowthPct >= 0 ? "+" : ""}
              {portfolioGrowthPct.toFixed(2)}%
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {portfolioGrowthPct >= 0 ? "+" : "-"}$
              {Math.abs(currentBalance - initialInvestment).toLocaleString()} · tap to simulate
            </p>
          </motion.button>
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
                <h2 className="text-lg font-bold text-white">Asset Architecture</h2>
                <p className="text-xs text-slate-500">
                  6-month historical path with AI probabilistic projection
                </p>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ stroke: "#10b981", strokeDasharray: "4 4", strokeOpacity: 0.5 }}
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "8px",
                        backdropFilter: "blur(8px)",
                      }}
                      labelStyle={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 4 }}
                      formatter={(value: any, name: any) => [
                        `$${Number(value).toLocaleString()}`,
                        name === "balance" ? "Balance" : "Spending",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#10b981"
                      dot={{ fill: "#10b981", r: 4 }}
                      activeDot={{ r: 6, fill: "#10b981", stroke: "#020617", strokeWidth: 2 }}
                      strokeWidth={2.5}
                      name="Balance"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="aiPath"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      strokeDasharray="6 4"
                      dot={{ fill: "#06b6d4", r: 3 }}
                      activeDot={{ r: 5, fill: "#06b6d4", stroke: "#020617", strokeWidth: 2 }}
                      name="AI Probabilistic Path"
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                💡 Hover over the chart to see exact balance at each month.
              </p>
            </motion.div>

            {/* Wealth Projection */}
            <motion.section
              ref={wealthProjectionRef}
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
                      cursor={{ stroke: "#10b981", strokeDasharray: "4 4", strokeOpacity: 0.5 }}
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "8px",
                        backdropFilter: "blur(8px)",
                      }}
                      labelStyle={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 4 }}
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
                      activeDot={{ r: 6, fill: "#10b981", stroke: "#020617", strokeWidth: 2 }}
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
            <div ref={aiModelerRef}>
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

        {/* ---------- MARKET PULSE (Fear / Greed) ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className={`${cardBase} p-6`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <Activity className="h-4 w-4 text-slate-400" />
                Market Pulse
              </h2>
              <p className="text-xs text-slate-500">
                Crowd sentiment from price action across major assets
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Updated now
            </span>
          </div>
          <FearGreedMeter marketData={marketData} />
        </motion.section>

        {/* ---------- RISK HEATMAP + MARKET PULSE + SCENARIO SLIDER ---------- */}
        <div className="grid gap-5 lg:grid-cols-6">
          {/* Risk Heatmap */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className={`${cardBase} p-6 lg:col-span-3`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Portfolio Risk Map</h2>
                <p className="text-xs text-slate-500">
                  Sectors colored by volatility — darker red = higher risk today
                </p>
              </div>
              <Link
                href="/learn/the-art-of-asset-allocation"
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Manage risk
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <RiskHeatmap />
          </motion.section>

          {/* Market Pulse — Fear/Greed sentiment gauge */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className={`${cardBase} flex flex-col items-center justify-center p-6 lg:col-span-1`}
          >
            <MarketPulse />
            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
              Aggregate sentiment from volatility, momentum, and flow data.
            </p>
          </motion.section>

          {/* What-If Scenario Slider */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className={`${cardBase} p-6 lg:col-span-2`}
          >
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <Filter className="h-4 w-4 text-slate-400" />
                What-If Scenario
              </h2>
              <p className="text-xs text-slate-500">
                Turn the dashboard into a windshield.
              </p>
            </div>
            <ScenarioSlider
              currentBalance={currentBalance}
              currentMonthlySavings={monthlySavings}
              annualReturn={annualReturn}
            />
          </motion.section>
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
              <h2 className="text-lg font-bold text-white">Ledger Events</h2>
              <span className="text-xs text-slate-500">
                {transactions.length} events · ${totalExpenses.toLocaleString()}
              </span>
            </div>

            {/* Add form */}
            <div className="mb-6 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Plus className="h-3.5 w-3.5" /> Add Ledger Event
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
                    Open Guide
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
                onClick={() => openProfileModal()}
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
              Explore the Guide
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

/* ============================================================
   Risk Heatmap — portfolio sector volatility grid
   ============================================================ */
function RiskHeatmap() {
  // In production, derive these from real portfolio allocation + market data.
  const sectors = [
    { name: "Tech", weight: 28, risk: 72, change: -1.2 },
    { name: "Finance", weight: 18, risk: 45, change: 0.3 },
    { name: "Healthcare", weight: 14, risk: 32, change: 0.8 },
    { name: "Energy", weight: 10, risk: 68, change: -2.1 },
    { name: "Consumer", weight: 12, risk: 28, change: 0.5 },
    { name: "Industrials", weight: 8, risk: 38, change: 0.1 },
    { name: "Real Estate", weight: 6, risk: 52, change: -0.4 },
    { name: "Bonds", weight: 4, risk: 12, change: 0.2 },
  ];

  // Risk → color: green (low) → amber (med) → red (high)
  const riskColor = (risk: number) => {
    if (risk < 30) return "bg-emerald-500/70";
    if (risk < 50) return "bg-emerald-600/60";
    if (risk < 65) return "bg-amber-500/70";
    if (risk < 75) return "bg-orange-500/75";
    return "bg-rose-500/80";
  };

  const riskLabel = (risk: number) => {
    if (risk < 30) return "Low";
    if (risk < 50) return "Moderate";
    if (risk < 65) return "Elevated";
    return "High";
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {sectors.map((s) => {
          const positive = s.change >= 0;
          return (
            <div
              key={s.name}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-lg border border-slate-800 p-3 transition-transform hover:scale-[1.02] ${riskColor(
                s.risk
              )}`}
              title={`${s.name}: ${riskLabel(s.risk)} risk · ${s.weight}% of portfolio`}
            >
              <div className="absolute inset-0 bg-slate-950/55" />
              <div className="relative">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-200/90">
                  {s.name}
                </div>
                <div className="mt-0.5 font-mono text-sm font-bold text-white">
                  {s.weight}%
                </div>
              </div>
              <div className="relative mt-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-100/80">
                  {riskLabel(s.risk)}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    positive ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {positive ? "+" : ""}
                  {s.change.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-3 text-[10px] text-slate-400">
        <span className="font-semibold uppercase tracking-wider">Risk scale</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/70" /> Low
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/70" /> Moderate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-orange-500/75" /> Elevated
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/80" /> High
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   Scenario Slider — "If I invest $X more/month, when do I hit $Y?"
   ============================================================ */
function ScenarioSlider({
  currentBalance,
  currentMonthlySavings,
  annualReturn,
}: {
  currentBalance: number;
  currentMonthlySavings: number;
  annualReturn: number;
}) {
  const [extra, setExtra] = useState(500);
  const [goal, setGoal] = useState(100000);

  // Solve for number of months with monthly compounding.
  // FV = PV*(1+r)^n + PMT*[((1+r)^n - 1)/r]
  // We just iterate — simpler, and the numbers are small.
  const { monthsToGoal, totalContribution, gained } = (() => {
    const r = annualReturn / 100 / 12;
    const pmt = currentMonthlySavings + extra;
    let balance = currentBalance;
    let months = 0;
    const cap = 12 * 80; // 80 year sanity cap
    if (balance >= goal) {
      return { monthsToGoal: 0, totalContribution: 0, gained: 0 };
    }
    while (balance < goal && months < cap) {
      balance = balance * (1 + r) + pmt;
      months++;
    }
    const reached = months < cap;
    return {
      monthsToGoal: reached ? months : Infinity,
      totalContribution: pmt * months,
      gained: balance - (currentBalance + pmt * months),
    };
  })();

  const years = monthsToGoal / 12;
  const displayTime = !isFinite(monthsToGoal)
    ? "80+ years"
    : years >= 1
    ? `${years.toFixed(1)} years`
    : `${monthsToGoal} months`;

  return (
    <div className="space-y-5">
      <Slider
        label="Extra monthly contribution"
        val={extra}
        sym="$"
        min={0}
        max={3000}
        step={50}
        onChange={setExtra}
      />
      <Slider
        label="Your goal"
        val={goal}
        sym="$"
        min={10000}
        max={2000000}
        step={5000}
        onChange={setGoal}
      />

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
          You'd hit your goal in
        </div>
        <div className="mt-1 font-mono text-2xl font-bold text-white">
          {displayTime}
        </div>
        {isFinite(monthsToGoal) && (
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Saving{" "}
            <span className="font-bold text-emerald-400">
              ${(currentMonthlySavings + extra).toLocaleString()}
            </span>{" "}
            /month at {annualReturn}% return. Investment gains of{" "}
            <span className="font-bold text-emerald-400">
              ${Math.max(0, Math.round(gained)).toLocaleString()}
            </span>{" "}
            come from compounding.
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Suspense wrapper — required because MergedFinancialDashboard
   calls useSearchParams() to handle ?profile=open deep links.
   Next.js 16 refuses to prerender components using that hook
   without a parent Suspense boundary.
   ============================================================ */
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950">
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
            <div className="h-8 w-48 animate-pulse rounded bg-slate-800/60" />
            <div className="h-40 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40" />
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40" />
              <div className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40" />
              <div className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40" />
            </div>
          </div>
        </div>
      }
    >
      <MergedFinancialDashboard />
    </Suspense>
  );
}

/* ============================================================
   Fear & Greed Meter — glowing neon needle on a semicircle
   ============================================================ */
function FearGreedMeter({ marketData }: { marketData: any[] }) {
  // Compute sentiment from average 24h change across tracked markets.
  // Scale roughly: +3% avg → 90 (extreme greed), 0% → 50 (neutral), -3% → 10 (extreme fear)
  const avgChange =
    marketData.length > 0
      ? marketData.reduce((s, m) => s + (m.change || 0), 0) / marketData.length
      : 0;
  const score = Math.max(0, Math.min(100, 50 + avgChange * 13));

  const label =
    score < 25
      ? "Extreme Fear"
      : score < 45
      ? "Fear"
      : score < 55
      ? "Neutral"
      : score < 75
      ? "Greed"
      : "Extreme Greed";

  const color =
    score < 25
      ? "#f43f5e"
      : score < 45
      ? "#f97316"
      : score < 55
      ? "#eab308"
      : score < 75
      ? "#10b981"
      : "#22c55e";

  // Semicircle from 180° (left) to 0° (right), needle angle based on score
  const angle = 180 - (score / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const cx = 120;
  const cy = 100;
  const r = 80;
  const needleX = cx + Math.cos(rad) * r;
  const needleY = cy - Math.sin(rad) * r;

  // Build arc segments for the colored gauge
  const segments = [
    { from: 180, to: 144, color: "#f43f5e" },
    { from: 144, to: 108, color: "#f97316" },
    { from: 108, to: 72, color: "#eab308" },
    { from: 72, to: 36, color: "#10b981" },
    { from: 36, to: 0, color: "#22c55e" },
  ];

  const arcPath = (from: number, to: number, radius: number) => {
    const f = (from * Math.PI) / 180;
    const t = (to * Math.PI) / 180;
    const x1 = cx + Math.cos(f) * radius;
    const y1 = cy - Math.sin(f) * radius;
    const x2 = cx + Math.cos(t) * radius;
    const y2 = cy - Math.sin(t) * radius;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="relative">
        <svg viewBox="0 0 240 130" width="240" height="130">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background arc */}
          {segments.map((seg, i) => (
            <path
              key={i}
              d={arcPath(seg.from, seg.to, r)}
              stroke={seg.color}
              strokeOpacity={0.25}
              strokeWidth={14}
              fill="none"
              strokeLinecap="butt"
            />
          ))}

          {/* Active segment up to the needle */}
          {segments.map((seg, i) => {
            if (seg.to > angle) return null;
            const startAngle = seg.from < angle ? angle : seg.from;
            return (
              <path
                key={`a-${i}`}
                d={arcPath(startAngle, seg.to, r)}
                stroke={seg.color}
                strokeWidth={14}
                fill="none"
                strokeLinecap="butt"
                filter="url(#glow)"
                opacity={0.95}
              />
            );
          })}

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((val) => {
            const a = ((180 - (val / 100) * 180) * Math.PI) / 180;
            const x1 = cx + Math.cos(a) * (r - 12);
            const y1 = cy - Math.sin(a) * (r - 12);
            const x2 = cx + Math.cos(a) * (r - 20);
            const y2 = cy - Math.sin(a) * (r - 20);
            return (
              <line
                key={val}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#475569"
                strokeWidth={1.5}
              />
            );
          })}

          {/* Needle with glow */}
          <motion.line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill={color}
            filter="url(#glow)"
          />
          <circle cx={cx} cy={cy} r={3} fill="#020617" />

          {/* Scale labels */}
          <text x={cx - r} y={cy + 20} fontSize={8} fill="#64748b" textAnchor="middle">
            Fear
          </text>
          <text x={cx} y={cy - r - 6} fontSize={8} fill="#64748b" textAnchor="middle">
            Neutral
          </text>
          <text x={cx + r} y={cy + 20} fontSize={8} fill="#64748b" textAnchor="middle">
            Greed
          </text>
        </svg>
      </div>

      <div className="text-center sm:text-right">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Sentiment Score
        </div>
        <div
          className="mt-1 font-mono text-4xl font-bold"
          style={{ color, textShadow: `0 0 20px ${color}66` }}
        >
          {Math.round(score)}
        </div>
        <div
          className="mt-1 text-xs font-bold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Avg 24h: {avgChange >= 0 ? "+" : ""}
          {avgChange.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

