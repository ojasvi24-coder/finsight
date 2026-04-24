"use client";

import { useMemo } from "react";
import { AlertTriangle, TrendingDown, Droplet } from "lucide-react";
import { forecastSeries } from "@/lib/math";

interface Props {
  currentBalance: number;
  monthlyNetFlow: number; // income - expenses
  historicalBalances?: number[]; // optional, past months
}

/**
 * Predictive Liquidity Forecast.
 * Uses exponential-smoothing ARIMA(0,1,1)-style forecast with 95% CI.
 * Flags the month the forecast crosses zero — the "bottleneck".
 */
export default function LiquidityForecast({
  currentBalance,
  monthlyNetFlow,
  historicalBalances,
}: Props) {
  const forecast = useMemo(() => {
    // If we don't have real history, synthesize it from the known ending balance
    // running backward via the monthly net flow — so the forecast makes sense.
    const history =
      historicalBalances && historicalBalances.length >= 3
        ? historicalBalances
        : Array.from({ length: 6 }).map(
            (_, i) => currentBalance - monthlyNetFlow * (5 - i)
          );

    const out = forecastSeries(history, 12, 0.4);

    // Find the first month where lower95 or value crosses zero (bottleneck)
    const bottleneck = out.findIndex(
      (p) => p.value < 0 || p.lower95 < 0
    );

    // For plotting
    const allVals = [
      ...history,
      ...out.map((p) => p.value),
      ...out.map((p) => p.lower95),
      ...out.map((p) => p.upper95),
    ];
    const maxV = Math.max(...allVals);
    const minV = Math.min(...allVals, 0); // always include 0 line

    const w = 600;
    const h = 180;
    const pad = 20;
    const totalPoints = history.length + out.length;
    const stepX = (w - pad * 2) / (totalPoints - 1);
    const toY = (v: number) =>
      h - pad - ((v - minV) / (maxV - minV)) * (h - pad * 2);

    const makePath = (
      data: number[] | typeof out,
      getX: (i: number) => number,
      getV: (i: number) => number
    ) =>
      data
        .map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${toY(getV(i))}`)
        .join(" ");

    const historyPath = makePath(
      history,
      (i) => pad + i * stepX,
      (i) => history[i]
    );
    const forecastPath = makePath(
      out,
      (i) => pad + (history.length + i) * stepX,
      (i) => out[i].value
    );
    // CI band: upper path + reverse lower
    const upperPoints = out.map(
      (p, i) => [pad + (history.length + i) * stepX, toY(p.upper95)] as const
    );
    const lowerPoints = out.map(
      (p, i) => [pad + (history.length + i) * stepX, toY(p.lower95)] as const
    );
    const bandPath =
      upperPoints.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ") +
      " " +
      lowerPoints
        .slice()
        .reverse()
        .map(([x, y]) => `L ${x} ${y}`)
        .join(" ") +
      " Z";

    const zeroY = toY(0);

    return {
      history,
      out,
      bottleneck,
      w,
      h,
      pad,
      historyPath,
      forecastPath,
      bandPath,
      zeroY,
      stepX,
    };
  }, [currentBalance, monthlyNetFlow, historicalBalances]);

  const hasBottleneck =
    forecast.bottleneck >= 0 && forecast.bottleneck < forecast.out.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            12-Month Liquidity Forecast
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          ARIMA(0,1,1) · α=0.4
        </span>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
        <svg viewBox={`0 0 ${forecast.w} ${forecast.h}`} className="h-auto w-full">
          {/* Zero line */}
          <line
            x1={forecast.pad}
            y1={forecast.zeroY}
            x2={forecast.w - forecast.pad}
            y2={forecast.zeroY}
            stroke="#f43f5e"
            strokeDasharray="3 3"
            strokeWidth={1}
            opacity={0.5}
          />
          <text
            x={forecast.pad}
            y={forecast.zeroY - 3}
            fill="#f43f5e"
            fontSize={9}
            fontFamily="monospace"
          >
            0
          </text>

          {/* Forecast division marker */}
          <line
            x1={forecast.pad + (forecast.history.length - 1) * forecast.stepX}
            y1={20}
            x2={forecast.pad + (forecast.history.length - 1) * forecast.stepX}
            y2={forecast.h - forecast.pad}
            stroke="#475569"
            strokeDasharray="2 3"
            strokeWidth={1}
          />
          <text
            x={forecast.pad + (forecast.history.length - 1) * forecast.stepX + 4}
            y={28}
            fill="#94a3b8"
            fontSize={9}
            fontFamily="monospace"
          >
            now
          </text>

          {/* 95% CI band */}
          <path d={forecast.bandPath} fill="#10b981" opacity={0.12} />

          {/* Actual history */}
          <path
            d={forecast.historyPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={2}
          />
          {/* Forecast line */}
          <path
            d={forecast.forecastPath}
            fill="none"
            stroke="#10b981"
            strokeWidth={2.5}
            strokeDasharray="0"
          />

          {/* Bottleneck marker */}
          {hasBottleneck && (
            <>
              <circle
                cx={
                  forecast.pad +
                  (forecast.history.length + forecast.bottleneck) * forecast.stepX
                }
                cy={forecast.zeroY}
                r={6}
                fill="#f43f5e"
                stroke="#020617"
                strokeWidth={2}
              />
              <text
                x={
                  forecast.pad +
                  (forecast.history.length + forecast.bottleneck) * forecast.stepX +
                  10
                }
                y={forecast.zeroY - 8}
                fill="#f43f5e"
                fontSize={10}
                fontFamily="monospace"
                fontWeight={700}
              >
                bottleneck
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Readout */}
      {hasBottleneck ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/[0.08] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              Projected bottleneck in ~{forecast.bottleneck + 1} month
              {forecast.bottleneck === 0 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              At your current net cash flow of{" "}
              <span className="font-mono font-bold">
                ${monthlyNetFlow.toLocaleString()}/mo
              </span>
              , projected balance crosses zero around month{" "}
              {forecast.bottleneck + 1}. Cut discretionary spend or boost income
              before then.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4">
          <TrendingDown className="mt-0.5 h-4 w-4 flex-shrink-0 rotate-180 text-emerald-400" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              No liquidity bottleneck detected
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Your forecast balance stays positive across the 12-month horizon
              even at the 95% worst-case confidence bound. Keep it up.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
