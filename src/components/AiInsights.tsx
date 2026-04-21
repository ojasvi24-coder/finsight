"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp,
  Info,
  Lightbulb,
  ShieldCheck,
  Zap // Make sure Zap is right here!
} from "lucide-react";

interface AIInsight {
  id: number;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  details: {
    metric: string;
    current: string;
    target?: string;
    variance?: string;
    trend: string;
    recommendation: string;
    benchmark?: string;
  };
  severity?: "high" | "medium" | "low";
  impact?: string;
}

interface AIInsightsProps {
  insights?: AIInsight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"all" | "warning" | "success" | "info">("all");

  const defaultInsights: AIInsight[] = [
    {
      id: 1,
      type: "warning",
      title: "Discretionary Spending Alert",
      message: "Dining expenses rose 18% this month ($820 → $970). You're tracking 5% over your $400/month target.",
      details: {
        metric: "Dining & Entertainment",
        current: "$970",
        target: "$400",
        variance: "+142%",
        trend: "↑ Increasing",
        recommendation: "Implement meal prepping 3x/week to reduce restaurant visits. This alone could save $200/month."
      },
      severity: "high",
      impact: "If this trend continues, you'll overspend by $6,840 annually"
    },
    {
      id: 2,
      type: "success",
      title: "Savings Rate Exceeds Goal",
      message: "You saved 24% of your income this month. You're on track for your Q3 investment goals (22% target).",
      details: {
        metric: "Savings Rate",
        current: "24%",
        target: "20%",
        variance: "+4%",
        trend: "↑ Improving",
        recommendation: "At this rate, you'll accumulate $8,400 in savings this quarter. Consider increasing your investment contributions to 10% of income."
      },
      severity: "low",
      impact: "Maintaining this rate puts you $1,200 ahead of your annual savings goal"
    },
    {
      id: 3,
      type: "info",
      title: "Housing Cost Optimization",
      message: "Top category: Housing (45%). This is optimal for the Bay Area market ($2,800/month).",
      details: {
        metric: "Housing Cost Ratio",
        current: "45%",
        target: "40%",
        variance: "+5%",
        benchmark: "30-40% (Standard) | 50%+ (Bay Area)",
        trend: "→ Stable",
        recommendation: "Your housing cost is 5% above the Bay Area average. Consider exploring refinancing options or roommate arrangements if possible."
      },
      severity: "medium",
      impact: "Reducing housing by 5% ($140) would free up $1,680/year for investments"
    },
    {
      id: 4,
      type: "success",
      title: "Investment Portfolio Growth",
      message: "Your investment contributions have grown by 12% YTD. You're on pace to reach $62,000 by end of year.",
      details: {
        metric: "Investment Growth",
        current: "$49,000",
        target: "$62,000",
        variance: "+12% YTD",
        trend: "↑ On Track",
        recommendation: "At your current $800/month contribution rate, you'll exceed your goal. Consider rebalancing between index funds (70%), bonds (20%), and cash (10%)."
      },
      severity: "low",
      impact: "On track to accumulate $156,000 over 3 years with compound growth"
    },
    {
      id: 5,
      type: "warning",
      title: "Utility Spending Anomaly",
      message: "Utilities spiked 32% in June ($180 → $238). Check for AC usage during heat wave.",
      details: {
        metric: "Monthly Utilities",
        current: "$238",
        benchmark: "$180",
        variance: "+32%",
        trend: "↑ Spike Detected",
        recommendation: "Typical summer spike. Consider installing a programmable thermostat to reduce peak usage. One-time cost of $150 saves $30-40/month in summer."
      },
      severity: "medium",
      impact: "Seasonal adjustment expected; monitor for October reversion"
    },
    {
      id: 6,
      type: "info",
      title: "Tax-Advantaged Account Progress",
      message: "You've contributed $6,000 to your Roth IRA (60% of $10,000 annual goal). On track to max it out by July.",
      details: {
        metric: "Roth IRA Contributions",
        current: "$6,000",
        target: "$10,000",
        variance: "+60% of goal",
        trend: "→ On Schedule",
        recommendation: "Accelerate remaining $4,000 by July 15 to maximize tax-free growth window. Every $1,000 saved now grows to ~$4,200 in 20 years at 8% returns."
      },
      severity: "low",
      impact: "Tax savings: ~$1,500/year on $10,000 contribution"
    },
    {
      id: 7,
      type: "success",
      title: "Debt Paydown Acceleration",
      message: "Student loan principal decreased by $2,400 this quarter. You're ahead of schedule by 8%.",
      details: {
        metric: "Debt Reduction",
        current: "Quarter: -$2,400",
        target: "-$2,200",
        variance: "+$200 ahead",
        trend: "↑ Accelerating",
        recommendation: "Continue with aggressive paydown. At current pace, you'll be debt-free 6 months early, saving ~$3,200 in interest."
      },
      severity: "low",
      impact: "Early payoff saves $8,000+ in lifetime interest costs"
    },
  ];

