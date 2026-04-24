"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Target,
  Wallet,
  Droplet,
  Shield,
} from "lucide-react";
import { useFinance } from "@/lib/finance";
import { forecastSeries, stdDev, mean } from "@/lib/math";
import MarketPulse from "@/components/MarketPulse";

/**
 * War Room — multi-column high-density layout inspired by Bloomberg Terminal.
 * Renders everything on one screen: net worth, live telemetry, liquidity,
 * risk, guardrail state, position P&L. No scrolling inside panels.
 */
export default function WarRoomView() {
  const {
    netWorth,
    currentBalance,
    monthlyIncome,
    totalExpenses,
    netCashFlow,
    savingsRate,
    transactions,
    positions,
    sectors,
    portfolioValue,
    portfolioUnrealizedPnL,
    portfolioCostBasis,
    emergencyFundCurrent,
    emergencyFundTarget,
  } = useFinance();

  // --- Compute quick signals ---
  const liquidityForecast = useMemo(() => {
    const history = Array.from({ length: 6 }).map(
      (_, i) => currentBalance - netCashFlow * (5 - i)
    );
    const f = forecastSeries(history, 12, 0.4);
    const bottleneck = f.findIndex((p) => p.value < 0 || p.lower95 < 0);
    return {
      bottleneck: bottleneck >= 0 ? bottleneck + 1 : null,
      endValue: f[f.length - 1]?.value ?? currentBalance,
    };
  }, [currentBalance, netCashFlow]);

  const anomalies = useMemo(() => {
    const byCat: Record<string, number[]> = {};
    transactions.forEach((t) => {
      byCat[t.category] = byCat[t.category] || [];
      byCat[t.category].push(t.amount);
    });
    return Object.entries(byCat)
      .map(([cat, amounts]) => {
        const m = mean(amounts);
        const s = stdDev(amounts);
        const latest = amounts[amounts.length - 1];
        const z = s === 0 ? 0 : (latest - m) / s;
        return { cat, z, flagged: z > 2 };
      })
      .sort((a, b) => b.z - a.z);
  }, [transactions]);

  const totalSectorWeight = sectors.reduce((s, x) => s + x.weight, 0);
  const avgRisk =
    sectors.reduce((s, x) => s + x.risk * x.weight, 0) / Math.max(1, totalSectorWeight);

  const fmtUsd = (v: number) => {
    const sign = v < 0 ? "-" : "";
    return `${sign}$${Math.abs(Math.round(v)).toLocaleString()}`;
  };

  const harvestCandidates = positions.filter(
    (p) => p.currentPrice < p.costBasis && (p.costBasis - p.currentPrice) * p.shares >= 500
  );

  const emergencyGap = Math.max(0, emergencyFundTarget - emergencyFundCurrent);
  const emergencyPct = Math.min(100, (emergencyFundCurrent / emergencyFundTarget) * 100);

  return (
    <div className="space-y-3">
      {/* Top stat strip — 6 rolling metrics */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <StatTile
          label="NET WORTH"
          value={fmtUsd(netWorth)}
          color="white"
        />
        <StatTile
          label="LIQUID BALANCE"
          value={fmtUsd(currentBalance)}
          color="white"
        />
        <StatTile
          label="PORTFOLIO VALUE"
          value={fmtUsd(portfolioValue)}
          color="white"
        />
        <StatTile
          label="UNREALIZED P&L"
          value={fmtUsd(portfolioUnrealizedPnL)}
          color={portfolioUnrealizedPnL >= 0 ? "emerald" : "rose"}
        />
        <StatTile
          label="NET CASH FLOW"
          value={`${fmtUsd(netCashFlow)}/mo`}
          color={netCashFlow >= 0 ? "emerald" : "rose"}
        />
        <StatTile
          label="SAVINGS RATE"
          value={`${savingsRate.toFixed(1)}%`}
          color={
            savingsRate >= 20 ? "emerald" : savingsRate > 0 ? "amber" : "rose"
          }
        />
      </div>

      {/* Main 4-column grid */}
      <div className="grid gap-3 lg:grid-cols-4">
        {/* COL 1 — Position book */}
        <Panel title="POSITION BOOK" icon={Wallet}>
          <div className="divide-y divide-slate-800 text-[11px]">
            <div className="grid grid-cols-4 gap-1 pb-1 font-mono text-[10px] font-bold text-slate-500">
              <span>TKR</span>
              <span className="text-right">QTY</span>
              <span className="text-right">MV</span>
              <span className="text-right">P&L</span>
            </div>
            {positions.map((p) => {
              const mv = p.shares * p.currentPrice;
              const pnl = mv - p.shares * p.costBasis;
              const down = pnl < 0;
              return (
                <div
                  key={p.id}
                  className="grid grid-cols-4 gap-1 py-1.5 font-mono"
                >
                  <span className="font-bold text-white">{p.ticker}</span>
                  <span className="text-right text-slate-300">{p.shares}</span>
                  <span className="text-right text-slate-300">
                    {fmtUsd(mv).replace("$", "")}
                  </span>
                  <span
                    className={`text-right font-bold ${
                      down ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {down ? "" : "+"}
                    {fmtUsd(pnl).replace("$", "")}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 border-t border-slate-800 pt-2 font-mono text-[10px] text-slate-500">
            TOTAL COST{" "}
            <span className="float-right text-slate-300">
              {fmtUsd(portfolioCostBasis)}
            </span>
          </div>
        </Panel>

        {/* COL 2 — Risk telemetry */}
        <Panel title="RISK TELEMETRY" icon={Shield}>
          <div className="flex flex-col items-center">
            <MarketPulse value={Math.round(100 - avgRisk)} label="Risk Score" />
          </div>
          <div className="mt-3 space-y-1 border-t border-slate-800 pt-2">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">AVG SECTOR RISK</span>
              <span className="font-bold text-white">
                {avgRisk.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">SECTORS {">"} 65σ</span>
              <span className="font-bold text-amber-400">
                {sectors.filter((s) => s.risk > 65).length}
              </span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Σ WEIGHT</span>
              <span className="font-bold text-slate-200">
                {totalSectorWeight}%
              </span>
            </div>
          </div>
        </Panel>

        {/* COL 3 — Liquidity + cashflow */}
        <Panel title="LIQUIDITY" icon={Droplet}>
          <div className="space-y-2">
            <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
              <div className="font-mono text-[10px] text-slate-500">
                MONTHLY INCOME
              </div>
              <div className="font-mono text-sm font-bold text-emerald-400">
                {fmtUsd(monthlyIncome)}
              </div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/60 p-2">
              <div className="font-mono text-[10px] text-slate-500">
                MONTHLY EXPENSES
              </div>
              <div className="font-mono text-sm font-bold text-rose-400">
                {fmtUsd(totalExpenses)}
              </div>
            </div>
            <div
              className={`rounded border p-2 ${
                liquidityForecast.bottleneck
                  ? "border-rose-500/30 bg-rose-500/[0.06]"
                  : "border-emerald-500/20 bg-emerald-500/[0.05]"
              }`}
            >
              <div className="font-mono text-[10px] text-slate-400">
                12M FORECAST
              </div>
              <div
                className={`font-mono text-sm font-bold ${
                  liquidityForecast.bottleneck
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              >
                {liquidityForecast.bottleneck
                  ? `⚠ BOTTLENECK M${liquidityForecast.bottleneck}`
                  : "STABLE"}
              </div>
              <div className="font-mono text-[10px] text-slate-500">
                end: {fmtUsd(liquidityForecast.endValue)}
              </div>
            </div>
          </div>
        </Panel>

        {/* COL 4 — Alerts / Signals */}
        <Panel title="ACTIVE SIGNALS" icon={AlertTriangle}>
          <div className="space-y-1.5 text-[11px]">
            {harvestCandidates.length > 0 && (
              <SignalRow
                icon={Zap}
                label={`${harvestCandidates.length} tax-loss candidate${
                  harvestCandidates.length === 1 ? "" : "s"
                }`}
                color="amber"
              />
            )}
            {anomalies.filter((a) => a.flagged).length > 0 && (
              <SignalRow
                icon={TrendingUp}
                label={`${anomalies.filter((a) => a.flagged).length} category >2σ`}
                color="rose"
              />
            )}
            {liquidityForecast.bottleneck && (
              <SignalRow
                icon={AlertTriangle}
                label={`Cash bottleneck in ${liquidityForecast.bottleneck}mo`}
                color="rose"
              />
            )}
            {emergencyGap > 0 && (
              <SignalRow
                icon={Target}
                label={`Emergency fund ${emergencyPct.toFixed(0)}% · ${fmtUsd(
                  emergencyGap
                )} to go`}
                color="cyan"
              />
            )}
            {savingsRate >= 20 && (
              <SignalRow
                icon={TrendingUp}
                label={`Savings rate ${savingsRate.toFixed(0)}% — on track`}
                color="emerald"
              />
            )}
            {portfolioUnrealizedPnL > 0 && (
              <SignalRow
                icon={TrendingUp}
                label={`Portfolio up ${fmtUsd(portfolioUnrealizedPnL)}`}
                color="emerald"
              />
            )}
            {harvestCandidates.length === 0 &&
              anomalies.filter((a) => a.flagged).length === 0 &&
              !liquidityForecast.bottleneck &&
              emergencyGap === 0 && (
                <div className="py-4 text-center text-[10px] font-mono text-slate-600">
                  NO SIGNALS
                </div>
              )}
          </div>
        </Panel>
      </div>

      {/* Sector heatmap strip */}
      <Panel title="SECTOR EXPOSURE" icon={Activity} fullWidth>
        <div className="grid grid-cols-4 gap-1.5 md:grid-cols-8">
          {sectors.map((s) => {
            const bg =
              s.risk < 30
                ? "bg-emerald-500/70"
                : s.risk < 50
                ? "bg-emerald-600/60"
                : s.risk < 65
                ? "bg-amber-500/70"
                : s.risk < 75
                ? "bg-orange-500/75"
                : "bg-rose-500/80";
            return (
              <div
                key={s.name}
                className={`relative overflow-hidden rounded border border-slate-800 p-2 ${bg}`}
                title={`${s.name}: risk ${s.risk}, weight ${s.weight}%`}
              >
                <div className="absolute inset-0 bg-slate-950/55" />
                <div className="relative font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  {s.name.slice(0, 6)}
                </div>
                <div className="relative font-mono text-xs font-bold text-white">
                  {s.weight}%
                </div>
                <div
                  className={`relative font-mono text-[10px] font-bold ${
                    s.change >= 0 ? "text-emerald-200" : "text-rose-200"
                  }`}
                >
                  {s.change >= 0 ? "+" : ""}
                  {s.change.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  fullWidth,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border border-slate-800 bg-[#1E1E2E]/80 p-3 backdrop-blur-sm ${
        fullWidth ? "col-span-full" : ""
      }`}
    >
      <div className="mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
        <Icon className="h-3 w-3 text-emerald-400" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "white" | "emerald" | "rose" | "amber";
}) {
  const colorMap = {
    white: "text-white",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
  };
  return (
    <div className="rounded border border-slate-800 bg-[#1E1E2E]/80 px-3 py-2 backdrop-blur-sm">
      <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className={`mt-0.5 font-mono text-sm font-bold ${colorMap[color]}`}>
        {value}
      </div>
    </div>
  );
}

function SignalRow({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: "emerald" | "rose" | "amber" | "cyan";
}) {
  const colorMap = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.06]",
    rose: "text-rose-400 border-rose-500/20 bg-rose-500/[0.06]",
    amber: "text-amber-400 border-amber-500/20 bg-amber-500/[0.06]",
    cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-500/[0.06]",
  };
  return (
    <div
      className={`flex items-center gap-2 rounded border px-2 py-1.5 font-mono text-[10px] ${colorMap[color]}`}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      <span className="flex-1">{label}</span>
    </div>
  );
}
