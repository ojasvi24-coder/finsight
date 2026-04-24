"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Subtle animated background with a functional ticker strip.
 * Clicking any ticker symbol dispatches a 'finsight-asset-focus' event
 * that the dashboard listens for to overlay a correlation path on
 * the Net Worth Trend chart.
 */
export default function LiveTelemetry() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const cols = 14;
  const hexChars = "0123456789ABCDEF";
  const makeLine = (len: number, seed: number) => {
    let s = "";
    let v = seed;
    for (let i = 0; i < len; i++) {
      v = (v * 9301 + 49297) % 233280;
      s += hexChars[v % 16];
      if (i % 2 === 1) s += " ";
    }
    return s;
  };

  // Tickers that are clickable to focus on the dashboard chart
  const tickers = [
    { sym: "SPX", delta: "+0.42%" },
    { sym: "NDX", delta: "+0.91%" },
    { sym: "BTC", delta: "+1.32%" },
    { sym: "ETH", delta: "+1.06%" },
    { sym: "GLD", delta: "-0.18%" },
  ];

  const handleTickerClick = (sym: string) => {
    // Navigate to dashboard if not already there, then dispatch focus event
    if (typeof window !== "undefined") {
      if (!window.location.pathname.startsWith("/dashboard")) {
        router.push("/dashboard");
        // Delay dispatch until after navigation
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("finsight-asset-focus", { detail: { symbol: sym } })
          );
        }, 250);
      } else {
        window.dispatchEvent(
          new CustomEvent("finsight-asset-focus", { detail: { symbol: sym } })
        );
      }
    }
  };

  return (
    <>
      {/* Decorative falling hex background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.05]">
        {Array.from({ length: cols }).map((_, i) => {
          const duration = 28 + (i % 7) * 4;
          const delay = -(i * 2.7);
          const left = (i / cols) * 100;
          const line = makeLine(80, i * 13 + 7);
          return (
            <div
              key={i}
              className="absolute top-0 whitespace-pre font-mono text-[10px] leading-[1.4] text-emerald-400"
              style={{
                left: `${left}%`,
                writingMode: "vertical-rl",
                animation: `telemetryFall ${duration}s linear ${delay}s infinite`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* Functional clickable ticker bar — fixed near bottom, above fold */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 hidden border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md lg:block">
        <div className="pointer-events-auto mx-auto max-w-7xl overflow-hidden">
          <div
            className="flex items-center gap-6 whitespace-nowrap py-1.5 font-mono text-[11px]"
            style={{ animation: "tickerScroll 60s linear infinite" }}
          >
            {/* Duplicate the set for seamless loop */}
            {[...tickers, ...tickers, ...tickers].map((t, i) => {
              const up = t.delta.startsWith("+");
              return (
                <button
                  key={i}
                  onClick={() => handleTickerClick(t.sym)}
                  className="group flex items-center gap-2 rounded px-2 py-0.5 transition-all hover:bg-emerald-500/10"
                  title={`Click to overlay ${t.sym} correlation on the Net Worth chart`}
                >
                  <span className="font-bold text-slate-300 group-hover:text-emerald-300">
                    {t.sym}
                  </span>
                  <span
                    className={`${
                      up ? "text-emerald-400" : "text-rose-400"
                    } group-hover:brightness-125`}
                  >
                    {t.delta}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-600 group-hover:text-emerald-500">
                    focus
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes telemetryFall {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes tickerScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </>
  );
}
