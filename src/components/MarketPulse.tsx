"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Market Pulse — Fear & Greed gauge.
 * Neon needle on a semicircle that drifts gently to feel "live".
 *
 * Pass a sentiment value 0-100. Defaults to drifting around 62.
 */
interface MarketPulseProps {
  value?: number;
  label?: string;
}

export default function MarketPulse({ value, label }: MarketPulseProps) {
  const [v, setV] = useState(value ?? 62);

  useEffect(() => {
    if (value !== undefined) {
      setV(value);
      return;
    }
    const id = setInterval(() => {
      setV((prev) => {
        const drift = (Math.random() - 0.5) * 4;
        return Math.max(5, Math.min(95, prev + drift));
      });
    }, 3000);
    return () => clearInterval(id);
  }, [value]);

  const sentimentLabel =
    v < 25
      ? "Extreme Fear"
      : v < 45
      ? "Fear"
      : v < 55
      ? "Neutral"
      : v < 75
      ? "Greed"
      : "Extreme Greed";
  const sentimentColor =
    v < 25
      ? "#f43f5e"
      : v < 45
      ? "#f97316"
      : v < 55
      ? "#eab308"
      : v < 75
      ? "#10b981"
      : "#06b6d4";

  // Map 0..100 → -90° to 90° needle rotation
  const angle = -90 + (v / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label ?? "Market Pulse"}
      </div>

      <div className="relative mt-2 w-full max-w-[200px]">
        <svg viewBox="0 0 200 120" className="h-auto w-full">
          <defs>
            <linearGradient id="pulseArc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Arc track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#pulseArc)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Inner arc outline */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#pulseArc)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Needle base */}
          <circle cx="100" cy="100" r="6" fill="#020617" stroke={sentimentColor} strokeWidth="2" />
          <circle cx="100" cy="100" r="2.5" fill={sentimentColor} filter="url(#needleGlow)" />

          {/* Animated needle */}
          <motion.line
            x1="100"
            y1="100"
            x2="100"
            y2="28"
            stroke={sentimentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#needleGlow)"
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "100px 100px" }}
          />

          {/* Min/Max labels */}
          <text x="20" y="118" fill="#64748b" fontSize="8" fontFamily="monospace">
            0
          </text>
          <text x="180" y="118" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">
            100
          </text>
        </svg>
      </div>

      {/* Value + sentiment label */}
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className="font-mono text-2xl font-bold"
          style={{ color: sentimentColor }}
        >
          {Math.round(v)}
        </span>
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: sentimentColor }}
        >
          {sentimentLabel}
        </span>
      </div>
    </div>
  );
}