  const displayInsights = insights || defaultInsights;
  const filtered = selectedType === "all" 
    ? displayInsights 
    : displayInsights.filter(insight => insight.type === selectedType);

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      case "success":
        return <TrendingUp className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  <Sparkles className="w-6 h-6 text-purple-500 animate-ai-glow" />

  const getColors = (type: string, severity?: string) => {
    if (type === "warning") {
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        icon: "text-amber-500",
        badge: "bg-amber-500/20 text-amber-400",
      };
    }
    if (type === "success") {
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        icon: "text-emerald-500",
        badge: "bg-emerald-500/20 text-emerald-400",
      };
    }
    return {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      icon: "text-cyan-500",
      badge: "bg-cyan-500/20 text-cyan-400",
    };
  };

  return (
    <div className="w-full space-y-6 bg-slate-900/40 border border-slate-800/50 backdrop-blur-lg rounded-xl p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-6 h-6 text-cyan-400" />
            </motion.div>
            AI Financial Insights
          </h2>
          <span className="text-sm text-slate-400 px-3 py-1 rounded-full bg-slate-800/50">
            {filtered.length} insights
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", "warning", "success", "info"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                selectedType === type
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {type === "all" ? "All Insights" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((insight) => {
            const colors = getColors(insight.type, insight.severity);
            const isExpanded = expandedId === insight.id;

            return (
              <motion.div
                key={insight.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`rounded-xl border backdrop-blur-md overflow-hidden ${colors.bg} ${colors.border}`}
              >
                {/* Main Content */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                  className="w-full p-4 hover:bg-slate-900/20 transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`mt-1 p-2 rounded-lg ${colors.badge}`}>
                      {getIcon(insight.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-white text-base mb-1">
                            {insight.title}
                          </h3>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {insight.message}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={colors.icon}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {insight.severity && (
                          <span
                            className={`text-xs px-2 py-1 rounded font-semibold ${
                              insight.severity === "high"
                                ? "bg-red-500/20 text-red-400"
                                : insight.severity === "medium"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)} Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-700/30"
                    >
                      <div className="p-4 space-y-4 bg-slate-900/30">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-xs text-slate-500 mb-1">
                              {insight.details.metric}
                            </p>
                            <p className="text-lg font-bold text-cyan-400">
                              {insight.details.current}
                            </p>
                          </div>

                          {insight.details.target && (
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-xs text-slate-500 mb-1">Target</p>
                              <p className="text-lg font-bold text-emerald-400">
                                {insight.details.target}
                              </p>
                            </div>
                          )}

                          {insight.details.variance && (
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-xs text-slate-500 mb-1">Variance</p>
                              <p className={`text-lg font-bold ${
                                insight.details.variance.startsWith("+")
                                  ? insight.type === "success"
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                  : "text-emerald-400"
                              }`}>
                                {insight.details.variance}
                              </p>
                            </div>
                          )}

                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-xs text-slate-500 mb-1">Trend</p>
                            <p className="text-lg font-bold text-slate-300">
                              {insight.details.trend}
                            </p>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-lg p-4 border border-cyan-500/20">
                          <p className="text-xs font-bold text-cyan-400 mb-2">AI RECOMMENDATION</p>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {insight.details.recommendation}
                          </p>
                        </div>

                        {/* Impact */}
                        {insight.impact && (
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                            <p className="text-xs font-bold text-slate-400 mb-2">💰 FINANCIAL IMPACT</p>
                            <p className="text-sm text-slate-300">
                              {insight.impact}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
      >
        <p className="text-sm text-slate-400 mb-2">
          💡 <span className="font-semibold text-slate-300">Optimization Potential:</span> Following these recommendations could save you <span className="text-emerald-400 font-bold">$8,400+ annually</span> and accelerate wealth accumulation by 2-3 years.
        </p>
      </motion.div>
    </div>
  );
}
