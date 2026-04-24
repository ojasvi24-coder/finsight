"use client";

import { useMemo } from "react";
import { Zap, AlertCircle, Check, TrendingDown, Info } from "lucide-react";
import { useFinance } from "@/lib/finance";

/**
 * Scans the user's positions for unrealized losses that could be harvested
 * to offset capital gains. This is UI + logic — it flags opportunities
 * but cannot execute trades (that would require broker API integration).
 */
export default function TaxLossHarvest() {
  const { positions, update, portfolioUnrealizedPnL } = useFinance();

  const analysis = useMemo(() => {
    const items = positions.map((p) => {
      const marketValue = p.shares * p.currentPrice;
      const costBasis = p.shares * p.costBasis;
      const pnl = marketValue - costBasis;
      const pnlPct = costBasis === 0 ? 0 : (pnl / costBasis) * 100;
      // Harvest threshold: position is down >= 10% OR dollar loss >= $1,000
      const harvestEligible = pnl <= -1000 || pnlPct <= -10;
      const estimatedTaxOffset = harvestEligible ? Math.abs(pnl) * 0.25 : 0; // assume 25% blended rate
      return {
        ...p,
        marketValue,
        costBasis,
        pnl,
        pnlPct,
        harvestEligible,
        estimatedTaxOffset,
      };
    });
    const opportunities = items.filter((i) => i.harvestEligible);
    const totalLoss = opportunities.reduce((s, i) => s + Math.abs(i.pnl), 0);
    const totalOffset = opportunities.reduce(
      (s, i) => s + i.estimatedTaxOffset,
      0
    );
    return { items, opportunities, totalLoss, totalOffset };
  }, [positions]);

  const addDemoPosition = () => {
    const newPos = {
      id: `p${Date.now()}`,
      ticker: "NEW",
      shares: 10,
      costBasis: 100,
      currentPrice: 100,
    };
    update({ positions: [...positions, newPos] });
  };

  const updatePosition = (
    id: string,
    patch: Partial<(typeof positions)[number]>
  ) => {
    update({
      positions: positions.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const removePosition = (id: string) => {
    update({ positions: positions.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Tax-Loss Harvest Scanner
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          Est. offset · 25% blended rate
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Harvest Candidates"
          value={analysis.opportunities.length.toString()}
          accent={analysis.opportunities.length > 0 ? "amber" : "slate"}
        />
        <SummaryCard
          label="Eligible Loss"
          value={`$${Math.round(analysis.totalLoss).toLocaleString()}`}
          accent="rose"
        />
        <SummaryCard
          label="Est. Tax Offset"
          value={`$${Math.round(analysis.totalOffset).toLocaleString()}`}
          accent="emerald"
        />
      </div>

      {/* Positions list */}
      <div className="space-y-2">
        {analysis.items.map((p) => {
          const down = p.pnl < 0;
          return (
            <div
              key={p.id}
              className={`rounded-lg border p-3 ${
                p.harvestEligible
                  ? "border-amber-500/30 bg-amber-500/[0.06]"
                  : "border-slate-800 bg-slate-950/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <input
                    value={p.ticker}
                    onChange={(e) =>
                      updatePosition(p.id, {
                        ticker: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-16 rounded border border-slate-700 bg-slate-950/60 px-2 py-1 font-mono text-xs font-bold text-white outline-none focus:border-emerald-500/50"
                  />
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400">
                    <label>
                      Shares
                      <input
                        type="number"
                        value={p.shares}
                        onChange={(e) =>
                          updatePosition(p.id, {
                            shares: Number(e.target.value),
                          })
                        }
                        className="w-14 rounded border border-slate-700 bg-slate-950/60 px-1 py-0.5 font-mono text-white outline-none focus:border-emerald-500/50"
                      />
                    </label>
                    <label>
                      Cost
                      <input
                        type="number"
                        value={p.costBasis}
                        onChange={(e) =>
                          updatePosition(p.id, {
                            costBasis: Number(e.target.value),
                          })
                        }
                        className="w-16 rounded border border-slate-700 bg-slate-950/60 px-1 py-0.5 font-mono text-white outline-none focus:border-emerald-500/50"
                      />
                    </label>
                    <label>
                      Price
                      <input
                        type="number"
                        value={p.currentPrice}
                        onChange={(e) =>
                          updatePosition(p.id, {
                            currentPrice: Number(e.target.value),
                          })
                        }
                        className="w-16 rounded border border-slate-700 bg-slate-950/60 px-1 py-0.5 font-mono text-white outline-none focus:border-emerald-500/50"
                      />
                    </label>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono text-sm font-bold ${
                      down ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {down ? "" : "+"}${Math.round(p.pnl).toLocaleString()}
                  </div>
                  <div
                    className={`font-mono text-[10px] ${
                      down ? "text-rose-500" : "text-emerald-500"
                    }`}
                  >
                    {down ? "" : "+"}
                    {p.pnlPct.toFixed(1)}%
                  </div>
                </div>
                <button
                  onClick={() => removePosition(p.id)}
                  className="rounded p-1 text-slate-600 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>

              {p.harvestEligible && (
                <div className="mt-2 flex items-center gap-2 rounded border border-amber-500/20 bg-amber-500/[0.05] p-2 text-[11px]">
                  <AlertCircle className="h-3 w-3 flex-shrink-0 text-amber-400" />
                  <span className="text-slate-300">
                    <strong className="text-amber-300">Harvest opportunity.</strong>{" "}
                    Selling this could offset ~$
                    {Math.round(p.estimatedTaxOffset).toLocaleString()} in capital
                    gains taxes. Watch the 30-day wash sale rule.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addDemoPosition}
        className="w-full rounded-lg border border-dashed border-slate-700 bg-slate-950/40 py-2 text-xs font-semibold text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
      >
        + Add position
      </button>

      <div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-[11px] leading-relaxed text-slate-400">
        <Info className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-500" />
        <span>
          FinSight flags harvest opportunities based on your entered cost basis.
          To execute trades automatically, broker API integration (Alpaca,
          Plaid, etc.) would be required — this is intentionally a read-only
          advisor to keep your accounts safe.
        </span>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "amber" | "rose" | "emerald" | "slate";
}) {
  const colorMap = {
    amber: "text-amber-400",
    rose: "text-rose-400",
    emerald: "text-emerald-400",
    slate: "text-slate-300",
  };
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className={`mt-0.5 font-mono text-lg font-bold ${colorMap[accent]}`}>
        {value}
      </div>
    </div>
  );
}
