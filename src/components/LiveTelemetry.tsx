"use client";

import { useEffect, useState } from "react";

/**
 * Subtle animated background. Columns of hex/binary text drift down slowly.
 * Pure CSS animations, no canvas, so it's light on CPU.
 */
export default function LiveTelemetry() {
  const [isClient, setIsClient] = useState(false);

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

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.05]">
      {Array.from({ length: cols }).map((_, i) => {
        const duration = 28 + (i % 7) * 4; // 28s-52s
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

      {/* horizontal ticker band near the bottom */}
      <div
        className="absolute bottom-[12%] left-0 right-0 whitespace-nowrap font-mono text-[10px] text-cyan-400"
        style={{ animation: "telemetryScroll 45s linear infinite" }}
      >
        {" // TELEMETRY 0xA4F2 · SPX +0.42% · NDX +0.91% · RISK 0.18σ · LATENCY 12ms · FEED OK · 0xB31C · SIGNAL 98.4% · PRED 7d +2.1% ".repeat(
          6
        )}
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
        @keyframes telemetryScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
